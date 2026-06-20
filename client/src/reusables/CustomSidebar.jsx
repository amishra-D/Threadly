import React, { useEffect } from 'react';
import { House, Settings, TrendingUp, User, Bookmark, FileUser, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getYourUser } from "@/features/user/usersSlice";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../Components/ui/button";

const items = [
  { title: "Home", icon: House, href: "/home" },
  { title: "Trending", icon: TrendingUp, href: "/trending" },
  { title: "Bookmark", icon: Bookmark, href: "/bookmark" },
  { title: "Profile", icon: User, href: "/userprofile" },
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Admin", icon: FileUser, href: "/admin" },
];

const CustomSidebar = ({ isOpen, onClose }) => {
  const isAdmin = useSelector((state) => state.user.myuser?.isAdmin);
  const myuser = useSelector((state) => state.user.myuser);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  const visibleItems = items.filter((item) => item.title !== "Admin" || isAdmin);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={onClose} 
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 md:hidden">
          <h1 className="text-xl font-bold text-[#ddff00]">Threadly</h1>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 md:mt-16">
          {visibleItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.title}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-800 text-[#ddff00]' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 flex items-center gap-3">
          <img 
            src={myuser?.pfp || 'https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/Logo_igihne.png'} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-gray-700 object-cover" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{myuser?.username || 'Guest'}</span>
            <span className="text-xs text-gray-400">User Profile</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CustomSidebar;
