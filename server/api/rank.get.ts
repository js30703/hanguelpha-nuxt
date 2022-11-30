import {H3Event} from 'h3'
import prisma from '@/server/_prisma';
import { getStandardDeviation } from '@/utils/mean';


export default defineEventHandler(async(event:H3Event) => {
    const rank = await prisma.dailyRank.findFirst({orderBy:{date:'desc'}})
    const { count = 0,  } = getQuery(event)
    
    const result = JSON.parse(rank.rank).filter(item=>{
      if (count == 0 ) return true
      return item.detail.length == count
    })
    const [mean, std] = getStandardDeviation(
      result.map(item => item.detail.length)
      )

    return {
      date: rank.date,
      ranks: result,
      mean: mean,
      std: std
    }
  })