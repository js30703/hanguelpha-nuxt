import {H3Event} from 'h3'
import prisma from '../_prisma'
export default defineEventHandler((event:H3Event) => {
    const {context,req,res} = event
    const {method, headers,} = req
    return {
      api: 123
    }
  })