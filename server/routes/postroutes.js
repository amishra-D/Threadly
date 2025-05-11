const express = require('express');
const routes = express.Router();
const {createtextpost,getallposts,imgupload,vidupload,deletepost} = require('../controllers/Postcontroller');

routes.post('/createpost/:boardId', createtextpost);
routes.post('/createpostimage/:boardId', imgupload);
routes.post('/createpostvideo/:boardId', vidupload);
routes.get('/getallposts', getallposts);
routes.delete('/deletepost/:id',deletepost);

module.exports = routes;
