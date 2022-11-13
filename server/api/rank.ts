import {H3Event} from 'h3'
export default defineEventHandler((event:H3Event) => {
    const {context,req,res} = event
    const {method, headers,} = req
    const { hello } = getQuery(event)
    // const body = await readBody(event)
    return {
      api: 123
    }
  })