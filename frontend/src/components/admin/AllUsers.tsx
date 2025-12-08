import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconSearch, IconUsers } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "shop" | "admin";
  status: "active" | "inactive" | "pending" | "verified" | "rejected";
  contact_number?: string;
}

export default function AllUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with actual data from API
  const users: User[] = [
    { id: "1", name: "Alice Brown", email: "alice@samcis.com", role: "customer", status: "active", contact_number: "+63 945 678 9012" },
    { id: "2", name: "Charlie Davis", email: "charlie@samcis.com", role: "customer", status: "active", contact_number: "+63 956 789 0123" },
    { id: "3", name: "John Doe", email: "john@emerson.com", role: "shop", status: "verified", contact_number: "+63 912 345 6789" },
    { id: "4", name: "Jane Smith", email: "jane@campus.com", role: "shop", status: "verified", contact_number: "+63 923 456 7890" },
    { id: "5", name: "Admin User", email: "admin@navibites.com", role: "admin", status: "active", contact_number: "+63 900 000 0000" },
  ];

  const filterUsers = (role?: string) => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !role || user.role === role;
      return matchesSearch && matchesRole;
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "customer":
        return "bg-green-50 text-green-700 border-green-300";
      case "shop":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
      case "verified":
        return "bg-green-50 text-green-700 border-green-300";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "inactive":
      case "rejected":
        return "bg-gray-50 text-gray-700 border-gray-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const UserTable = ({ users }: { users: User[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
              <IconUsers className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
              <TableCell className="text-sm">{user.contact_number || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeClass(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeClass(user.status)}>
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Users</h2>
        <p className="text-gray-600">View all registered users in the system</p>
      </div>

      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="customers">Customers ({users.filter(u => u.role === "customer").length})</TabsTrigger>
          <TabsTrigger value="shops">Shops ({users.filter(u => u.role === "shop").length})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({users.filter(u => u.role === "admin").length})</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <TabsContent value="all" className="m-0">
              <UserTable users={filterUsers()} />
            </TabsContent>
            <TabsContent value="customers" className="m-0">
              <UserTable users={filterUsers("customer")} />
            </TabsContent>
            <TabsContent value="shops" className="m-0">
              <UserTable users={filterUsers("shop")} />
            </TabsContent>
            <TabsContent value="admins" className="m-0">
              <UserTable users={filterUsers("admin")} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
