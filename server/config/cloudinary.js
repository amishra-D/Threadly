const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
    cloud_name: 'dgvmc3ezr', 
    api_key: process.env.CLOUDINARY_API, 
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;
