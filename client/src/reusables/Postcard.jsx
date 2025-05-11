import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addlike, adddislike, deletePost, addreport, getAllPosts } from '../features/posts/postsSlice';
import { addBookmark, removeBookmark } from '../features/user/usersSlice';
import { handleShare } from '../features/handleShare';
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Share, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import Postcardloader from "./Postcardloader";
import CommentsSection from "./CommentsSection";
import { Skeleton } from "../Components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function PostCard({ post, index, featured = false, compact = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.myuser); 
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteCount, setVoteCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsShow, setCommentsShow] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (post) {
      setVoteCount(post.likes?.length - post.dislikes?.length || 0);
      if (currentUser && post.likes?.includes(currentUser._id)) {
        setUserVote('up');
      } else if (currentUser && post.dislikes?.includes(currentUser._id)) {
        setUserVote('down');
      }
      setSaved(currentUser?.bookmarks?.includes(post._id) || false);
    }
  }, [post, currentUser]);

  if (!post) {
    return <Postcardloader />;
  }

  const handleCommentToggle = () => {
    setCommentsShow(!commentsShow);
  }

  const handleSave = async (id) => {
    try {
      let result;
      if (saved) {
        result = await dispatch(removeBookmark({ postId: id })).unwrap();
        setSaved(false);
      } else {
        result = await dispatch(addBookmark({ postId: id })).unwrap();
        setSaved(true);
      }
      toast.success(result.message || 'Bookmark updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update bookmark');
    }
  };
  const handleDelete = async (postId) => {
    try {
      const result = await dispatch(deletePost(postId)).unwrap();
      toast.success(result.message || "Post deleted successfully");
            dispatch(getAllPosts());
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    }
  };
  const handleReport=async(postId)=>{
  try {
    const result = await dispatch(addreport({type:'Post',contentId:postId,reason:'Its offensive'})).unwrap();
    toast.success(result.message || "Reported successfully");
}
catch (err) {
  toast.error(err.message || "Failed to report post");
  }
  }
  const handleVote = async (type) => {
    if (!currentUser) {
      toast.error("Please login to vote");
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const previousVote = userVote;
      const previousCount = voteCount;

      if (type === 'up') {
        setUserVote(previousVote === 'up' ? null : 'up');
        setVoteCount(prev => {
          if (previousVote === 'up') return prev - 1;
          if (previousVote === 'down') return prev + 2;
          return prev + 1;
        });
      } else {
        setUserVote(previousVote === 'down' ? null : 'down');
        setVoteCount(prev => {
          if (previousVote === 'down') return prev + 1;
          if (previousVote === 'up') return prev - 2;
          return prev - 1;
        });
      }

      const action = type === 'up' ? addlike : adddislike;
      await dispatch(action(post._id)).unwrap();
    } catch (err) {
      setUserVote(previousVote);
      setVoteCount(previousCount);
      toast.error(err.message || `Failed to ${type === 'up' ? 'like' : 'dislike'} post`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => setExpanded(!expanded);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-pfp.png';
  };

  const userData = { username: post?.userId?.username };

  return (
    <Card className={`w-full ${featured ? 'border-2 border-[#ddff00]' : 'border-gray-800'} bg-black transition-all hover:border-gray-700 mb-4 overflow-hidden`}>
      <div className={`flex ${compact ? 'flex-row' : 'flex-col'}`}>
        {compact && (
          <div className="flex flex-col items-center bg-gray-900 p-2 min-w-[40px]">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleVote('up')}
              disabled={isLoading}
              className={`${userVote === 'up' ? 'text-[#ddff00]' : 'text-gray-400'} hover:bg-gray-800 h-6 w-6`}
              aria-label="Upvote"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className={`text-xs font-medium my-1 ${
              voteCount > 0 ? 'text-[#ddff00]' : 
              voteCount < 0 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {voteCount}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleVote('down')}
              disabled={isLoading}
              className={`${userVote === 'down' ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-800 h-6 w-6`}
              aria-label="Downvote"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex-1">
         
        <CardHeader 
  className={`pb-2 ${compact ? 'px-3 py-2' : 'px-4 py-3'} cursor-pointer hover:bg-gray-900/50 transition-colors`} 
  onClick={() => navigate('/userprofile', { state: { userData } })}
>
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center space-x-2">
    </div>
    
    <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-black border-gray-800 text-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleReport(post._id);
            }}

            
            className="hover:bg-gray-800 cursor-pointer"
          >
            Report
          </DropdownMenuItem>
          {currentUser?._id === post.userId?._id && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(post._id);
              }}
              className="hover:bg-red-900 text-red-500 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>


            <div className="flex items-center space-x-2">
              <div className="relative">
                <img 
                  src={post.userId?.pfp || 'https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/Logo_igihne.png'}
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                  onError={handleImageError}
                />
                {featured && (
                  <div className="absolute -top-1 -right-1 bg-[#ddff00] text-black text-xs font-bold px-1 rounded-full">★</div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#ddff00]">
                  {post.userId?.username || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {post.caption && (
              <h2 className={`mt-1 font-semibold ${compact ? 'text-base line-clamp-2' : 'text-lg'}`}>
                {post.caption}
              </h2>
            )}
          </CardHeader>

          {!compact && (
            <CardContent className="px-4 py-2">
              {post.content && (
                <div className="mb-4">
                  <p className={`text-gray-300 whitespace-pre-line break-words ${
                    expanded ? '' : 'line-clamp-3'
                  }`}>
                    {post.content}
                  </p>
                  {post.content.length > 200 && (
                    <button 
                      onClick={toggleExpand}
                      className="text-[#ddff00] text-sm mt-1 hover:underline"
                    >
                      {expanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {post.type === "image" && post.mediaUrl && (
                <div className="w-full overflow-hidden rounded-lg">
                  <img
                    src={post.mediaUrl}
                    alt="Post"
                    className={`w-full ${featured ? 'max-h-[600px]' : 'max-h-[500px]'} object-contain rounded-lg border border-gray-800`}
                    loading="lazy"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={handleImageError}
                  />
                  {!isImageLoaded && (
                    <Skeleton className="w-full h-64" />
                  )}
                </div>
              )}
              {post.type === "video" && post.mediaUrl && (
                <div className="w-full overflow-hidden rounded-lg">
                  <video
                    controls
                    src={post.mediaUrl}
                    className={`w-full ${featured ? 'max-h-[600px]' : 'max-h-[500px]'} rounded-lg border border-gray-800`}
                    poster={post.thumbnailUrl}
                  />
                </div>
              )}
            </CardContent>
          )}

          <CardFooter className={`flex items-center justify-between ${compact ? 'px-3 py-2' : 'px-4 py-3'} border-t border-gray-800`}>
            {!compact && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:bg-gray-800 hover:text-[#ddff00]"
                  onClick={() => handleVote('up')}
                  disabled={isLoading}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${userVote === 'up' ? 'text-[#ddff00]' : ''}`} />
                  <span className="text-xs">{post.likes?.length || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:bg-gray-800 hover:text-red-500"
                  onClick={() => handleVote('down')}
                  disabled={isLoading}
                >
                  <ThumbsDown className={`h-4 w-4 mr-2 ${userVote === 'down' ? 'text-red-500' : ''}`} />
                  <span className="text-xs">{post.dislikes?.length || 0}</span>
                </Button>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:bg-gray-800 hover:text-[#ddff00]"
                onClick={handleCommentToggle}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-xs">{post.commentsCount || 0}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:bg-gray-800 hover:text-[#ddff00]"
                onClick={() => handleShare(post._id)}
              >
                <Share className="h-4 w-4 mr-2" />
                {!compact && <span className="text-xs">Share</span>}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:bg-gray-800 hover:text-[#ddff00]"
                onClick={() => handleSave(post._id)}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'text-[#ddff00] fill-[#ddff00]' : ''}`} />
                {!compact && <span className="text-xs">Save</span>}
              </Button>
            </div>
          </CardFooter>

          {commentsShow && (
            <div className="w-full px-4 pb-4 pt-2 border-t border-gray-800 bg-gray-950">
              <CommentsSection postId={post._id} compact={compact} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}