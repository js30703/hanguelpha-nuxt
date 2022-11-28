import {H3Event} from 'h3'
import prisma from '@/server/_prisma';
import { cutFixed , isDecreasing} from '@/utils/mean';

export default defineEventHandler(async(event:H3Event) => {
    const rank = await prisma.dailyRank.findFirst({orderBy:{date:'desc'}})
    const _rank = JSON.parse(rank.rank).filter(item=>{
      
      const sales = item.매출액.map((item:any)=>{return cutFixed(item.split('::')[1])})
      const margins = item.영업이익.map((item:any)=>{return cutFixed(item.split('::')[1])})
      if(isDecreasing(sales) || isDecreasing(margins)) {
        console.log(item.name)
      }

      return item
    })
    return {
      date: rank.date,
      ranks: _rank
    }
  })