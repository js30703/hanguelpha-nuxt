import {H3Event} from 'h3'
import axios from 'axios'
import { apiErrorHandler } from '@/utils/error'
import { cutFixed } from '@/utils/mean'
export default apiErrorHandler(async (event:H3Event) => {
    const { code } = getQuery(event)
    if (!code) { return {message:'no new data', status:403} }
    console.log(code)
    const url_detail_price_candle = `https://api.stock.naver.com/chart/domestic/item/${code}?periodType=dayCandle`
    const _res = await axios.get(url_detail_price_candle)
    if (_res.data.length == 0) { return {message:'no new data', status:403}}

    const priceDataList = _res.data.priceInfos.slice(-11).reverse()
    
    let result = []
    for ( let i = 0 ; i < priceDataList.length-1 ; i++) {
      const priceData = priceDataList[i]
      const priceDataPrev = priceDataList[i+1]
      let date = new Date(priceData.localDate.slice(0,4) + '-' + priceData.localDate.slice(4,6) + '-' + priceData.localDate.slice(6,8))
      let close = priceData.closePrice.toLocaleString()
      // const upDown = priceData.closePrice > priceDataPrev.closePrice ? -1 : 1
      let ratio = cutFixed((priceData.closePrice - priceDataPrev.closePrice) / priceDataPrev.closePrice * 100)
      let value = cutFixed(priceData.accumulatedTradingVolume * (priceData.openPrice + priceData.highPrice * 1.05+ priceData.lowPrice+ priceData.closePrice)/4 / 1_000_000,0)
      result.push({date,close,ratio,value})
    }

    return { result }
  })