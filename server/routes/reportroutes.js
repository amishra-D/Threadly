const express=require('express')
const routes=express.Router()
const {addreport,getallreports,deletereport}=require('../controllers/Reportcontroller')
const checkAdmin=require('../middlewares/checkadmin')
routes.post('/addreport/:contentId',addreport)
routes.get('/getreport',checkAdmin,getallreports)
routes.delete('/deletereport/:id',checkAdmin,deletereport)

module.exports=routes