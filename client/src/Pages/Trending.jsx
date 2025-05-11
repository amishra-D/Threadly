import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../features/posts/postsSlice';
import PostCard from '../reusables/Postcard'; // adjust path as needed
import { toast } from 'sonner';
import { Skeleton } from '../Components/ui/skeleton';
import Mysideb from '../reusables/Mysideb';
import Header from '../reusables/Header';


const Trending = () => {
  const dispatch = useDispatch();
  const { items: posts = [], loading } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await dispatch(getAllPosts({ sort: 'hot' })).unwrap();
      } catch (err) {
        toast.error(err.message || 'Cannot fetch posts');
      }
    };
    fetchPosts();
  }, [dispatch]);

  const [featuredPost, ...otherPosts] = posts;

  return (
    <div>
                  <Header />
    <div className='max-w-4xl mx-auto px-4 py-6 relative'>
      <div className="hidden md:block absolute -left-72 top-0 md:w-1/4 z-30">
                <Mysideb />
              </div>
      <section className='mb-10 mt-16'>
        <h1 className='text-2xl md:text-3xl font-bold text-[#ddff00] mb-4'>Featured Post</h1>
        {loading ? (
          <Skeleton height={400} className='rounded-xl' />
        ) : featuredPost ? (
          <div className='bg-gradient-to-r from-gray-900 to-gray-800 p-1 rounded-xl shadow-lg'>
            <PostCard 
              post={featuredPost}
              index={0} 
              featured={true}
            />
          </div>
        ) : (
          <div className='bg-gray-800 rounded-xl p-8 text-center'>
            <p className='text-gray-400'>No featured posts available</p>
          </div>
        )}
      </section>
      <section>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-[#ddff00]'>Trending Now</h1>
          <span className='text-sm text-gray-400'>{otherPosts.length} posts</span>
        </div>
        
        {loading ? (
          <div className='grid gap-6'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={120} className='rounded-lg' />
            ))}
          </div>
        ) : (
          <div className='grid gap-6'>
            {otherPosts.length > 0 ? (
              otherPosts.map((post, index) => (
                post && (
                  <div 
                    key={post._id || index} 
                    className='bg-gray-800/50 hover:bg-gray-800/70 transition-colors rounded-lg p-1'
                  >
                    <PostCard 
                      post={post} 
                      index={index + 1} 
                      compact={true}
                    />
                  </div>
                )
              ))
            ) : (
              <div className='bg-gray-800 rounded-lg p-8 text-center'>
                <p className='text-gray-400'>No trending posts available</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
        </div>

  );
};

export default Trending;