import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconEdit,
  IconLock,
  IconLockOpen,
  IconUserCheck,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Customer {
  id: string;
  name: string;
  email: string;
  contact_number?: string;
  student_id?: string;
  department?: string;
  gender?: string;
  status: "active" | "inactive";
}

export default function ManageCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    customer: Customer | null;
  }>({ open: false, customer: null });
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    customer: Customer | null;
  }>({ open: false, customer: null });

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Alice Brown",
      email: "alice@samcis.com",
      contact_number: "+63 945 678 9012",
      student_id: "2021-00123",
      department: "BSCS",
      gender: "female",
      status: "active",
    },
    {
      id: "2",
      name: "Charlie Davis",
      email: "charlie@samcis.com",
      contact_number: "+63 956 789 0123",
      student_id: "2021-00456",
      department: "BSIT",
      gender: "male",
      status: "active",
    },
  ]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (customer: Customer) => {
    if (statusDialog.customer) {
      const newStatus =
        statusDialog.customer.status === "active" ? "inactive" : "active";
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === statusDialog.customer!.id ? { ...c, status: newStatus } : c
        )
      );
    }
    setStatusDialog({ open: false, customer: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manage Customers</h2>
        <p className="text-gray-600">View and manage all customer accounts</p>
      </div>

      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search customers by name, email, or student ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    <IconUserCheck className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {customer.email}
                    </TableCell>
                    <TableCell>{customer.student_id || "-"}</TableCell>
                    <TableCell>{customer.department || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          customer.status === "active"
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : "bg-gray-50 text-gray-700 border-gray-300"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditDialog({ open: true, customer })
                          }
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({ open: true, customer })
                          }
                          className={
                            customer.status === "inactive"
                              ? "text-green-600"
                              : "text-gray-600"
                          }
                        >
                          {customer.status === "active" ? (
                            <IconLock className="h-4 w-4" />
                          ) : (
                            <IconLockOpen className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, customer: null })}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
            <DialogDescription>
              Update information for {editDialog.customer?.name}
            </DialogDescription>
          </DialogHeader>
          {editDialog.customer && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={editDialog.customer.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={editDialog.customer.email} />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input defaultValue={editDialog.customer.contact_number} />
              </div>
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input defaultValue={editDialog.customer.student_id} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input defaultValue={editDialog.customer.department} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select defaultValue={editDialog.customer.gender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, customer: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setEditDialog({ open: false, customer: null })}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ open, customer: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusDialog.customer?.status === "active"
                ? "Deactivate Customer"
                : "Activate Customer"}
            </DialogTitle>
            <DialogDescription>
              {statusDialog.customer?.status === "active"
                ? `Deactivating ${statusDialog.customer?.name} will prevent them from placing orders.`
                : `Activating ${statusDialog.customer?.name} will allow them to place orders.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialog({ open: false, customer: null })}
            >
              Cancel
            </Button>
            <Button onClick={() => handleToggleStatus(statusDialog.customer!)}>
              {statusDialog.customer?.status === "active"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
