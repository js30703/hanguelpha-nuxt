//declare module 'fs';
import * as fs from 'fs';
const date = new Date();
const timestamp = date.toISOString();
const prod = process.env.NODE_ENV === 'production'
import {H3Event} from 'h3'

// save error log to file with timestamp
export const saveErrorLogSync = (error: any) => {
    if (prod) return;
    const errorLog = JSON.stringify(error) !== '{}' ? { timestamp, error, }: { timestamp, error: JSON.stringify(error, Object.getOwnPropertyNames(error)), };
    fs.writeFileSync(`error.log`, JSON.stringify(errorLog) + '\n', { encoding: 'utf8', flag: 'a'});
};

// save error log to file with timestamp async
export const saveErrorLog = async (error: any) => {
    if (prod) return;
    const errorLog = JSON.stringify(error) !== '{}' ? { timestamp, error, }: { timestamp, error: JSON.stringify(error, Object.getOwnPropertyNames(error)), };
    await fs.promises.writeFile(`error.log`, await JSON.stringify(errorLog) + '\n', { encoding: 'utf8', flag: 'a'});
};


export const apiErrorHandler = (main:Function) => {
  return defineEventHandler(async (event:H3Event) => {
    try {
      const result = await main(event)
      return result
    } catch (error) {
      await saveErrorLog(error)
      return error
    }
  })
}