const Posts = require('../models/Post');

const addlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

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

const adddislike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

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

module.exports = { addlike, adddislike };
