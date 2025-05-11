const express=require('express')
const routes=express.Router()
const {addcomment,deletecomment,addlike,adddislike,getcomments}=require('../controllers/Commentcontroller')

routes.post('/addcomment/:postId/:parentCommentId', addcomment);
routes.post('/addcomment/:postId', addcomment);
routes.delete('/deletecomment/:commentId',deletecomment)
routes.post('/likecomment/:commentId',addlike)
routes.post('/dislikecomment/:commentId',adddislike)
routes.get('/getcomments/:postId',getcomments)

module.exports=routes