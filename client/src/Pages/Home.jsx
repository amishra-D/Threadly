import React from 'react';
import Postpage from '../reusables/Posts/Postpage';
import Boarddescription from '../reusables/Boards/Boarddescription';

const Home = () => {
  return (
    <div className='flex flex-col lg:flex-row gap-6 px-3 md:px-6 py-6 w-full max-w-[1400px] mx-auto'>       
      <div className='flex-1 min-w-0'>
        <Postpage />
      </div>

      <div className='hidden lg:block w-80 flex-shrink-0'>
        <Boarddescription />
      </div>
    </div>
  );
};

export default Home;
