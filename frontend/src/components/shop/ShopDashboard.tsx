import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function ShopDashboard() {
  // Mock data
  const stats = {
    todaySales: 15420.5,
    newOrders: 12,
    totalRevenue: 125300.0,
    lowStock: 5,
  };

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Edison Malasan",
      amount: 250.0,
      status: "Pending",
    },
    {
      id: "#ORD-002",
      customer: "John Doe",
      amount: 450.0,
      status: "Confirmed",
    },
    { id: "#ORD-003", customer: "Jane Smith", amount: 320.0, status: "Ready" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{stats.todaySales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrders}</div>
            <p className="text-xs text-muted-foreground">Pending action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Need restock</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{order.amount.toFixed(2)}</p>
                  <p
                    className={`text-sm ${
                      order.status === "Pending"
                        ? "text-yellow-600"
                        : order.status === "Confirmed"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
