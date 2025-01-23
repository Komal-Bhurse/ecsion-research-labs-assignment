import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

 async function connectDB (){
  mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("mongodb atlas connection sucsessfull")
  }).catch((error)=>{
    console.log("mongodb atlas connection faild", error)
  })
}

export default connectDB;