const Posts = require('../models/Post');
const Comments = require('../models/Comment');
const cloudinary = require('../config/cloudinary');
const Reports=require('../models/Report')
const createtextpost = async (req, res) => {
    try {
        console.log("printing req body",req.body)
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

const getallposts = async (req, res) => {
    try {
        const { boardId,sort = "new" } = req.query;
        const filter = boardId ? { boardId } : {};
        let posts;
        if (sort === "hot") {
            const rawPosts = await Posts.find(filter).lean()
            .populate('userId', 'username pfp');
            posts = rawPosts.map(post => {
                const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);
                const hoursSince = (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60);
                const hotScore = score / Math.pow(hoursSince + 2, 1.5);
                return { ...post, hotScore };
            })
            .sort((a, b) => b.hotScore - a.hotScore);

        } else if (sort === "top") {
            posts = await Posts.find(filter)
            .populate('userId', 'username pfp')
            .sort({ likesCount: -1, commentsCount: -1 });
        } else if (sort === "new") {
            posts = await Posts.find(filter)
            .populate('userId', 'username pfp')
            .sort({ createdAt: -1 });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option",
            });
        }
        return res.status(200).json({
            success: true,
            message: 'All posts received successfully',
            posts
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
    if (supportedtypes.includes(filetype)) {
        console.log(filetype);
        return true;
    } else {
        console.log("Filetype not supported");
        return false;
    }
}

const imgupload = async (req, res) => {
    try {
        const userId = req.user.id;
        const boardId = req.params.boardId;
        const { caption, content, type, flair } = req.body;
        const file = req.files.imgfile;
        const filetype = `${file.name.split('.')[1]}`;
        const supportedtypes = ["jpg", "jpeg", "png"];
        
        if (!isvalid(filetype, supportedtypes)) {
            return res.status(400).json({
                success: false,
                message: "File is of unsupported format"
            });
        } else {
            const upload = await uploadtocloudinary(file, "Random");
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
        const filetype = `${file.name.split('.')[1]}`;
        const supportedtypes = ["mp4", "webp", "mov"];
        
        if (!isvalid(filetype, supportedtypes)) {
            return res.status(400).json({
                success: false,
                message: "File is of unsupported format"
            });
        } else {
            const upload = await uploadtocloudinary(file, "Random", "video");
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
        await Reports.deleteMany({contentId:id});
        

        await Comments.deleteMany({ postId: id });
        return res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete operation failed:', error);
        return res.status(500).send({ message: 'Error deleting post', error });
    }
};

module.exports = { createtextpost, getallposts, imgupload, vidupload, deletepost };
