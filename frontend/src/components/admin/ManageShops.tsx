import { useState, useEffect } from "react";
import { Store, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as adminApi from "@/lib/api/admin";
import { toast } from "sonner";

export default function ManageShops() {
  const [shops, setShops] = useState<adminApi.Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllShops();
      if (response.success) {
        setShops(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || shop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      verified: { variant: "default", label: "Verified" },
      pending: { variant: "secondary", label: "Pending" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Shops</h2>
        <p className="text-gray-500">{shops.length} total shops</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredShops.map((shop) => (
          <Card key={shop._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                    {shop.profile_photo_url ? (
                      <img 
                        src={shop.profile_photo_url} 
                        alt={shop.shop_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{shop.shop_name}</CardTitle>
                    <p className="text-sm text-gray-500">{shop.email}</p>
                  </div>
                </div>
                {getStatusBadge(shop.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Owner</p>
                  <p className="font-medium">{shop.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium">{shop.contact_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Delivery Fee</p>
                  <p className="font-medium">₱{shop.delivery_fee?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">{new Date(shop.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No shops found</p>
        </div>
      )}
    </div>
  );
}
