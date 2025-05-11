import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Logo from '../assets/Logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getYourUser, searchUser } from '../features/user/usersSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
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

  useEffect(() => {
    dispatch(getYourUser()).unwrap().catch((err) => {
      toast.error(err.message || "Failed to fetch user");
    });
  }, [dispatch]);

  return (
    <header className='fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <img src={Logo} alt="Logo" className='h-8 w-8 object-contain' />
          <p className='text-xl font-bold bg-gradient-to-r from-[#ddff00] to-yellow-400 bg-clip-text text-transparent'>Threadly</p>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              value={input}
              onChange={handleSearch}
              placeholder="Search threads..."
              className="w-full pl-10 focus-visible:ring-2 focus-visible:ring-[#ddff00]"
            />
            {input.trim() !== '' && searchedusers.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-black border rounded shadow z-50 max-h-60 overflow-y-auto">
                {searchedusers.map((user) => (
                  <div key={user._id} className="p-2 hover:bg-gray-900 cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/userprofile', { state: { userData: { username: user.username } } })}>
                    <img src={user.pfp} alt={user.username} className="h-6 w-6 rounded-full" />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-[#ddff00]"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <p className='font-bold hidden sm:inline cursor-default z-50' onClick={() => navigate('/userprofile')}>{myuser?.username}</p>
          <div className="relative"  onClick={() => navigate('/userprofile')}>
            <img
              src={myuser?.pfp}
              alt="User Avatar"
              className='h-8 w-8 rounded-full border-2 border-[#ddff00] object-cover'
            />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          </div>
        </div>
      </div>

      {showMobileSearch && (
        <div className="md:hidden px-4 py-2">
          <Input
            type="search"
            value={input}
            onChange={handleSearch}
            placeholder="Search threads..."
            className="w-full pl-10 focus-visible:ring-2 focus-visible:ring-[#ddff00]"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
