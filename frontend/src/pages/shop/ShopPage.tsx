import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../components/ui/sidebar";
import { ShopSidebar } from "../../components/shop/ShopSidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/shop/dashboard": "Dashboard",
  "/shop/products": "Products",
  "/shop/products/new": "Add Product",
  "/shop/orders": "Orders",
  "/shop/reports/daily": "Daily Sales Report",
  "/shop/reports/weekly": "Weekly Sales Report",
  "/shop/settings": "Business Settings",
};

export default function ShopPage() {
  const location = useLocation();

  // TODO: endpoints /shop/products/:id/edit
  let title = pageTitles[location.pathname];
  if (
    !title &&
    location.pathname.includes("/shop/products/") &&
    location.pathname.includes("/edit")
  ) {
    title = "Edit Product";
  }
  title = title || "NaviBites Shop";

  return (
    <SidebarProvider>
      <ShopSidebar variant="inset" />
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
