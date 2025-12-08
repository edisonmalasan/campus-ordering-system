import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronUp, User2, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  IconLayoutDashboard,
  IconShield,
  IconUsers,
  IconBuildingStore,
  IconUserCheck,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import navibitesLogo from "@/assets/icon.png";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    name: "Shop Verification",
    url: "/admin/shops/pending",
    icon: IconShield,
  },
  {
    name: "Manage Shops",
    url: "/admin/shops",
    icon: IconBuildingStore,
  },
  {
    name: "Manage Customers",
    url: "/admin/customers",
    icon: IconUserCheck,
  },
  {
    name: "All Users",
    url: "/admin/users",
    icon: IconUsers,
  },
];

function NavMain({
  items,
}: {
  items: {
    name: string;
    url?: string;
    icon: React.ComponentType<any>;
    items?: { name: string; url: string }[];
  }[];
}) {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemName: string) => {
    setOpenItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2 mt-8">
        {items.map((item) => {
          if (item.items) {
            const isOpen = openItems.includes(item.name);
            const hasActiveChild = item.items.some(
              (subItem) => location.pathname === subItem.url
            );

            return (
              <SidebarMenuItem key={item.name}>
                <Collapsible
                  open={isOpen || hasActiveChild}
                  onOpenChange={() => toggleItem(item.name)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="!h-10">
                      <item.icon />
                      <span className="text-base">{item.name}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${
                          isOpen || hasActiveChild ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-6 mt-1 space-y-1">
                      {item.items.map((subItem) => {
                        const isActive = location.pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className={`!h-9 ${
                                isActive
                                  ? "!bg-purple-600 !text-white hover:!bg-purple-700"
                                  : ""
                              }`}
                            >
                              <Link to={subItem.url}>
                                <span className="text-sm">{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            );
          }

          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={`!h-10 flex items-center ${
                  isActive
                    ? "!bg-purple-600 !text-white hover:!bg-purple-700"
                    : ""
                }`}
              >
                <Link to={item.url!} className="space-x-5">
                  <item.icon />
                  <span className="text-base">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="pt-3">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin/dashboard" className="space-x-3">
                <img
                  src={navibitesLogo}
                  alt="NaviBites Logo"
                  className={` rounded-md transition duration-300 ease-in-out ${
                    isCollapsed ? "h-5 w-5" : "h-8 w-8"
                  }`}
                />
                <span className="text-lg font-semibold">NaviBites Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full">
                  {user?.profile_photo_url ? (
                    <img
                      src={user.profile_photo_url}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User2 />
                  )}
                  <span className="truncate">
                    {user?.name || "Administrator"}
                  </span>
                  <ChevronUp
                    className={`ml-auto transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="CollapsibleContent">
                <SidebarMenuButton
                  asChild
                  className="cursor-pointer pl-8"
                  onClick={handleLogout}
                >
                  <button className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </SidebarMenuButton>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
