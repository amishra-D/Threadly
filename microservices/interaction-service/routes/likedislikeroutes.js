const express=require('express')
const routes=express.Router()
const {addlike,adddislike}=require('../controllers/Likecontroller')
const authMiddleware = require('../middlewares/authmiddleware');

routes.post('/likepost/:postId', authMiddleware, addlike);
routes.post('/dislikepost/:postId', authMiddleware, adddislike);

module.exports = routes;