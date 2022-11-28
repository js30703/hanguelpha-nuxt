import {H3Event} from 'h3'
import axios from 'axios'
import dayjs from 'dayjs'
import { Prisma } from '@prisma/client';
import prisma from '@/server/_prisma';
import { cutFixed } from '../../utils/mean';

const HOW_MANY_DAYS = 2 // 리스트에 들어온 일 수
const ratioTradingMarketCapMin = 2

const axiosSS = axios.create({
  withCredentials:false,
})

axiosSS.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default defineEventHandler(async (event:H3Event) => {
  const TODAY = dayjs().format()
  const hourNow = dayjs().hour() * 100 + dayjs().minute()
  // validate request
  const body = await readBody(event)
  if (body.key !== process.env.DURIAN_KEY) return;
  
  const timeMarketClose = (process.env.NODE_ENV == 'development' ) ? 1530 : 630
  if(hourNow < timeMarketClose){ return {message:'Invalid time'} }
  // 리스트 가져오기
  const stocks = await fetchRisingStockList()

  const STOCKS = await prisma.dailyStocks.findUnique({where:{stocks:JSON.stringify(stocks)}})
  if (STOCKS !== null) return {message:'no new data'}
  await prisma.dailyStocks.create({data:{date:TODAY, stocks:JSON.stringify(stocks)}})

  // 10일간의 데이터를 가져온다.
  const q = await prisma.dailyStocks.findMany({take: 10,orderBy:{date:'desc'}})

  // 거래대금으로 정렬하고 중복 등장한 종목만 남김 리스트로 변환
  const sorted_list = await mergeStockDailyHistory(q)

  // do request
  const _req_list =[]
  sorted_list.map(item=>{
      const url_detail_today = `https://m.stock.naver.com/api/stock/${item.code}/integration`
      const url_detail_3year = `https://m.stock.naver.com/api/stock/${item.code}/finance/annual`
      const url_detail_basic = `https://m.stock.naver.com/api/stock/${item.code}/basic`
      _req_list.push(axiosSS.get(url_detail_today))
      _req_list.push(axiosSS.get(url_detail_3year))
      _req_list.push(axiosSS.get(url_detail_basic))
  })
  const res_list = await Promise.all(_req_list)
  
  // 랭크 계산하기
  const rank = sorted_list.map((item,idx)=>{
    const response = [res_list[idx*3], res_list[idx*3+1], res_list[idx*3+2]]

    if (!response[1].data.financeInfo) return;

    
    const totalInfos = response[0].data.totalInfos
      .filter( item => {return ['EPS','BPS','시총',].includes(item.key)})
      .reduce(
        (acc,cur)=>{acc[cur.code] = cur.value; return acc},
        {})

    const annualFinance = response[1].data.financeInfo.rowList
      .filter( item => {return ['매출액','영업이익','당좌비율'].includes(item.title)})
      .reduce(
        (acc,cur)=>{
          acc[cur.title] = Object.keys(cur.columns).map(key=>{
            const year = key.slice(0,4)
            return year +'::'+cur.columns[key].value
          })
          return acc
        },
        {})
      
    const sales = annualFinance.매출액.slice(0,-1).map(item=>{cutFixed(item.split('::')[1])})
    const margins = annualFinance.영업이익.slice(0,-1).map(item=>{cutFixed(item.split('::')[1])})

    if (isDecrease(sales)) return;
    if (isDecrease(margins)) return;

    const closeYesterDay= response[0].data.dealTrendInfos[0].closePrice
    const closeToday = response[2].data.closePrice
    const ratioTradingMarketCap = (item.tradingValue * 0.01 * 0.1 / Number(totalInfos.marketValue.replaceAll(' ','').replaceAll(',','').replaceAll('억','').replaceAll('조','')) * 100).toFixed(2)
    
    return {
      ...item,
      summary:response[1].data.corporationSummary,
      closeYesterDay:closeYesterDay,
      closeToday:closeToday,
      ratioTradingMarketCap:ratioTradingMarketCap,
      ...totalInfos,
      ...annualFinance,
    }
  })
  .filter((item:any)=>{ return item !== null })
  .sort((a,b)=>{return b.ratioTradingMarketCap - a.ratioTradingMarketCap})
  .filter((item:any)=>{ return Number(item.ratioTradingMarketCap) >= ratioTradingMarketCapMin })

  
  // db에 저장
  await prisma.dailyRank.create({data:{date:TODAY, rank:JSON.stringify(rank)}})
  
  
  return {
    date:TODAY,
    length:rank.length,
    rank:rank
  }
})


interface StockDaily {
  name: string;
  code: string;
  close: string;
  ratio: number;
  tradingValue:string;
}

interface StockDailyTotal {
  name: string;
  code: string;
  tradingValue:number;
  detail:{
    date:Date;
    close: string;
    ratio: number;
    value: number;
  }[]
}

async function mergeKospiKosdaq (_stocks: any[]) {
  return _stocks
    // 주식이 아니면 제외
    .filter((item)=>{
      return item.stockEndType == 'stock'
    })
    // 데이터 남기기
    .map(item => {
      return {
        name: item.stockName,
        code: item.itemCode,
        close : item.closePrice, // 원
        ratio: Number(item.fluctuationsRatio), // 상승률
        tradingValue:`${item.accumulatedTradingValue}`, // 백만원
      } as StockDaily;
    })
    // 상승률 오름차순 정렬
    .sort((b,a) => { 
      if ( a == null ) return 1
      if (b == null ) return -1
      return a.ratio - b.ratio
  })
}
async function fetchRisingStockList(){
  const urlUpKosdaq = 'https://m.stock.naver.com/api/stocks/up/KOSDAQ?page=1&pageSize=60'
  const urlUpKospi = 'https://m.stock.naver.com/api/stocks/up/KOSPI?page=1&pageSize=60'
  const res = await Promise.all([
    axiosSS.get(urlUpKosdaq), 
    axiosSS.get(urlUpKospi)
  ])
  const _data = res[0].data.stocks.concat(res[1].data.stocks)
  return await mergeKospiKosdaq(_data)
}

async function mergeStockDailyHistory(q){
  let result = {}
  // 데이터 통합
  q.map( dailyStocks =>{
      JSON.parse(dailyStocks.stocks).map( (stock:StockDaily)=>{
        if(result[stock.code] == null){
          result[stock.code] = {
            name:stock.name,
            code:stock.code,
            tradingValue:Number(stock.tradingValue.replaceAll(',','')),
            detail:[{
              date:dailyStocks.date,
              close:stock.close,
              ratio:stock.ratio,
              value:Number(stock.tradingValue.replaceAll(',','')),
            }]
          } as StockDailyTotal
          return
        }
        result[stock.code].tradingValue += Number(stock.tradingValue.replaceAll(',',''))
        result[stock.code].detail.push({
          date:dailyStocks.date,
          close:stock.close,
          ratio:stock.ratio,
          value:Number(stock.tradingValue.replaceAll(',','')),
        })
    })
  })
  return Object.entries(result)
  .sort((b:[string,StockDailyTotal],a:[string,StockDailyTotal]) => { return a[1].tradingValue - b[1].tradingValue })
  .map((v:[string,StockDailyTotal])=>v[1])
// 몇번 이상 중복된 녀석만 남김
  .filter((item:StockDailyTotal)=>{ return item.detail.length >= HOW_MANY_DAYS })
}

function isDecrease(array){
  return array.every((item,idx)=>{
    if(idx === 0) return true
    return item / array[idx-1]  < 0.95
  })
}
