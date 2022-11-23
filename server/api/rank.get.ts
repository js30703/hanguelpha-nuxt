import {H3Event} from 'h3'
import prisma from '@/server/_prisma';

export default defineEventHandler(async(event:H3Event) => {
    const rank = await prisma.dailyRank.findFirst({orderBy:{date:'desc'}})
    return {
      date: rank.date,
      ranks: JSON.parse(rank.rank).filter(item=>{return item.detail.length == 2})
    }
  })