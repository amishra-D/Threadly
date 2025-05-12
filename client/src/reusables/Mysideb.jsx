import { SidebarProvider, SidebarTrigger } from "../Components/ui/sidebar";
import { AppSidebar } from "../Components/app-sidebar";

export default function Mysideb({ user }) {
  return (
    <SidebarProvider className="relative min-h-screen">
      <AppSidebar />
      <SidebarTrigger className='fixed bottom-3 left-64'/>
    </SidebarProvider>
  );
}
