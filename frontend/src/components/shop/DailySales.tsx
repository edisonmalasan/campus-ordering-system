import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

export default function DailySales() {
  // Mock data for today
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dailyStats = {
    totalSales: 15420.5,
    totalOrders: 48,
    averageOrder: 321.26,
    itemsSold: 127,
  };

  const transactions = [
    {
      id: "#ORD-001",
      time: "08:30 AM",
      customer: "Edison Malasan",
      items: 3,
      amount: 250.0,
    },
    {
      id: "#ORD-002",
      time: "09:15 AM",
      customer: "John Doe",
      items: 5,
      amount: 450.0,
    },
    {
      id: "#ORD-003",
      time: "10:00 AM",
      customer: "Jane Smith",
      items: 2,
      amount: 320.0,
    },
    {
      id: "#ORD-004",
      time: "10:30 AM",
      customer: "Mike Johnson",
      items: 1,
      amount: 75.0,
    },
    {
      id: "#ORD-005",
      time: "11:00 AM",
      customer: "Sarah Williams",
      items: 4,
      amount: 380.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{dailyStats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Today's revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{dailyStats.averageOrder.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.itemsSold}</div>
            <p className="text-xs text-muted-foreground">Total quantity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between pb-4 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.id}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.time} • {transaction.customer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₱{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.items} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Sales Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { hour: "08:00 - 09:00", sales: 1250.0, orders: 5 },
              { hour: "09:00 - 10:00", sales: 2840.0, orders: 8 },
              { hour: "10:00 - 11:00", sales: 3560.0, orders: 12 },
              { hour: "11:00 - 12:00", sales: 4120.0, orders: 15 },
              { hour: "12:00 - 13:00", sales: 3650.5, orders: 8 },
            ].map((item) => (
              <div
                key={item.hour}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{item.hour}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {item.orders} orders
                  </span>
                  <span className="font-medium">₱{item.sales.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
