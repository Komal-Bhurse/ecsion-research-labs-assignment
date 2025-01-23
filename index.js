import express from "express";
import helmet from 'helmet'
import path  from "path"
import cookieParser from 'cookie-parser'

import userRoutes from "./routes/user.js"

import connectDB from "./connection.js";

const app = express()

const PORT = 5000 || process.env.PORT

app.use(helmet())

connectDB()

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/user",userRoutes)

app.get("/",(req,res)=>{
    app.use(express.static(path.resolve("./",'frontend','dist')))
    res.sendFile(path.resolve("./",'frontend','dist','index.html'))
})

app.get("/dashboard/users",(req,res)=>{
    app.use(express.static(path.resolve("./",'frontend','dist')))
    res.sendFile(path.resolve("./",'frontend','dist','index.html'))
})

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`)
})