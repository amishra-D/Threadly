const express=require('express')
const routes=express.Router()
const{getposts,updateUser,getUserBookmarks,addBookmark,removeBookmark,getUserProfile,getyourprofile,searchuser,deleteuser,getallusers}=require('../controllers/Usercontroller')
const checkAdmin=require('../middlewares/checkadmin')

routes.get('/getposts',getposts)
routes.get('/getbookmarks',getUserBookmarks)
routes.post('/addBookmark/:postId',addBookmark)
routes.post('/removeBookmark/:postId',removeBookmark)
routes.put('/updateprofile',updateUser)
routes.get('/getuserprofile/:username',getUserProfile)
routes.get('/getyourprofile',getyourprofile)
routes.get('/searchuser/:input',searchuser)
routes.delete('/deleteaccount',deleteuser)
routes.get('/getallusers',checkAdmin,getallusers)

module.exports=routes