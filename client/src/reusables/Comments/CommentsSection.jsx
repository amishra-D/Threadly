import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getcomment,
  addcomment,
  deletecomment,
  addlike,
  adddislike,
} from "../../features/comments/commentsSlice";
import { toast } from "sonner";
import { Button } from "../../Components/ui/button";
import { ThumbsUp, ThumbsDown, Trash2, MessageSquare, ChevronDown, ChevronUp, AlertOctagon } from "lucide-react";
import { Textarea } from "../../Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar";
import { Skeleton } from "../../Components/ui/skeleton";
import { addreport, getAllPosts } from "../../features/posts/postsSlice";
import { getYourUser } from "@/features/user/usersSlice";

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const { items: comments, loading } = useSelector(state => state.comments);
  const currentUser = useSelector(state => state.user.myuser);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
 
  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  useEffect(() => {
    if (postId) {
      dispatch(getcomment(postId));
    }
  }, [dispatch, postId]);

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: prev[commentId] === false ? true : false
    }));
  };

  const handleReport = async (commentId) => {
    try {
      const result = await dispatch(addreport({type:'Comment',contentId:commentId,reason:'Its offensive'})).unwrap();
      toast.success(result.message || "Reported successfully");
    } catch (err) {
      toast.error(err.message || "Failed to report comment");
    }
  };

  const handleAddComment = async (parentCommentId = null) => {
    const text = parentCommentId ? replyContent : content;
    if (!text.trim()) return;

    try {
      await dispatch(
        addcomment({
          postId,
          content: text,
          parentCommentId: parentCommentId || null,
        })
      ).unwrap();
      toast.success(parentCommentId ? "Reply added" : "Comment added");
      if (parentCommentId) {
        setReplyContent("");
        setReplyingTo(null);
        setExpandedReplies(prev => ({ ...prev, [parentCommentId]: true }));
      } else {
        setContent("");
      }
      dispatch(getcomment(postId));
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await dispatch(deletecomment(commentId)).unwrap();
      toast.success("Comment deleted");
      dispatch(getAllPosts());
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const handleVote = async (commentId, type) => {
    const action = type === "like" ? addlike : adddislike;
    try {
      await dispatch(action(commentId)).unwrap();
      dispatch(getcomment(postId));
    } catch (err) {
      toast.error(`Failed to ${type} comment`);
    }
  };

  const renderComment = (comment, level = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies[comment._id] !== false;
    const isReply = level > 0;

    return (
      <div
        key={comment._id}
        className={`relative mt-4 flex gap-3 ${isReply ? '' : ''}`}
      >
        <div className="flex flex-col items-center">
          <Avatar className={`border border-gray-800 shadow-sm z-10 bg-black ${isReply ? 'h-8 w-8' : 'h-10 w-10'}`}>
            <AvatarImage src={comment.userId?.pfp || comment.userId?.avatar} />
            <AvatarFallback className="bg-gray-800 text-[#ddff00] font-bold text-xs">
              {comment.userId?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {(hasReplies && isExpanded) && (
            <div className="w-0.5 bg-gray-800 flex-grow mt-2 rounded-full min-h-[20px]"></div>
          )}
        </div>

        <div className="flex-1 min-w-0 pb-2">
          <div className="bg-gray-900/40 rounded-2xl p-4 border border-gray-800/60 shadow-sm transition-all hover:border-gray-700 hover:bg-gray-900/60">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  {comment.userId?.username || "Anonymous"}
                </span>
                <span className="text-gray-500 text-xs font-medium">
                  • {timeAgo(comment.createdAt)}
                </span>
              </div>
              
              {currentUser?.authId === comment.userId?._id && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(comment._id)}
                  className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 rounded-full transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            
            <p className="text-gray-300 mt-1 text-sm whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
            
            <div className="mt-3.5 flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment._id, "like")}
                className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors ${
                  comment.likes?.includes(currentUser?.authId) 
                    ? 'text-black bg-[#ddff00] hover:bg-[#ccee00]' 
                    : 'text-gray-400 hover:text-[#ddff00] hover:bg-[#ddff00]/10'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                {comment.likes?.length || 0}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment._id, "dislike")}
                className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors ${
                  comment.dislikes?.includes(currentUser?.authId) 
                    ? 'text-white bg-red-500 hover:bg-red-600' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                {comment.dislikes?.length || 0}
              </Button>

              {!comment.parentCommentId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors ${
                    replyingTo === comment._id 
                      ? 'text-blue-400 bg-blue-400/10' 
                      : 'text-gray-400 hover:text-blue-400 hover:bg-blue-400/10'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Reply
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReport(comment._id)}
                className="h-7 px-2.5 rounded-full text-xs font-medium text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 transition-colors ml-auto"
                title="Report Comment"
              >
                <AlertOctagon className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            {replyingTo === comment._id && (
              <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <Avatar className="h-8 w-8 shrink-0 border border-gray-800">
                   <AvatarImage src={currentUser?.pfp || currentUser?.avatar} />
                   <AvatarFallback className="bg-gray-800 text-xs">Me</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.userId?.username || 'Anonymous'}...`}
                    className="w-full bg-black/60 border-gray-700 text-white focus:border-[#ddff00] focus:ring-1 focus:ring-[#ddff00] min-h-[80px] rounded-xl resize-none text-sm shadow-inner"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="text-gray-400 hover:text-white rounded-full h-8 px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!replyContent.trim()}
                      onClick={() => handleAddComment(comment._id)}
                      className="bg-[#ddff00] text-black hover:bg-[#ccee00] rounded-full font-semibold h-8 px-5 disabled:opacity-50"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {hasReplies && (
            <div className="mt-2 pl-1">
              <button
                onClick={() => toggleReplies(comment._id)}
                className="text-xs font-bold text-[#ddff00]/70 hover:text-[#ddff00] flex items-center gap-1.5 transition-colors mb-2 py-1 px-2.5 rounded-full hover:bg-[#ddff00]/10"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
              
              <div className={`space-y-1 ${isExpanded ? 'block animate-in fade-in duration-300' : 'hidden'}`}>
                {comment.replies.map(reply => renderComment(reply, level + 1))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 border-t border-gray-800/80 pt-8">
      <div className="flex items-center gap-2 mb-6 px-1">
        <MessageSquare className="h-5 w-5 text-[#ddff00]" />
        <h3 className="text-white font-bold text-xl">Comments</h3>
        <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
          {comments.length}
        </span>
      </div>

      <div className="mb-8 flex gap-3">
         <Avatar className="h-10 w-10 shrink-0 border border-gray-800 shadow-sm bg-black">
             <AvatarImage src={currentUser?.pfp || currentUser?.avatar} />
             <AvatarFallback className="bg-gray-800 text-[#ddff00] font-bold">Me</AvatarFallback>
         </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-900/50 border-gray-800 text-white focus:border-[#ddff00] focus:ring-1 focus:ring-[#ddff00] min-h-[100px] rounded-xl resize-none shadow-inner transition-all"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => handleAddComment()}
              disabled={!content.trim()}
              className="bg-[#ddff00] text-black hover:bg-[#ccee00] rounded-full px-6 font-semibold shadow-lg shadow-[#ddff00]/10 disabled:opacity-50 transition-all active:scale-95"
            >
              Post
            </Button>
          </div>
        </div>
      </div>

      {loading && comments.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl bg-gray-900/40 border border-gray-800/50" />
          <Skeleton className="h-28 w-full rounded-2xl bg-gray-900/40 border border-gray-800/50" />
        </div>
      ) : (
        <div className="space-y-1">
          {comments
            .filter(comment => comment.parentCommentId === null)
            .map(comment => renderComment(comment))}
            
          {comments.length === 0 && !loading && (
             <div className="text-center py-12 bg-gray-900/20 rounded-2xl border border-gray-800/50 border-dashed mt-4">
                <MessageSquare className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 font-medium text-lg">No comments yet</p>
                <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
