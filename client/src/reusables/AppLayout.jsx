import React, { useState } from 'react';
import Header from './Header';
import CustomSidebar from './CustomSidebar';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full flex min-h-screen bg-black overflow-hidden relative">
      <CustomSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 mt-16 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
