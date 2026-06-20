const express=require('express')
const routes=express.Router()
const {addreport,getallreports,deletereport, internalDeletePostReports}=require('../controllers/Reportcontroller')
const checkAdmin=require('../middlewares/checkadmin')
const authMiddleware=require('../middlewares/authmiddleware')

routes.post('/addreport/:contentId',authMiddleware,addreport)
routes.get('/getallreports',authMiddleware,checkAdmin,getallreports)
routes.delete('/deletereport/:id',authMiddleware,checkAdmin,deletereport)

module.exports=routes