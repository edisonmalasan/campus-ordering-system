import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconX,
  IconEye,
  IconClock,
  IconMail,
  IconPhone,
  IconFileText,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Shop {
  id: string;
  shop_name: string;
  name: string;
  email: string;
  contact_number: string;
  business_permit_code: string;
  delivery_fee: number;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

export default function ShopVerification() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "verify" | "reject" | null;
    shop: Shop | null;
  }>({ open: false, action: null, shop: null });

  // TODO: Replace with actual data from API
  const pendingShops: Shop[] = [
    {
      id: "1",
      shop_name: "Emerson Canteen",
      name: "John Doe",
      email: "john@emerson.com",
      contact_number: "+63 912 345 6789",
      business_permit_code: "BP-2024-001",
      delivery_fee: 20,
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      shop_name: "Campus Cafe",
      name: "Jane Smith",
      email: "jane@campus.com",
      contact_number: "+63 923 456 7890",
      business_permit_code: "BP-2024-002",
      delivery_fee: 15,
      status: "pending",
      createdAt: "2024-01-16T14:20:00Z",
    },
  ];

  const handleViewDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setShowDetailsDialog(true);
  };

  const handleVerifyClick = (shop: Shop) => {
    setActionDialog({ open: true, action: "verify", shop });
  };

  const handleRejectClick = (shop: Shop) => {
    setActionDialog({ open: true, action: "reject", shop });
  };

  const handleConfirmAction = () => {
    // TODO: Implement API call to verify/reject shop
    console.log(`${actionDialog.action} shop:`, actionDialog.shop);
    setActionDialog({ open: false, action: null, shop: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Pending Shop Verification
        </h2>
        <p className="text-gray-600">
          Review and verify new shop registrations
        </p>
      </div>

      {pendingShops.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <IconCheck className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-gray-600">
                No pending shop verifications at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingShops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{shop.shop_name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Owner: {shop.name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-300"
                  >
                    <IconClock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <IconMail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{shop.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconPhone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{shop.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconFileText className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Permit: {shop.business_permit_code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Delivery Fee:</span>
                    <span className="font-semibold text-gray-700">
                      ₱{shop.delivery_fee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(shop)}
                    className="flex-1"
                  >
                    <IconEye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleVerifyClick(shop)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <IconCheck className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectClick(shop)}
                    className="flex-1"
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Shop Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedShop?.shop_name}
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Shop Name
                  </label>
                  <p className="text-base mt-1">{selectedShop.shop_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Owner Name
                  </label>
                  <p className="text-base mt-1">{selectedShop.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-base mt-1">{selectedShop.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <p className="text-base mt-1">
                    {selectedShop.contact_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Business Permit Code
                  </label>
                  <p className="text-base mt-1">
                    {selectedShop.business_permit_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Delivery Fee
                  </label>
                  <p className="text-base mt-1">
                    ₱{selectedShop.delivery_fee.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-base mt-1">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700"
                    >
                      {selectedShop.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Registered Date
                  </label>
                  <p className="text-base mt-1">
                    {new Date(selectedShop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          setActionDialog({ open, action: null, shop: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "verify" ? "Verify Shop" : "Reject Shop"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "verify"
                ? `Are you sure you want to verify "${actionDialog.shop?.shop_name}"? This will allow them to start selling on the platform.`
                : `Are you sure you want to reject "${actionDialog.shop?.shop_name}"? They will be notified of this decision.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({ open: false, action: null, shop: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={
                actionDialog.action === "verify"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
              variant={
                actionDialog.action === "reject" ? "destructive" : "default"
              }
            >
              {actionDialog.action === "verify" ? "Verify Shop" : "Reject Shop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
