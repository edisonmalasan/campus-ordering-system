import { useState, useEffect } from "react";
import { Store, Users, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as adminApi from "@/lib/api/admin";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState<adminApi.DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  const statCards = [
    {
      title: "Total Shops",
      value: stats?.totalShops || 0,
      icon: Store,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Verified Shops",
      value: stats?.verifiedShops || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: stats?.pendingShops || 0,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 text-${stat.color.replace('bg-', '')}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stats && stats.pendingShops > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <Clock className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">
              You have <strong>{stats.pendingShops}</strong> shop(s) waiting for verification.
              Please review them in the "Pending Verification" section.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
