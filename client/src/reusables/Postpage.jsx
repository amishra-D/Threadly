import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../features/posts/postsSlice';
import { toast } from "sonner";
import PostCard from './Postcard';
import Boards from '../reusables/Boards';
import Createpost from '../reusables/Createpost';
import SortCombobox from '../Components/SortCombobox';
import { Plus } from 'lucide-react';
import Postcardloader from './Postcardloader';

const Postpage = () => {
  const create=useRef(null)
  const dispatch = useDispatch();
  const scrollToDiv = () => {
    create.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const { items: posts, loading } = useSelector((state) => state.posts);
  const [selectedSort, setSelectedSort] = useState("new");
  const [createOpen, setCreateOpen] = useState(false);

  const id = activeBoard?._id;
  const name = activeBoard?.name;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!id && name === 'All') {
          await dispatch(getAllPosts()).unwrap();
        } else {
          await dispatch(getAllPosts({ boardId: id, sort: selectedSort })).unwrap();
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
        posts.map((post, index) => post && (
          <PostCard key={post._id || index} post={post} index={index} />
        ))
      ) : (
        !loading && <p>No posts available</p>
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