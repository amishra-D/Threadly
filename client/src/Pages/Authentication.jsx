import Loginform from '../reusables/Loginform';
import Signupform from '../reusables/Signupform';
import React, { useState } from 'react';

const Authentication = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-64 md:h-auto relative">
        <img
          className="w-full h-full object-cover opacity-65 mix-blend-hard-light"
          src="https://images.unsplash.com/photo-1574081675634-4f043f2e85ae?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="People collaborating in a community"
        />
        <div className="absolute bottom-8 left-4 md:left-8 w-[90%] md:w-[60%] space-y-2 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Join Our Community</h1>
          <p className="text-sm md:text-base">
            Share your thoughts, discover new perspectives, and connect with others anonymously.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-[#ddff00] tracking-wide">THREADLY</h1>
          <p className="text-lg text-gray-400">Where ideas and opinions matter</p>
        </div>

        <div className="flex gap-6 w-full max-w-xs justify-center">
          <button
            className={`text-lg font-medium pb-1 transition-all ${
              login
                ? 'text-[#ddff00] border-b-2 border-[#ddff00]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setLogin(true)}
          >
            Login
          </button>
          <button
            className={`text-lg font-medium pb-1 transition-all ${
              !login
                ? 'text-[#ddff00] border-b-2 border-[#ddff00]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="w-full max-w-md mt-4">
          {login ? <Loginform /> : <Signupform />}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
