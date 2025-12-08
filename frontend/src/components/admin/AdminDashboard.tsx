import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconBuildingStore,
  IconUserCheck,
  IconShieldCheck,
} from "@tabler/icons-react";

export default function AdminDashboard() {
  // TODO: Replace with actual data from API
  const stats = {
    totalUsers: 150,
    totalCustomers: 120,
    totalShops: 25,
    pendingShops: 5,
    activeShops: 18,
    verifiedShops: 20,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-600">Overview of your campus ordering system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              All registered accounts
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <IconUserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Active customer accounts
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
            <IconBuildingStore className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalShops}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.verifiedShops} verified shops
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <IconShieldCheck className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingShops}</div>
            <p className="text-xs text-gray-500 mt-1">
              Shops awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shop Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Replace with actual data */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Emerson Canteen</p>
                  <p className="text-sm text-gray-500">Pending verification</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Campus Cafe</p>
                  <p className="text-sm text-gray-500">Pending verification</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Snack Bar</p>
                  <p className="text-sm text-gray-500">Verified</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New customer registered</p>
                  <p className="text-xs text-gray-500">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Shop verified: Campus Cafe
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New shop registration</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Customer account updated
                  </p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors">
              <IconShieldCheck className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Verify Shops</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors">
              <IconBuildingStore className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Manage Shops</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors">
              <IconUserCheck className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Manage Customers</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-colors">
              <IconUsers className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium">View All Users</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
