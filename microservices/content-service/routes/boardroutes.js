const express=require('express')
const routes=express.Router()
const {createboard,getallboards,updateboard}=require('../controllers/Boardcontroller')

routes.post('/createboard',createboard)
routes.get('/getallboards',getallboards)
routes.put('/updateboards/:id',updateboard)



module.exports=routes
