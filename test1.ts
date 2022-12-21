import {H3Event} from 'h3'
import axios from 'axios'
import dayjs from 'dayjs'
import prisma from '@/server/_prisma';
import { cutFixed , isDecreasing} from '@/utils/mean';
import { apiErrorHandler } from '@/utils/error';
const HOW_MANY_DAYS = 2 // 리스트에 들어온 일 수
const ratioTradingMarketCapMin = 2

const axiosSS = axios.create({
  headers:{'User-Agent':'Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36'},
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
  const sorted_list = await (await mergeStockDailyHistory(q)).slice(1,2)
 
  // do request
  const _req_list =[]
  sorted_list.map(item=>{
      const url_detail_price_candle = `https://api.stock.naver.com/chart/domestic/item/${item.code}?periodType=dayCandle`
      _req_list.push(axiosSS.get(url_detail_price_candle))
  })
  const res_list = await Promise.all(_req_list)
  
  // 랭크 계산하기
  const rank = await Promise.all(sorted_list.map(async (item, idx)=>{
    const response = res_list[idx]
    const result = await updateList(item, idx, response)
    return result
  }))

  return {
    date:TODAY,
    length:rank.length,
    rank:rank
  }
})

// define async function for filter detail
async function checkSignal (item: any, date: Date, close: string, ratio: number, value: number,) {
  item.detail2 = []
  for (let j = 0 ; j < item.detail.length ; j++) {
    const signal = item.detail[j].date.toISOString() !== date.toISOString()
    // item.detail2.push({date,close,ratio,value, signal})
  }
}

async function updateList(item, idx, response){
  const priceDataList = response.data.priceInfos.slice(-11).reverse()

  // priceDataList[0]: {"localDate":"20220713","closePrice":27350.0,"openPrice":28200.0,"highPrice":30050.0,"lowPrice":27100.0,"accumulatedTradingVolume":631538,"foreignRetentionRate":0.62}
  //item.detail[0] {"date":"2022-12-14T00:00:00.000Z","close":"9,800","ratio":15.7,"value":245587}
  
  for ( let i = 0 ; i < priceDataList.length-1 ; i++) {
    const priceData = priceDataList[i]
    const priceDataPrev = priceDataList[i+1]
    
    let date = new Date(priceData.localDate.slice(0,4) + '-' + priceData.localDate.slice(4,6) + '-' + priceData.localDate.slice(6,8))
    let close = priceData.closePrice.toLocaleString()
    const upDown = priceData.closePrice > priceDataPrev.closePrice ? -1 : 1
    let ratio = cutFixed((priceDataPrev.closePrice - priceData.closePrice) * upDown / priceDataPrev.closePrice * 100)
    let value = cutFixed(priceData.accumulatedTradingVolume * (priceData.openPrice + priceData.highPrice * 1.05+ priceData.lowPrice+ priceData.closePrice)/4 / 1_000_000,0)
    
    await checkSignal(item, date, close, ratio, value)
  }
  
  console.log(item.name, 'loop end')
  return item
}


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
