const Comments = require('../models/Comment');
const axios = require('axios');
const { publishToQueue } = require('../rabbitmq/producer');

const addcomment = async (req, res) => {
    try {
        const { postId } = req.params;
        const {parentCommentId}=req.query;
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required to add a comment.'
            });
        }

        const actualParentCommentId = parentCommentId || null;

        const comment = new Comments({
            userId, postId, content, parentCommentId: actualParentCommentId
        });

        await comment.save();

        // Increment comments count in Content Service via RabbitMQ
        try {
            channel.sendToQueue('post_comments_count', Buffer.from(JSON.stringify({
                postId,
                increment: 1
            })));
        } catch(err) {
            console.error("Failed to enqueue comment count increment", err.message);
        }

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
        const replies = await Comments.find({ parentCommentId: commentId });

        const totalCommentsToDelete = 1 + replies.length;

        await Comments.deleteMany({ parentCommentId: commentId });
        await Comments.findByIdAndDelete(commentId);

        // Decrement comments count in Content Service via RabbitMQ
        try {
            channel.sendToQueue('post_comments_count', Buffer.from(JSON.stringify({
                postId,
                increment: -totalCommentsToDelete
            })));
        } catch(err) {
            console.error("Failed to enqueue comment count decrement", err.message);
        }

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

const internalDeletePostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        await Comments.deleteMany({ postId });
        res.status(200).send();
    } catch(err) {
        res.status(500).send();
    }
}

const getcomments = async (req, res) => {
    try {
        const { postId } = req.params;
        
        // Ensure post exists via Content Service
        // Optional, but good practice. For now, assuming post exists if they are fetching comments.
        
        const comments = await Comments.find({ postId })
            .populate("replies") // This works because replies are internal to Comments model
            .sort({ createdAt: 1 })
            .lean();

        // Populate users manually
        const userIds = new Set();
        comments.forEach(c => {
            userIds.add(c.userId);
            if (c.replies) {
                c.replies.forEach(r => userIds.add(r.userId));
            }
        });

        const userMap = {};
        await Promise.all([...userIds].map(async (id) => {
            try {
                const response = await axios.get(`${USER_SERVICE_URL}/internal/profile/${id}`);
                if (response.data && response.data.profile) {
                    userMap[id] = response.data.profile;
                }
            } catch(err) {
                console.error(`Could not fetch profile for user ${id}`);
            }
        }));

        const populatedComments = comments.map(c => ({
            ...c,
            userId: userMap[c.userId] ? { _id: c.userId, username: userMap[c.userId].username, pfp: userMap[c.userId].pfp } : c.userId,
            replies: c.replies ? c.replies.map(r => ({
                ...r,
                userId: userMap[r.userId] ? { _id: r.userId, username: userMap[r.userId].username, pfp: userMap[r.userId].pfp } : r.userId
            })) : []
        }));

        return res.status(200).json({
            success: true,
            message: 'All comments retrieved',
            comments: populatedComments
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { addcomment, deletecomment, addlike, adddislike, getcomments, internalDeletePostComments };
