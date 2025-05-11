import {House,Settings,TrendingUp,User,Bookmark,FileUser } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { useSelector,useDispatch } from "react-redux";
import { getYourUser } from "@/features/user/usersSlice";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
const items = [
  {
    title: "Home",
    icon: House ,
    href: "/home",
  },
  {
    title: "Trending",
    icon: TrendingUp,
    href: "/trending",
  },
  {
    title: "Bookmark",
    icon: Bookmark,
    href: "/bookmark",
  },
  {
    title: "Profile",
    icon: User,
    href: "/userprofile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Admin",
    icon: FileUser,
    href: "/Admin",
  },
]
export function AppSidebar() {
  const isAdmin = useSelector((state) => state.user.myuser?.isAdmin);
const dispatch=useDispatch();
  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  const visibleItems = items.filter(
    (item) => item.title !== "Admin" || isAdmin
  );

  return (
    <Sidebar className="w-64 h-screen bg-muted text-foreground border-r z-30 mt-16">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1>Threadly</h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="z-50" asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 text-base"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="self-center font-medium text-xs">Guest</p>
      </SidebarFooter>
    </Sidebar>
  );
}
