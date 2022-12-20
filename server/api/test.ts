import {H3Event} from 'h3'
import axios from 'axios'
import dayjs from 'dayjs'
import prisma from '@/server/_prisma';
import { cutFixed , isDecreasing} from '@/utils/mean';
import { apiErrorHandler } from '@/utils/error';
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

export default apiErrorHandler(async (event:H3Event) => {
  const TODAY = dayjs().format()

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
      const url_detail_price_candle = `https://api.stock.naver.com/chart/domestic/item/${item.code}?periodType=dayCandle`
      _req_list.push(axiosSS.get(url_detail_today))
      _req_list.push(axiosSS.get(url_detail_3year))
      _req_list.push(axiosSS.get(url_detail_basic))
      _req_list.push(axiosSS.get(url_detail_price_candle))
  })
  const res_list = await Promise.all(_req_list)
  
  // 랭크 계산하기
  const rank = sorted_list.map((item,idx)=>{
    const response = [res_list[idx*4], res_list[idx*4+1], res_list[idx*4+2], res_list[idx*4+3]]

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
      
    const sales = annualFinance.매출액.map((item:any)=>{return cutFixed(item.split('::')[1])})
    const margins = annualFinance.영업이익.map((item:any)=>{return cutFixed(item.split('::')[1])})
    if(isDecreasing(sales) || isDecreasing(margins))  return;

    const closeYesterDay= response[0].data.dealTrendInfos[0].closePrice
    const closeToday = response[2].data.closePrice
    const ratioTradingMarketCap = cutFixed(item.tradingValue * 0.01 * 0.1 / cutFixed(totalInfos.marketValue) * 100)

    const priceDataList = response[3].data.priceInfos.slice(-11)
    // priceDataList[0]: {"localDate":"20220713","closePrice":27350.0,"openPrice":28200.0,"highPrice":30050.0,"lowPrice":27100.0,"accumulatedTradingVolume":631538,"foreignRetentionRate":0.62}
    //item.detail[0] {"date":"2022-12-14T00:00:00.000Z","close":"9,800","ratio":15.7,"value":245587}
    
    for ( let i = 1 ; i < priceDataList.length ; i++) {
      const priceData = priceDataList[i]
      const priceDataPrev = priceDataList[i-1]
      
      let signal = false 
      let date = new Date(priceData.localDate.slice(0,4) + '-' + priceData.localDate.slice(4,6) + '-' + priceData.localDate.slice(6,8))
      let close = priceData.closePrice.toLocaleString()
      let ratio = cutFixed((priceDataPrev.closePrice - priceData.closePrice) / priceData.closePrice * 100)
      let value = cutFixed(priceData.accumulatedTradingVolume * priceData.closePrice / 1_000_000,0)
      
      for (let j = 0 ; j < item.detail.length ; j++) {
        if (item.detail[j].date !== date)  return 
        console.log('signal',item.detail[j].date)
        signal = true
        item.detail[j].signal = true
        break
      }

      if (!signal)item.detail.push({date,close,ratio,value, signal})
      
      }

      item.detail.reverse()
    
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
  .filter((item:any)=>{ return item && Number(item.ratioTradingMarketCap) >= ratioTradingMarketCapMin})
  .sort((a,b)=>{return b.ratioTradingMarketCap - a.ratioTradingMarketCap})

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
    signal?: boolean;
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
