const mongoose=require('mongoose')
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId'
});

commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

module.exports=mongoose.model('Comment', commentSchema);
