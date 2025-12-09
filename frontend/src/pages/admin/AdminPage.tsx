import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../components/ui/sidebar";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/shops/pending": "Pending Shop Verification",
  "/admin/shops": "Manage Shops",
  "/admin/customers": "Manage Customers",
  "/admin/users": "All Users",
};

export default function AdminPage() {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Admin Panel";

  return (
    <SidebarProvider>
      <AdminSidebar variant="inset" />
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
