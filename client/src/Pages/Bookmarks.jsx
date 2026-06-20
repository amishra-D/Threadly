import React, { useEffect } from 'react';
import PostCard from '../reusables/Posts/Postcard';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarks } from '../features/user/usersSlice';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { bookmarks } = useSelector((state) => state.user);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await dispatch(getBookmarks());
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <div className="w-full max-w-4xl px-4 py-6 mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#ddff00] mb-4">Bookmarks</h1>
      {bookmarks.map((post, index) => post && (
        <PostCard key={post._id || index} post={post} index={index} />
      ))}
    </div>
  );
};

export default Bookmarks;
