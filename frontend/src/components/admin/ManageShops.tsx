import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconLock,
  IconLockOpen,
  IconBuildingStore,
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

interface Shop {
  id: string;
  shop_name: string;
  name: string;
  email: string;
  contact_number: string;
  status: string;
  accountStatus: "active" | "inactive";
  delivery_fee: number;
}

export default function ManageShops() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    shop: Shop | null;
  }>({
    open: false,
    shop: null,
  });
  const [deactivateDialog, setDeactivateDialog] = useState<{
    open: boolean;
    shop: Shop | null;
  }>({ open: false, shop: null });

  // TODO: Replace with actual data from API
  const [shops, setShops] = useState<Shop[]>([
    {
      id: "1",
      shop_name: "Emerson Canteen",
      name: "John Doe",
      email: "john@emerson.com",
      contact_number: "+63 912 345 6789",
      status: "verified",
      accountStatus: "active",
      delivery_fee: 20,
    },
    {
      id: "2",
      shop_name: "Campus Cafe",
      name: "Jane Smith",
      email: "jane@campus.com",
      contact_number: "+63 923 456 7890",
      status: "verified",
      accountStatus: "active",
      delivery_fee: 15,
    },
    {
      id: "3",
      shop_name: "Snack Bar",
      name: "Bob Johnson",
      email: "bob@snackbar.com",
      contact_number: "+63 934 567 8901",
      status: "verified",
      accountStatus: "inactive",
      delivery_fee: 10,
    },
  ]);

  const filteredShops = shops.filter(
    (shop) =>
      shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (shop: Shop) => {
    setEditDialog({ open: true, shop });
  };

  const handleToggleStatus = (shop: Shop) => {
    setDeactivateDialog({ open: true, shop });
  };

  const handleConfirmToggleStatus = () => {
    if (deactivateDialog.shop) {
      // TODO: Implement API call
      const newStatus =
        deactivateDialog.shop.accountStatus === "active"
          ? "inactive"
          : "active";
      setShops((prev) =>
        prev.map((s) =>
          s.id === deactivateDialog.shop!.id
            ? { ...s, accountStatus: newStatus }
            : s
        )
      );
    }
    setDeactivateDialog({ open: false, shop: null });
  };

  const handleSaveEdit = () => {
    // TODO: Implement API call to save changes
    console.log("Save edit:", editDialog.shop);
    setEditDialog({ open: false, shop: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Shops</h2>
          <p className="text-gray-600">View and manage all registered shops</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search shops by name, owner, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    <IconBuildingStore className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    No shops found
                  </TableCell>
                </TableRow>
              ) : (
                filteredShops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">
                      {shop.shop_name}
                    </TableCell>
                    <TableCell>{shop.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {shop.email}
                    </TableCell>
                    <TableCell className="text-sm">
                      {shop.contact_number}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          shop.status === "verified"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : shop.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-red-50 text-red-700 border-red-300"
                        }
                      >
                        {shop.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          shop.accountStatus === "active"
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : "bg-gray-50 text-gray-700 border-gray-300"
                        }
                      >
                        {shop.accountStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(shop)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(shop)}
                          className={
                            shop.accountStatus === "inactive"
                              ? "text-green-600 hover:text-green-700"
                              : "text-gray-600 hover:text-gray-700"
                          }
                        >
                          {shop.accountStatus === "active" ? (
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
        onOpenChange={(open) => setEditDialog({ open, shop: null })}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shop Details</DialogTitle>
            <DialogDescription>
              Update information for {editDialog.shop?.shop_name}
            </DialogDescription>
          </DialogHeader>
          {editDialog.shop && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shop_name">Shop Name</Label>
                  <Input
                    id="shop_name"
                    defaultValue={editDialog.shop.shop_name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_name">Owner Name</Label>
                  <Input id="owner_name" defaultValue={editDialog.shop.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={editDialog.shop.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    defaultValue={editDialog.shop.contact_number}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_fee">Delivery Fee</Label>
                  <Input
                    id="delivery_fee"
                    type="number"
                    defaultValue={editDialog.shop.delivery_fee}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Shop Status</Label>
                  <Select defaultValue={editDialog.shop.status}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, shop: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deactivateDialog.open}
        onOpenChange={(open) => setDeactivateDialog({ open, shop: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deactivateDialog.shop?.accountStatus === "active"
                ? "Deactivate Shop"
                : "Activate Shop"}
            </DialogTitle>
            <DialogDescription>
              {deactivateDialog.shop?.accountStatus === "active"
                ? `Are you sure you want to deactivate "${deactivateDialog.shop?.shop_name}"? They will not be able to receive orders.`
                : `Are you sure you want to activate "${deactivateDialog.shop?.shop_name}"? They will be able to receive orders.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateDialog({ open: false, shop: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmToggleStatus}>
              {deactivateDialog.shop?.accountStatus === "active"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
