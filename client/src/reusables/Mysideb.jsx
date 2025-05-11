import { SidebarProvider, SidebarTrigger } from "../Components/ui/sidebar";
import { AppSidebar } from "../Components/app-sidebar";

export default function Mysideb({ user }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className='fixed bottom-5'/>
    </SidebarProvider>
  );
}
