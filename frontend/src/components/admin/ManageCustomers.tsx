import { useState, useEffect } from "react";
import { Users, Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as adminApi from "@/lib/api/admin";
import { toast } from "sonner";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState<adminApi.Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllCustomers();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Customers</h2>
        <p className="text-gray-500">{customers.length} total customers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{customer.name}</CardTitle>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Student ID</p>
                  <p className="font-medium">{customer.student_id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium">{customer.department || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{customer.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
}
