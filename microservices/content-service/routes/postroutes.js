const express = require('express');
const routes = express.Router();
const { createtextpost, getallposts, imgupload, vidupload, deletepost, getUserPosts, getBulkPosts, getUserProfileData, internalAddLike, internalAddDislike } = require('../controllers/Postcontroller');
const authMiddleware = require('../middlewares/authmiddleware');

routes.post('/createtextpost/:boardId', authMiddleware, createtextpost);
routes.get('/getallposts', getallposts);
routes.post('/imgupload/:boardId', authMiddleware, imgupload);
routes.post('/vidupload/:boardId', authMiddleware, vidupload);
routes.delete('/deletepost/:id', authMiddleware, deletepost);

// Internal routes called by User Service & Interaction Service
routes.get('/internal/user-posts/:userId', getUserPosts);
routes.get('/internal/user-profile-data/:userId', getUserProfileData);
routes.post('/internal/posts-bulk', getBulkPosts);
routes.post('/internal/posts/:postId/like', internalAddLike);
routes.post('/internal/posts/:postId/dislike', internalAddDislike);
routes.post('/internal/posts/:id/comments-count', async (req, res) => {
    try {
        const { id } = req.params;
        const { increment } = req.body;
        const Posts = require('../models/Post');
        await Posts.findByIdAndUpdate(id, { $inc: { commentsCount: increment } });
        res.status(200).send();
    } catch(err) {
        res.status(500).send();
    }
});

module.exports = routes;
