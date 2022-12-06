//declare module 'fs';
import * as fs from 'fs';
const date = new Date();
const timestamp = date.toISOString();
const prod = process.env.NODE_ENV === 'production'

// save error log to file with timestamp
export const saveErrorLogSync = (error: any) => {
    if (prod) return;
    const errorLog = { timestamp, error, };

    fs.writeFileSync(`error.log`, JSON.stringify(errorLog) + '\n', { encoding: 'utf8', flag: 'a'});
};

// save error log to file with timestamp async
export const saveErrorLog = async (error: any) => {
    if (prod) return;
    const errorLog = { timestamp, error, };
    
    await fs.promises.writeFile(`error.log`, JSON.stringify(errorLog) + '\n', { encoding: 'utf8', flag: 'a'});
};
