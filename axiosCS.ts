import axios from "axios"

const Axios = axios.create({
    baseURL: process.env.NODE_ENV == "development"? "http://localhost:3000" : "https://api.example.com",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 2.5*1000,
})

export async function fetchRank(){
    console.log("fetchRank")
    const res = await Axios.get("/api/rank")
    return res.data
}