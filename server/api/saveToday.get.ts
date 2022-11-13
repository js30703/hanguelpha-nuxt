import {H3Event} from 'h3'
import axios from 'axios'
import dayjs from 'dayjs'
import { Prisma } from '@prisma/client';
import prisma, { StockDaily } from '@/server/_prisma';


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
    axios.get(urlUpKosdaq), 
    axios.get(urlUpKospi)
  ])
  const _data = res[0].data.stocks.concat(res[1].data.stocks)
  return await mergeKospiKosdaq(_data)
}

export default defineEventHandler(async (event:H3Event) => {
  const TODAY = dayjs().format('YYYY-MM-DDT00:00:00.000Z')
  const hourNow = dayjs().hour() * 100 + dayjs().minute()
  const stocks = await fetchRisingStockList()

  if(hourNow < 1530){ return }

    await prisma.dailyStocks.upsert({
      where:{stocks:JSON.stringify(stocks) },
      update:{},
      create:{date:TODAY , stocks:JSON.stringify(stocks)} as Prisma.DailyStocksCreateInput
    })


  return {
    tz_now: dayjs().format(),
    tz:process.env.TZ,
    date: TODAY,
    total: stocks.length,
    stocks: stocks
  }
})
