import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Mysideb({ user }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className='fixed bottom-5'/>
    </SidebarProvider>
  );
}
