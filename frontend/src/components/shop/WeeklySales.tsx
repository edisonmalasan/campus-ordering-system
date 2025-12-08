import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react";

export default function WeeklySales() {
  const weekRange = "Dec 1 - Dec 7, 2024";

  const weeklyStats = {
    totalSales: 87435.5,
    totalOrders: 234,
    averageDaily: 12490.79,
    growth: 15.3,
  };

  const dailyBreakdown = [
    { day: "Monday", date: "Dec 1", sales: 12340.0, orders: 35 },
    { day: "Tuesday", date: "Dec 2", sales: 10890.5, orders: 28 },
    { day: "Wednesday", date: "Dec 3", sales: 13450.0, orders: 38 },
    { day: "Thursday", date: "Dec 4", sales: 11230.0, orders: 31 },
    { day: "Friday", date: "Dec 5", sales: 15420.5, orders: 48 },
    { day: "Saturday", date: "Dec 6", sales: 14560.0, orders: 42 },
    { day: "Sunday", date: "Dec 7", sales: 9544.5, orders: 12 },
  ];

  const topProducts = [
    { name: "Chicken Adobo Rice", sold: 156, revenue: 11700.0 },
    { name: "Pancit Canton", sold: 98, revenue: 5880.0 },
    { name: "Lumpia Shanghai", sold: 87, revenue: 3915.0 },
    { name: "Halo-Halo", sold: 76, revenue: 4180.0 },
    { name: "Iced Coffee", sold: 143, revenue: 5720.0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-500">{weekRange}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{weeklyStats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This week's revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{weeklyStats.averageDaily.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{weeklyStats.growth}%
            </div>
            <p className="text-xs text-muted-foreground">vs last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyBreakdown.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between pb-4 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{day.day}</p>
                  <p className="text-sm text-gray-500">{day.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{day.sales.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{day.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
                <p className="font-medium">₱{product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
