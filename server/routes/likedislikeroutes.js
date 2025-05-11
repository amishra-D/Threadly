const express=require('express')
const routes=express.Router()
const {addlike,adddislike}=require('../controllers/Likecontroller')

routes.post('/likepost/:postId',addlike)
routes.post('/dislikepost/:postId',adddislike)

module.exports=routes