const express=require('express')
const routes=express.Router()
const {addcomment,deletecomment,addlike,adddislike,getcomments, internalDeletePostComments}=require('../controllers/Commentcontroller')
const authMiddleware=require('../middlewares/authmiddleware')

routes.post('/addcomment/:postId/:parentCommentId', authMiddleware, addcomment);
routes.post('/addcomment/:postId', authMiddleware, addcomment);
routes.delete('/deletecomment/:commentId',authMiddleware,deletecomment)

routes.post('/likecomment/:commentId',authMiddleware,addlike)
routes.post('/addlike/:commentId',authMiddleware,addlike)
routes.post('/dislikecomment/:commentId',authMiddleware,adddislike)
routes.post('/adddislike/:commentId',authMiddleware,adddislike)
routes.get('/getcomments/:postId',getcomments)

// Internal route called by Content Service when a post is deleted
routes.delete('/internal/comments/post/:postId', internalDeletePostComments);

module.exports=routes