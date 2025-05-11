const express=require('express')
const routes=express.Router()
const{signup,login,resetpassword,logout}=require('../controllers/Auth')

routes.post('/signup',signup)
routes.post('/login',login)
routes.get('/logout',logout)
routes.put('/resetpassword',resetpassword)


module.exports=routes