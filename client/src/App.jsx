import React, { useEffect } from 'react'
import Authentication from './Pages/Authentication';
import { BrowserRouter, Route, Routes } from "react-router"
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
import AdminRoute from "./reusables/AdminRoute";


const App = () => {
  return (
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster top-right/>
 <div className='w-full min-h-screen overflow-x-hidden'>
 <Routes>
  <Route path="/userprofile" element={<Userprofile />} />
      <Route path="/updateprofile" element={<Updateprofile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/bookmark" element={<Bookmarks />} />
      <Route path="/" element={<Landing />} />
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>   <Route path="/unauthorized" element={<Unauthorized />} />
   <Route path="/settings" element={<SettingsPage />} />

      <Route path="*" element={<Landing />} />

      </Routes>
      </div>
  </ThemeProvider>
 
      </BrowserRouter>
  )
}

export default App
