const express=require('express')
const routes=express.Router()
const{signup,login,resetpassword,logout,signupandloginwithgoogle,verifyOtp}=require('../controllers/Auth')

routes.post('/signup',signup)
routes.post('/login',login)
routes.get('/logout',logout)
routes.put('/resetpassword',resetpassword)
routes.put('/verifyotp',verifyOtp)
routes.post('/signupandloginwithgoogle',signupandloginwithgoogle)

module.exports=routes