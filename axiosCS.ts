import axios from "axios"

const Axios = axios.create({
    baseURL: process.env.NODE_ENV == "development"? "http://localhost:3000" : "https://hanguelpha-nuxt.vercel.app",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 2.5*1000,
})

export async function fetchRank(){
    try{
        const res = await Axios.get("/api/rank")
        return res.data
    } catch(e){
        console.log(e)
    }
}