import React, { useEffect } from 'react'
import Authentication from './Pages/Authentication';
import { Route, Routes, useLocation } from "react-router-dom"
import { ThemeProvider } from "./Components/theme-provider"
import { Toaster } from 'sonner';
import Updateprofile from './Pages/Updateprofile';
import  Home  from './Pages/Home';
import Userprofile from './Pages/Userprofile';
import Trending from './Pages/Trending';
import Bookmarks from './Pages/Bookmarks';
import Landing from './Pages/Landing';
import AdminDashboard from './Pages/Adminpage';
import  SettingsPage from './Pages/Settings';
import Unauthorized from "./Pages/Unauthorized";
import AdminRoute from "./reusables/Admin/AdminRoute";
import About from './Pages/About';
import Otp from './Pages/Otp';
import SetupProfile from './Pages/SetupProfile';
import { getYourUser } from './features/user/usersSlice';
import {useDispatch} from 'react-redux';
import AppLayout from './reusables/AppLayout';
import SinglePost from './Pages/SinglePost';

const App = () => {
    const location = useLocation();
    const dispatch = useDispatch();
   useEffect(() => {
    if(location.pathname!='/auth')
      dispatch(getYourUser());
    }, [dispatch]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster top-right/>
 <div className='w-full min-h-screen overflow-x-hidden'>
 <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/setup-profile" element={<SetupProfile />} />
      <Route path="/" element={<Landing />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/about" element={<About/>} />
      
      {/* AppLayout Wraps Authenticated Routes */}
      <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/post/:postId" element={<AppLayout><SinglePost /></AppLayout>} />
      <Route path="/userprofile" element={<AppLayout><Userprofile /></AppLayout>} />
      <Route path="/userprofile/:username" element={<AppLayout><Userprofile /></AppLayout>} />
      <Route path="/updateprofile" element={<AppLayout><Updateprofile /></AppLayout>} />
      <Route path="/trending" element={<AppLayout><Trending /></AppLayout>} />
      <Route path="/bookmark" element={<AppLayout><Bookmarks /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Landing />} />
      </Routes>
      </div>
  </ThemeProvider>
   )
}

export default App
