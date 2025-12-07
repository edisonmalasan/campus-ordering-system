import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/customer/AppSidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { Link, useLocation, useMatches } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/customer/foods": "Foods",
  "/customer/store": "Store",
  "/customer/shops": "Shops",
  "/customer/cart": "Your Cart",
  "/customer/orders": "Your Orders",
  "/customer/profile": "Your Profile",
};

export default function CustomerPage() {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "NaviBites";
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
        <main className="flex-1 p-8 bg-background">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
