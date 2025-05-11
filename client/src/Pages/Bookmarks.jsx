import React, { useEffect } from 'react';
import PostCard from '../reusables/Postcard';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarks } from '@/features/user/usersSlice';
import Header from '@/reusables/Header';
import Mysideb from '@/reusables/Mysideb';
import WithSidebarLayout from '@/reusables/WithSidebarLayout';

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
    <div>
                  <Header />
    <div className="flex relative">
 <div className="hidden md:block absolute -left-72 top-0 md:w-1/4 z-30">
                <Mysideb />
              </div>
      <div className="w-full md:w-3/4 max-w-4xl px-4 py-6 mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold text-[#ddff00] mb-4">Bookmarks</h1>
        {bookmarks.map((post, index) => post && (
          <PostCard key={post._id || index} post={post} index={index} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Bookmarks;
