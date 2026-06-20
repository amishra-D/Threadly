const mongoose=require('mongoose')
const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  content: { type: String, required: true },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
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
