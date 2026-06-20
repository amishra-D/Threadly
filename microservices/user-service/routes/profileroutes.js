const express = require('express');
const routes = express.Router();
const {
    getInternalProfile,
    getyourprofile, getUserProfile, searchuser, updateUser,
    addBookmark, removeBookmark, getposts, getUserBookmarks,
    getallusers, deleteuser
} = require('../controllers/Profile');
// const checkAdmin = require('../middlewares/checkadmin'); 
// For now, removing checkAdmin middleware or we can mock it here
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) return next();
    return res.status(403).json({ message: "Admin access required" });
};

// Internal Routes (Called by Auth Service)
routes.get('/internal/profile/:authId', getInternalProfile);

// Public/Protected Routes (Called via API Gateway, req.user injected by middleware)
// Assuming API Gateway or a local middleware sets req.user
const authMiddleware = require('../middlewares/authmiddleware');

routes.get('/getposts', authMiddleware, getposts);
routes.get('/getbookmarks', authMiddleware, getUserBookmarks);
routes.post('/addBookmark/:postId', authMiddleware, addBookmark);
routes.post('/removeBookmark/:postId', authMiddleware, removeBookmark);
routes.put('/updateprofile', authMiddleware, updateUser);
routes.get('/getuserprofile/:username', getUserProfile); // Public
routes.get('/getyourprofile', authMiddleware, getyourprofile);
routes.get('/searchuser/:input', searchuser); // Public
routes.delete('/deleteaccount', authMiddleware, deleteuser);
routes.get('/getallusers', authMiddleware, checkAdmin, getallusers);

module.exports = routes;
