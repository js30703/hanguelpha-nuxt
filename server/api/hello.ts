import {H3Event} from 'h3'
export default defineEventHandler((event:H3Event) => {
    const {context,req,res} = event
    const {method, headers,} = req
    return {
      api: 123
    }
  })