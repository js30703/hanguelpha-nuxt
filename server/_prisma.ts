import { PrismaClient } from '@prisma/client'

let prisma = new PrismaClient()

export default process.env.NODE_ENV == "development" ? prisma : new PrismaClient();

export interface StockDaily {
    name: string;
    code: string;
    close: string;
    ratio: number;
    tradingValue:string;
  }