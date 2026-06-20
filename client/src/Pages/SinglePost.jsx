import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../features/posts/postsSlice';
import PostCard from '../reusables/Posts/Postcard';
import { toast } from 'sonner';
import { Skeleton } from '../Components/ui/skeleton';
import { Button } from '../Components/ui/button';
import { ChevronLeft } from 'lucide-react';

const SinglePost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts, loading } = useSelector((state) => state.posts);
  const [post, setPost] = useState(null);

  useEffect(() => {
    // We fetch all posts and find the specific one. 
    // In a real production app, you'd add a getPostById API to avoid fetching everything.
    const fetchPosts = async () => {
      try {
        await dispatch(getAllPosts()).unwrap();
      } catch (err) {
        toast.error("Failed to load post");
      }
    };

    if (!posts || posts.length === 0) {
      fetchPosts();
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const foundPost = posts.find(p => p._id === postId);
      setPost(foundPost);
    }
  }, [posts, postId]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/home')}
        className="mb-4 flex items-center gap-1 w-fit px-0 hover:bg-transparent text-gray-400 hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Home
      </Button>

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl bg-gray-900/50" />
      ) : post ? (
        <PostCard post={post} index={0} featured={true} />
      ) : (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-12 text-center mt-8">
          <h2 className="text-2xl font-bold text-white mb-2">Post not found</h2>
          <p className="text-gray-400 mb-6">This post may have been deleted or the link is incorrect.</p>
          <Button onClick={() => navigate('/home')} className="bg-[#ddff00] text-black hover:bg-[#ccee00]">
            Return Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
