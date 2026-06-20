import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../../features/posts/postsSlice';
import { toast } from "sonner";
import PostCard from './Postcard';
import Boards from '../Boards/Boards.jsx';
import Createpost from './Createpost';
import SortCombobox from '../../Components/SortCombobox';
import { Plus } from 'lucide-react';
import Postcardloader from './Postcardloader';

const Postpage = () => {
  const create=useRef(null)
  const dispatch = useDispatch();
  const scrollToDiv = () => {
    create.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const { items: posts, loading, loadingMore, hasMore, page } = useSelector((state) => state.posts);
  const [selectedSort, setSelectedSort] = useState("new");
  const [createOpen, setCreateOpen] = useState(false);
  const observer = useRef();

  const id = activeBoard?._id;
  const name = activeBoard?.name;

  const lastPostElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        if (!id && name === 'All') {
          dispatch(getAllPosts({ page: nextPage, sort: selectedSort }));
        } else {
          dispatch(getAllPosts({ boardId: id, sort: selectedSort, page: nextPage }));
        }
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, page, id, name, selectedSort, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!id && name === 'All') {
          await dispatch(getAllPosts({ page: 1, sort: selectedSort })).unwrap();
        } else {
          await dispatch(getAllPosts({ boardId: id, sort: selectedSort, page: 1 })).unwrap();
        }
      } catch (err) {
        toast.error(err.message || "Cannot fetch posts");
      }
    };
    fetchPosts();
  }, [dispatch, id, name, selectedSort]);

  return (
    <div className='flex flex-col items-center w-full px-2 sm:px-4'>
      <Boards />
      <div className='w-full' ref={create}>
      {createOpen && <Createpost />}
      </div>
      <div className="w-full max-w-2xl mx-auto flex justify-end mb-4 z-40">
        <SortCombobox selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>
      {loading && (
        <>
          <Postcardloader />
          <Postcardloader />
          <Postcardloader />
        </>
      )}
      {!loading && posts?.length > 0 ? (
        posts.map((post, index) => {
          if (!post) return null;
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post._id || index} className="w-full">
                <PostCard post={post} index={index} />
              </div>
            );
          } else {
            return <PostCard key={post._id || index} post={post} index={index} />;
          }
        })
      ) : (
        !loading && <p>No posts available</p>
      )}

      {loadingMore && (
        <div className="w-full max-w-2xl mx-auto my-4">
          <Postcardloader />
        </div>
      )}

      <div
        className={`fixed right-4 bottom-4 z-50 bg-[#ddff00] rounded-full w-12 h-12 flex justify-center items-center hover:scale-105 transition-all ${createOpen?`rotate-45`:`rotate-none`}`}
        onClick={() => {setCreateOpen(!createOpen);
          if(!createOpen) scrollToDiv()
      }
        }
      >
        <Plus fontSize={20} color='#000000'  />
      </div>
    </div>
  );
};

export default Postpage;