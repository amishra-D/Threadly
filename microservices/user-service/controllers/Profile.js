const Profile = require('../models/Profile');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const axios = require('axios');
const { publishToExchange } = require('../rabbitmq/producer');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgvmc3ezr',
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});


const getInternalProfile = async (req, res) => {
    try {
        const { authId } = req.params;
        const profile = await Profile.findOne({ authId });
        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getyourprofile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ authId: req.user.id });
        if (!profile) {
            try {
                profile = new Profile({
                    authId: req.user.id,
                    username: `user_${Math.floor(Math.random() * 100000)}`,
                    email: req.user.email || 'unknown@example.com'
                });
                await profile.save();
            } catch (err) {
                return res.status(404).json({ message: "Profile not found and could not be auto-created" });
            }
        }
        res.status(200).json({ success: true, user: profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ username: req.params.username });
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        
        try {
            const contentServiceUrl = process.env.CONTENT_SERVICE_URL || 'http://content-service:3003';
            const response = await axios.get(`${contentServiceUrl}/internal/user-profile-data/${profile.authId}`);
            const { allPosts, likedPosts, Likesreceived } = response.data;
            res.status(200).json({
                success: true,
                user: profile,
                allPosts,
                likedPosts,
                Likesreceived
            });
        } catch(err) {
            console.error("Failed to fetch post data for profile", err.message);
            res.status(200).json({ success: true, user: profile, allPosts: [], likedPosts: [], Likesreceived: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchuser = async (req, res) => {
    try {
        const { input } = req.params;
        const users = await Profile.find({ username: { $regex: input, $options: 'i' } }).limit(10);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { bio, location } = req.body;
        let updateData = { bio, location };
        if (req.files) {
            if (req.files.pfp) {
                const result = await cloudinary.uploader.upload(req.files.pfp.tempFilePath, { folder: "threadly_pfps" });
                updateData.pfp = result.secure_url;
            }
            if (req.files.banner) {
                const result = await cloudinary.uploader.upload(req.files.banner.tempFilePath, { folder: "threadly_banners" });
                updateData.banner = result.secure_url;
            }
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { authId: req.user.id },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addBookmark = async (req, res) => {
    try {
        const { postId } = req.params;
        await Profile.findOneAndUpdate(
            { authId: req.user.id },
            { $addToSet: { bookmarks: postId } }
        );
        res.status(200).json({ message: "Bookmark added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeBookmark = async (req, res) => {
    try {
        const { postId } = req.params;
        await Profile.findOneAndUpdate(
            { authId: req.user.id },
            { $pull: { bookmarks: postId } }
        );
        res.status(200).json({ message: "Bookmark removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getposts = async (req, res) => {
    try {
        const contentServiceUrl = process.env.CONTENT_SERVICE_URL || 'http://content-service:3003';
        const response = await axios.get(`${contentServiceUrl}/internal/user-posts/${req.user.id}`);
        res.status(200).json({ posts: response.data.posts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

const getUserBookmarks = async (req, res) => {
    try {
        const profile = await Profile.findOne({ authId: req.user.id });
        if(!profile || !profile.bookmarks || profile.bookmarks.length === 0) {
            return res.status(200).json({ bookmarks: [] });
        }
        
        const contentServiceUrl = process.env.CONTENT_SERVICE_URL || 'http://content-service:3003';
        const response = await axios.post(`${contentServiceUrl}/internal/posts-bulk`, { postIds: profile.bookmarks });
        res.status(200).json({ bookmarks: response.data.posts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
};

const getallusers = async (req, res) => {
    try {
        const users = await Profile.find({});
        res.status(200).json({ allusers: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteuser = async (req, res) => {
    // This requires deleting from Auth, Profile, and Content services (Saga pattern).
    try {
        await Profile.findOneAndDelete({ authId: req.user.id });
        
        // Consistent key: authId
        await publishToExchange('user_delete_event', '', { authId: req.user.id });
        
        res.status(200).json({ message: "Profile deleted and broadcasted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInternalProfile,
    getyourprofile, getUserProfile, searchuser, updateUser,
    addBookmark, removeBookmark, getposts, getUserBookmarks,
    getallusers, deleteuser
};
