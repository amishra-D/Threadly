import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getcomment,
  addcomment,
  deletecomment,
  addlike,
  adddislike,
} from "../features/comments/commentsSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Trash2, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { addreport } from "@/features/posts/postsSlice";

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const { items: comments, loading } = useSelector(state => state.comments);
  const currentUser = useSelector(state => state.user.user);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    if (postId) {
      dispatch(getcomment(postId));
    }
  }, [dispatch, postId]);

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
const handleReport=async(commentId)=>{
  try {
    const result = await dispatch(addreport({type:'Comment',contentId:commentId,reason:'Its offensive'})).unwrap();
    toast.success(result.message || "Reported successfully");
}
catch (err) {
  toast.error(err.message || "Failed to report post");
  }
  }
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
      dispatch(getcomment(postId));
      
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
        className={`mt-3 ${isReply ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}
      >
        <div className={`bg-gray-900 rounded-lg p-4 ${isReply ? 'border border-gray-700' : ''}`}>
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={comment.userId?.avatar} />
              <AvatarFallback className="bg-gray-700 text-gray-300">
                {comment.userId?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {comment.userId?.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {currentUser?._id === comment.userId?._id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500 h-8 w-8"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-gray-300 mt-2 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
              
           <div className="mt-3 flex items-center gap-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleVote(comment._id, "like")}
    className={`h-8 px-2 ${comment.likes?.includes(currentUser?._id) ? 'text-[#ddff00]' : 'text-gray-400 hover:text-[#ddff00]'}`}
  >
    <ThumbsUp className="h-4 w-4 mr-1" />
    <span className="text-xs">{comment.likes?.length || 0}</span>
  </Button>

  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleVote(comment._id, "dislike")}
    className={`h-8 px-2 ${comment.dislikes?.includes(currentUser?._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
  >
    <ThumbsDown className="h-4 w-4 mr-1" />
    <span className="text-xs">{comment.dislikes?.length || 0}</span>
  </Button>

  {!comment.parentCommentId && (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
      className="text-gray-400 hover:text-blue-400 h-8 px-2"
    >
      <Reply className="h-4 w-4 mr-1" />
      <span className="text-xs">Reply</span>
    </Button>
  )}

  <Button
    variant="ghost"
    size="sm"
    onClick={() =>handleReport(comment._id)}
    className="text-gray-400 hover:text-orange-500 h-8 px-2"
  >
    <span className="text-xs">Report</span>
  </Button>

  {currentUser?._id === comment.userId?._id && (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => handleDelete(comment._id)}
      className="text-gray-400 hover:text-red-500 h-8 w-8"
      aria-label="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )}
</div>

              
              {replyingTo === comment._id && (
                <div className="mt-3">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(comment._id)}
                      className="bg-[#ddff00] text-black hover:bg-[#ccee00]"
                    >
                      Post Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {hasReplies && (
          <div className="mt-2">
            <button
              onClick={() => toggleReplies(comment._id)}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide replies
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-2">
                {comment.replies.map(reply => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold mb-4 text-lg">Comments</h3>

      <div className="mb-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full bg-gray-800 border-gray-700 text-white"
          rows={3}
        />
        <Button
          onClick={() => handleAddComment()}
          disabled={!content.trim()}
          className="bg-[#ddff00] text-black hover:bg-[#ccee00] mt-2"
        >
          Post Comment
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-12 mb-3" />
      ) : (
        comments
          .filter(comment => comment.parentCommentId === null)
          .map(comment => renderComment(comment))
      )}
    </div>
  );
}
