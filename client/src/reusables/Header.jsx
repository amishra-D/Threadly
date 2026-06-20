import React, { useEffect, useState } from 'react'
import { Input } from "../Components/ui/input"
import { Search } from 'lucide-react'
import { Button } from "../Components/ui/button"
import Logo from '../assets/Logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../features/user/usersSlice';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myuser, searchedusers } = useSelector((state) => state.user);
  const [input, setInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim()) {
      try {
        await dispatch(searchUser(value));
      } catch (err) {
        console.log("Search error:", err);
      }
    }
  };

  return (
    <header className='fixed top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60'>
      <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto relative'>
        {/* Left Section */}
        <div className='flex items-center gap-2'>
          <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-[#ddff00] mr-2" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <img src={Logo} alt="Logo" className='h-10 w-10 sm:h-12 sm:w-12 object-contain cursor-pointer' onClick={() => navigate('/home')} />
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              value={input}
              onChange={handleSearch}
              placeholder="Search threads..."
              className="w-full pl-10 bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-[#ddff00] text-white"
            />
            {input.trim() !== '' && searchedusers.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-black border border-white/10 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchedusers.map((user) => (
                  <div key={user._id} className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                    onClick={() => navigate('/userprofile', { state: { userData: { username: user.username } } })}>
                    <img src={user.pfp} alt={user.username} className="h-8 w-8 rounded-full object-cover shrink-0" />
                    <span className="font-medium text-sm text-gray-200 truncate">{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3 sm:gap-4'>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-[#ddff00] shrink-0"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity shrink-0" onClick={() => navigate('/userprofile')} title={myuser?.username}>
            <img
              src={myuser?.pfp}
              alt="User Avatar"
              className='h-9 w-9 rounded-full border-2 border-[#ddff00] object-cover'
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-black"></span>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-3 border-t border-white/10 bg-black">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              value={input}
              onChange={handleSearch}
              placeholder="Search threads..."
              className="w-full pl-10 bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-[#ddff00] text-white"
            />
            {input.trim() !== '' && searchedusers.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-black border border-white/10 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchedusers.map((user) => (
                  <div key={user._id} className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                    onClick={() => navigate('/userprofile', { state: { userData: { username: user.username } } })}>
                    <img src={user.pfp} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
                    <span className="font-medium text-sm text-gray-200">{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
