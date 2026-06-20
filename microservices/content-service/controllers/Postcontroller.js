const Posts = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const redis = require('../config/redis');
const { publishToExchange } = require('../rabbitmq/producer');

const createtextpost = async (req, res) => {
    try {
        const userId = req.user.id;
        const boardId = req.params.boardId;
        const { caption, content, type } = req.body;
        const post = new Posts({
            userId,
            boardId,
            caption,
            content,
            type
        });

        await post.save();
        return res.status(200).json({
            success: true,
            message: 'Post saved successfully',
        });
    } catch (error) {
        console.error('Error in creating text post', error);

        return res.status(400).json({
            success: false,
            message: 'Post was not saved',
            error: error.message,
        });
    }
};

async function populateUsersForPosts(posts) {
    if (!posts || posts.length === 0) return posts;
    
    const userIds = [...new Set(posts.map(post => post.userId))];
    

    const userMap = {};
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';
    await Promise.all(userIds.map(async (id) => {
        try {
            const response = await axios.get(`${userServiceUrl}/internal/profile/${id}`);
            if (response.data && response.data.profile) {
                userMap[id] = response.data.profile;
            }
        } catch(err) {
            console.error(`Could not fetch profile for user ${id}`);
        }
    }));

    return posts.map(post => ({
        ...post,
        userId: userMap[post.userId] ? { _id: post.userId, username: userMap[post.userId].username, pfp: userMap[post.userId].pfp } : post.userId
    }));
}
const getallposts = async (req, res) => {
    try {
        const { boardId, sort = "new", page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const filter = boardId ? { boardId } : {};
        
        const cacheKey = `posts:board:${boardId || 'all'}:sort:${sort}:page:${pageNum}:limit:${limitNum}`;
        
        const cachedPosts = await redis.get(cacheKey);
        if (cachedPosts) {
            console.log(`[Cache Hit] Serving posts from Redis for ${cacheKey}`);
            return res.status(200).json({
                success: true,
                message: 'Posts retrieved from cache',
                posts: cachedPosts,
                hasMore: cachedPosts.length === limitNum
            });
        }
        
        console.log(`[Cache Miss] Fetching posts from MongoDB for ${cacheKey}`);
        let rawPosts;

        if (sort === "hot") {
            const p = await Posts.find(filter).lean();
            rawPosts = p.map(post => {
                const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);
                const hoursSince = (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60);
                const hotScore = score / Math.pow(hoursSince + 2, 1.5);
                return { ...post, hotScore };
            })
            .sort((a, b) => b.hotScore - a.hotScore)
            .slice((pageNum - 1) * limitNum, pageNum * limitNum);

        } else if (sort === "top") {
            rawPosts = await Posts.find(filter)
                .sort({ likesCount: -1, commentsCount: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean();
        } else if (sort === "new") {
            rawPosts = await Posts.find(filter)
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean();
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option",
            });
        }

        const posts = await populateUsersForPosts(rawPosts);

        await redis.set(cacheKey, JSON.stringify(posts), { ex: 60 });

        return res.status(200).json({
            success: true,
            message: 'All posts received successfully',
            posts,
            hasMore: posts.length === limitNum
        });
    } catch (error) {
        console.error('Error in retrieving posts:', error);

        return res.status(500).json({
            success: false,
            message: 'Cannot retrieve posts',
            error: error.message,
        });
    }
};

async function uploadtocloudinary(file, folder, resource_type = "image") {
    const options = { folder, resource_type };
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function isvalid(filetype, supportedtypes) {
    return supportedtypes.includes(filetype.toLowerCase());
}

const imgupload = async (req, res) => {
    try {
        const userId = req.user.id;
        const boardId = req.params.boardId;
        const { caption, content, type, flair } = req.body;
        const file = req.files.imgfile;
        const filetype = file.name.split('.').pop();
        const supportedtypes = ["jpg", "jpeg", "png"];
        
        if (!isvalid(filetype, supportedtypes)) {
            return res.status(400).json({
                success: false,
                message: "File is of unsupported format"
            });
        } else {
            const upload = await uploadtocloudinary(file, "threadly_posts");
            const image = new Posts({
                userId,
                boardId,
                caption,
                content,
                type,
                flair,
                mediaUrl: upload.secure_url
            });
            await image.save();
            return res.status(200).json({
                success: true,
                message: "Image uploaded and saved successfully",
                imgurl: upload.secure_url
            });
        }
    } catch (error) {
        console.log("Error in imgupload", error);
        return res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

const vidupload = async (req, res) => {
    try {
        const userId = req.user.id;
        const boardId = req.params.boardId;
        const { caption, content, type, flair } = req.body;
        const file = req.files.vidfile;
        const filetype = file.name.split('.').pop();
        const supportedtypes = ["mp4", "webp", "mov"];
        
        if (!isvalid(filetype, supportedtypes)) {
            return res.status(400).json({
                success: false,
                message: "File is of unsupported format"
            });
        } else {
            const upload = await uploadtocloudinary(file, "threadly_posts", "video");
            const video = new Posts({
                userId,
                boardId,
                caption,
                content,
                type,
                flair,
                mediaUrl: upload.secure_url
            });
            await video.save();
            return res.status(200).json({
                success: true,
                message: "Video uploaded and saved successfully",
                mediaUrl: upload.secure_url
            });
        }
    } catch (error) {
        console.log("Error in videoupload", error);
        return res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

async function deleteFromCloudinary(mediaUrl) {
    try {
        const publicId = mediaUrl.split('/').slice(7).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted file with public_id: ${publicId}`);
    } catch (error) {
        console.error("Error deleting from Cloudinary", error);
    }
}

const deletepost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Posts.findById(id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (post.mediaUrl) {
            await deleteFromCloudinary(post.mediaUrl);
        }

        await Posts.findByIdAndDelete(id);
        
        try {
            await publishToExchange('post_deleted_event', '', { postId: id });
            console.log(`[RabbitMQ] Broadcasted post_deleted_event for post ${id}`);
        } catch(err) {
            console.error("Failed to broadcast post deletion via RabbitMQ", err);
        }

        return res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete operation failed:', error);
        return res.status(500).send({ message: 'Error deleting post', error });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const rawPosts = await Posts.find({ userId: req.params.userId }).lean();
        const posts = await populateUsersForPosts(rawPosts);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBulkPosts = async (req, res) => {
    try {
        const { postIds } = req.body;
        const rawPosts = await Posts.find({ _id: { $in: postIds } }).lean();
        const posts = await populateUsersForPosts(rawPosts);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserProfileData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const rawAllPosts = await Posts.find({ userId }).lean();
        const rawLikedPosts = await Posts.find({ likes: userId }).lean();
        const Likesreceived = await Posts.countDocuments({ likes: userId });
        
        const allPosts = await populateUsersForPosts(rawAllPosts);
        const likedPosts = await populateUsersForPosts(rawLikedPosts);
        
        res.status(200).json({ allPosts, likedPosts, Likesreceived });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const internalAddLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Posts.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (!Array.isArray(post.likes)) post.likes = [];
        if (!Array.isArray(post.dislikes)) post.dislikes = [];

        const hasLiked = post.likes.includes(userId);
        const update = hasLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId }, $pull: { dislikes: userId } };

        const updatedPost = await Posts.findByIdAndUpdate(postId, update, { new: true });

        return res.status(200).json({
            success: true,
            message: hasLiked ? 'Like removed from post' : 'Post liked successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const internalAddDislike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Posts.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (!Array.isArray(post.dislikes)) post.dislikes = [];
        if (!Array.isArray(post.likes)) post.likes = [];

        const hasDisliked = post.dislikes.includes(userId);
        const update = hasDisliked
            ? { $pull: { dislikes: userId } }
            : { $addToSet: { dislikes: userId }, $pull: { likes: userId } };

        const updatedPost = await Posts.findByIdAndUpdate(postId, update, { new: true });

        return res.status(200).json({
            success: true,
            message: hasDisliked ? 'Dislike removed from post' : 'Post disliked successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createtextpost, getallposts, imgupload, vidupload, deletepost, getUserPosts, getBulkPosts, getUserProfileData, internalAddLike, internalAddDislike };
