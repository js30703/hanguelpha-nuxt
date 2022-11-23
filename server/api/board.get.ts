import {H3Event} from 'h3'
import prisma from '@/server/_prisma';
function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  const deviations = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  return [mean , deviations]
}

export default defineEventHandler(async(event:H3Event) => {
    const rank = await prisma.dailyRank.findFirst({orderBy:{date:'desc'}})
    const result = JSON.parse(rank.rank)
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