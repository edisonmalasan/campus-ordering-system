import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import * as adminApi from "@/lib/api/admin";
import { toast } from "sonner";

export default function ShopVerification() {
  const [pendingShops, setPendingShops] = useState<adminApi.Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPendingShops();
      if (response.success) {
        setPendingShops(response.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to fetch pending shops"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const handleApprove = async (shopId: string) => {
    try {
      setProcessingId(shopId);
      const response = await adminApi.approveShop(shopId);
      if (response.success) {
        toast.success("Shop approved successfully!");
        setPendingShops(pendingShops.filter((shop) => shop._id !== shopId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to approve shop");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (shopId: string) => {
    try {
      setProcessingId(shopId);
      const response = await adminApi.rejectShop(shopId);
      if (response.success) {
        toast.success("Shop rejected successfully!");
        setPendingShops(pendingShops.filter((shop) => shop._id !== shopId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reject shop");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Clock className="h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading pending shops...</p>
        </div>
      </div>
    );
  }

  if (pendingShops.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-500">
            No shops pending verification at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Verification
          </h2>
          <p className="text-gray-500">
            {pendingShops.length} shop(s) waiting for approval
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {pendingShops.map((shop) => (
          <Card key={shop._id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                    {shop.profile_photo_url ? (
                      <img
                        src={shop.profile_photo_url}
                        alt={shop.shop_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{shop.shop_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                      <span className="text-xs text-gray-500">
                        Registered{" "}
                        {new Date(shop.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{shop.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-medium text-gray-900">
                      {shop.contact_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Business Permit</p>
                    <p className="font-medium text-gray-900">
                      {shop.business_permit_code || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center justify-center h-5 w-5 text-gray-400 font-bold text-lg">
                    ₱
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Delivery Fee</p>
                    <p className="font-medium text-gray-900">
                      ₱{shop.delivery_fee?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(shop._id)}
                  disabled={processingId === shop._id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {processingId === shop._id ? "Processing..." : "Approve Shop"}
                </Button>
                <Button
                  onClick={() => handleReject(shop._id)}
                  disabled={processingId === shop._id}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {processingId === shop._id ? "Processing..." : "Reject Shop"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
