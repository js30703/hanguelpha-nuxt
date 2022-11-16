import {H3Event} from 'h3'
import axios from 'axios'
import dayjs from 'dayjs'
import { Prisma } from '@prisma/client';
import prisma from '@/server/_prisma';

const HOW_MANY_DAYS = 2 // 리스트에 들어온 일 수
const axiosSS = axios.create({
  withCredentials:false,
})

export default defineEventHandler(async (event:H3Event) => {
  const TODAY = dayjs().format()
  const hourNow = dayjs().hour() * 100 + dayjs().minute()
  const stocks = await fetchRisingStockList()
  const timeMarketClose = (process.env.NODE_ENV == 'development' ) ? 1530 : 630
  const body = await readBody(event)
  if (body.key !== '==g&13^4b6e5t5i5aa5@#w0^x%jzlvcd(%_l1j4lfgj=7=(6#d') return{}
  if(hourNow > timeMarketClose){ 
    await prisma.dailyStocks.upsert({
      where:{stocks:JSON.stringify(stocks) },
      update:{},
      create:{date:TODAY, stocks:JSON.stringify(stocks)} as Prisma.DailyStocksCreateInput
    })
  }

  // 10일간의 데이터를 가져온다.
  const q = await prisma.dailyStocks.findMany({take: 10})

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
            return key.slice(0,4)+'::'+cur.columns[key].value
          })
          return acc
        },
        {})
    
    const closeYesterDay= response[0].data.dealTrendInfos[0].closePrice
    const closeToday = response[2].data.closePrice
    const ratioTradingMarketCap = (item.tradingValue * 0.01 / Number(totalInfos.marketValue.replaceAll(' ','').replaceAll(',','').replaceAll('억','').replaceAll('조','')) * 100).toFixed(2)
    
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
  .sort((a,b)=>{return b.ratioTradingMarketCap - a.ratioTradingMarketCap})
  .filter((item:any)=>{ return Number(item.ratioTradingMarketCap) >= 20 })

  
  // db에 저장
  if(hourNow > timeMarketClose){ 
    await prisma.dailyRank.upsert({
      where:{rank:JSON.stringify(rank) },
      update:{},
      create:{date:TODAY , rank:JSON.stringify(rank)} as Prisma.DailyRankCreateInput
    })
  }
  
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