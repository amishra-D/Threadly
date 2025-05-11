import React from 'react';
import Mysideb from '../reusables/Mysideb';
import Postpage from '../reusables/Postpage';
import Header from '../reusables/Header';
import Boarddescription from '@/reusables/Boarddescription';

const Home = () => {
  return (
    <div className='mt-16'>
      <Header />
      <div className='flex flex-col relative md:flex-row gap-6 px-3 md:px-6 py-6'>       
      <div className="hidden md:block absolute left-0 top-0 md:static md:w-1/5 z-30">
          <Mysideb />
        </div>
        <div className='w-full md:w-3/5'>
          <Postpage />
        </div>

        <div className='hidden lg:block w-full md:w-1/5'>
          <Boarddescription />
        </div>
      </div>
    </div>
  );
};

export default Home;
