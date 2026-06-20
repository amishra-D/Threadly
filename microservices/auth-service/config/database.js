const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
.then(()=>{ console.log("Mongodb database connected")})
.catch((error)=>console.log(error))
}
module.exports=dbConnect