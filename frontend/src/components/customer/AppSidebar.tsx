import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, User2, Settings, LogOut } from "lucide-react";
import {
  IconShoppingCart,
  IconReceipt,
  IconUser,
  IconToolsKitchen2,
  IconBuildingStore,
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
  useSidebar,
} from "@/components/ui/sidebar";
import navibitesLogo from "@/assets/icon.png";

const navigationItems = [
  {
    name: "Foods",
    url: "/customer/foods",
    icon: IconToolsKitchen2,
  },
  {
    name: "Store",
    url: "/customer/store",
    icon: IconBuildingStore,
  },
  {
    name: "Cart",
    url: "/customer/cart",
    icon: IconShoppingCart,
  },
  {
    name: "Orders",
    url: "/customer/orders",
    icon: IconReceipt,
  },
  {
    name: "Profile",
    url: "/customer/profile",
    icon: IconUser,
  },
];

function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: React.ComponentType<any>;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-5 mt-8">
        {items.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== "/customer/foods" &&
              location.pathname.startsWith(item.url));

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={`!h-10 flex items-center ${
                  isActive ? "!bg-blue-600 !text-white hover:!bg-blue-700" : ""
                }`}
              >
                <Link to={item.url} className="space-x-5">
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="pt-3">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/customer/foods" className="space-x-3">
                <img
                  src={navibitesLogo}
                  alt="NaviBites Logo"
                  className={`rounded-md transition duration-300 ease-in-out ${
                    isCollapsed ? "h-5 w-5" : "h-8 w-8"
                  }`}
                />
                <span className="text-lg font-semibold">NaviBites</span>
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
                  <User2 /> Username
                  <ChevronUp
                    className={`ml-auto transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="CollapsibleContent">
                <SidebarMenuButton asChild className="cursor-pointer pl-8">
                  <Link
                    to="/customer/profile"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild className="cursor-pointer pl-8">
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
