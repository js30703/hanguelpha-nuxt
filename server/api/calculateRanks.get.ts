import _prisma, { StockDaily } from '@/server/_prisma';
import axios from 'axios';
import dayjs from 'dayjs';
import {H3Event} from 'h3'
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

export default defineEventHandler(async (event:H3Event) => {
    // 10일간의 데이터를 가져온다.
    const q = await _prisma.dailyStocks.findMany({take: 10})
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

      // 거래대금으로 정렬하고 중복 등장한 종목만 남김 리스트로 변환
    const sorted_list = Object.entries(result)
    .sort((b:[string,StockDailyTotal],a:[string,StockDailyTotal]) => { return a[1].tradingValue - b[1].tradingValue })
    .map((v:[string,StockDailyTotal])=>v[1])
    .filter((item:StockDailyTotal)=>{ return item.detail.length > 1 })

    // do request
    const _req_list =[]
    sorted_list.map(item=>{
        const url_detail_today = `https://m.stock.naver.com/api/stock/${item.code}/integration`
        const url_detail_3year = `https://m.stock.naver.com/api/stock/${item.code}/finance/annual`
        _req_list.push(axios.get(url_detail_today))
        _req_list.push(axios.get(url_detail_3year))
    })

    const res_list = await Promise.all(_req_list)

    const data = sorted_list.map((item,idx)=>{
      const response = [res_list[idx*2], res_list[idx*2+1]]
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
      const closePrice = response[0].data.dealTrendInfos[0].closePrice
      const ratioTradingMarketCap = (item.tradingValue * 0.01 / Number(totalInfos.marketValue.replaceAll(',','').split('억')[0]) * 100).toFixed(2)
      
      return {
        ...item,
        summary:response[1].data.corporationSummary,
        closeToday:closePrice,
        ratioTradingMarketCap:ratioTradingMarketCap,
        ...totalInfos,
          
        ...annualFinance,
      }
    }).sort((a,b)=>{return b.ratioTradingMarketCap - a.ratioTradingMarketCap})
    // db에 저장?
    
    return {
      date:dayjs().format(),
      length:data.length,
      data:data
    }
  })