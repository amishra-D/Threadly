const User=require('../models/User')
const Posts=require('../models/Post')
const Comments=require('../models/Comment')

const getposts=async (req,res)=>{
    try{
const userId=req.user.id;
const posts = await Posts.find({ userId }).sort({ createdAt: -1 });
console.log(posts);
return res.status(200).json({
    success:true,
    message:'The posts by the user:',
    posts:posts
})
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
           
    }
}
const updateUser = async (req, res) => {
    try {
      const userId = req.query.userId || req.user.id;
      const { username, bio, url,banner,location,email } = req.body;
  
      const updates = {};
  
      if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken',
          });
        }
        updates.username = username;
        updates.email=email;
      }
  
      if (bio) updates.bio = bio;
  
     updates.pfp=url;
  updates.banner=banner;
  updates.location=location;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select('-password');
  
      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
const getyourprofile=async(req,res)=>{
  try{
const userId=req.user.id;
const user = await User.findById(userId).select('-passwordHash');
res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
}
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-passwordHash -email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const allPosts = await Posts.find({ userId: user._id })
    .populate('userId', 'username pfp');
    ;
    const Likesreceived = await Posts.countDocuments({ likes: user._id });
    const likedPosts = await Posts.find({ likes: user._id })
    .populate('userId', 'username pfp');
    ;

    res.status(200).json({ 
      success: true,
      user,
      allPosts,
      likedPosts,
      Likesreceived
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  const mongoose = require('mongoose');

const addBookmark = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid user or post ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (!user.bookmarks) user.bookmarks = [];

    if (user.bookmarks.includes(postId)) {
      return res.status(409).json({ success: false, message: 'Post already bookmarked' });
    }

    user.bookmarks.push(postId);
    await user.save();

    return res.status(200).json({ success: true, message: 'Post bookmarked', post });
  } catch (error) {
    console.error('Bookmark error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


  const removeBookmark = async (req, res) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
  
      const user = await User.findById(userId);
      const post=await Posts.findById(postId)

      if (user.bookmarks.includes(postId)) {
        user.bookmarks.pull(postId);
        await user.save();
        return res.status(200).json({ success: true, message: 'Bookmark removed',post });
      }
  
      res.status(404).json({ success: false, message: 'Bookmark not found' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const getUserBookmarks = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await User.findById(userId).populate({
        path: 'bookmarks',
        populate: {
          path: 'userId',
          select: 'username pfp',
        },
      });
  
      res.status(200).json({ success: true, bookmarks: user.bookmarks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const searchuser = async (req, res) => {
    try {
      const { input } = req.params;
  
      const users = await User.find({
        username: { $regex: '^' + input, $options: 'i' }
      });
  
      if (users.length > 0) {
        return res.status(200).json({ success: true, users });
      } else {
        return res.status(404).json({ success: false, message: 'No users found' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
  
 const deleteuser = async (req, res) => {
  try {
    const userId = req.query.id || req.user.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userId === req.user.id && user.role === 'admin') {
      return res.status(403).json({ success: false, message: "Admins cannot delete themselves" });
    }

    await Promise.all([
      User.findByIdAndDelete(userId),
      Posts.deleteMany({ userId: userId }),
      Comments.deleteMany({ userId: userId }),
      Posts.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
      ),
      Posts.updateMany(
        { dislikes: userId },
        { $pull: { dislikes: userId } }
      )
    ]);

    return res.status(200).json({ success: true, message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
  const getallusers=async(req,res)=>{
    try{
      const users=await User.find().select("-password");
      return res.status(200).json({ success: true,message:'All users fetched', users });
      }
      catch(error){
        return res.status(500).json({ success: false, message: error.message });
        }
  }
  
module.exports = { updateUser,getposts,getUserProfile,addBookmark,removeBookmark,getUserBookmarks,getyourprofile,searchuser,deleteuser,getallusers};
