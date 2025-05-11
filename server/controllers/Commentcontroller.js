const Comments = require('../models/Comment');
const Posts = require('../models/Post');

const addcomment = async (req, res) => {
    try {
        console.log("API called", req.body);
        const { postId } = req.params;
        const {parentCommentId}=req.query;
        console.log("from api",parentCommentId)
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required to add a comment.'
            });
        }

        const actualParentCommentId = parentCommentId || null;

        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comment = new Comments({
            userId, postId, content, parentCommentId: actualParentCommentId
        });

        await comment.save();

        await Posts.findByIdAndUpdate(postId, {
            $inc: { commentsCount: 1 }
        });

        return res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        console.error('Error in adding comment:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;

        const comment = await Comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const hasLiked = comment.likes.includes(userId);
        const hasDisliked = comment.dislikes?.includes(userId);
        let update = {};

        if (hasLiked) {
            update.$pull = { likes: userId };
        } else {
            update.$addToSet = { likes: userId };
            update.$pull = { ...(update.$pull || {}), dislikes: userId };
        }

        await Comments.findByIdAndUpdate(commentId, update, { new: true });

        return res.status(200).json({
            success: true,
            message: hasLiked ? 'Like removed from comment' : 'Comment liked successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const adddislike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;

        const comment = await Comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const hasDisliked = comment.dislikes.includes(userId);
        const hasLiked = comment.likes.includes(userId);

        let update = {};

        if (hasDisliked) {
            update.$pull = { dislikes: userId };
        } else {
            update.$addToSet = { dislikes: userId };
            update.$pull = { ...(update.$pull || {}), likes: userId };
        }

        await Comments.findByIdAndUpdate(commentId, update, { new: true });

        return res.status(200).json({
            success: true,
            message: hasDisliked ? 'Dislike removed from comment' : 'Comment disliked successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const deletecomment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comments.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const postId = comment.postId;

        await Comments.deleteMany({ parentCommentId: commentId });

        await Comments.findByIdAndDelete(commentId);

        await Posts.findByIdAndUpdate(postId, {
            $inc: { commentsCount: -1 }
        });

        return res.status(200).json({
            success: true,
            message: 'Comment and its replies deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getcomments = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Posts.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comments = await Comments.find({ postId })
            .populate("userId", "username")
            .populate("replies")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: 'All comments retrieved',
            comments
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { addcomment, deletecomment,addlike,adddislike,getcomments };
