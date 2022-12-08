
import axios from 'axios'
import * as fs from 'fs';
import {H3Event} from 'h3'

const prod = process.env.NODE_ENV === 'production'

// save error log to file with timestamp async
export const saveErrorLog = async (error: any) => {
  const front = (error.url && (error.url.slice(0,4) == '/api/')) ? true : false
  if (!front){
    let url = error.url
    error = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    error.url = url
  }
  if (prod) {
    axios({
      method: 'post',
      url:'https://cloud.axiom.co/api/v1/datasets/vercel/ingest',
      headers: {
        Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
        'Content-Type': 'application/x-ndjson'
      },
      data:error
    })
    return
  };
  const date = new Date();
  const timestamp = date.toISOString();
  await fs.promises.writeFile(`error.log`, await JSON.stringify({timestamp, error}) + '\n', { encoding: 'utf8', flag: 'a'});
};


export const apiErrorHandler = (main:Function) => {
  return defineEventHandler(async (event:H3Event) => {
    const {context,req,res} = event
    try {
      const result = await main(event)
      return result
    } catch (error) {
      error.url = req.url
      await saveErrorLog(error)
      return error
    }
  })
}