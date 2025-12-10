import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShoppingBag,
  CreditCard,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import * as customerApi from "@/lib/api/customer";
import { toast } from "sonner";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [order, setOrder] = useState<customerApi.Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await customerApi.getOrderDetails(id!);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      navigate("/customer/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setIsActionLoading(true);
      await customerApi.cancelOrder(order._id);
      toast.success("Order cancelled successfully");
      fetchOrderDetails();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.error || "Failed to cancel order");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClaimOrder = async () => {
    if (!order) return;
    try {
      setIsActionLoading(true);
      await customerApi.claimOrder(order._id);
      toast.success("Order claimed successfully!");
      fetchOrderDetails();
    } catch (error: any) {
      console.error("Error claiming order:", error);
      toast.error(error.response?.data?.error || "Failed to claim order");
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "preparing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "ready_for_pickup":
      case "on_delivery":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      case "completed":
      case "claimed":
      case "delivered":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!order) return null;

  const canCancel = order.order_status === "pending";
  const canClaim = ["ready_for_pickup", "delivered"].includes(
    order.order_status
  );

  return (
    <div className={`min-h-screen bg-white ${isMobile ? "pb-24" : "pb-12"}`}>
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customer/orders")}
            className="hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg leading-none">Order Details</h1>
            <p className="text-xs text-muted-foreground mt-1">
              View your order information below
            </p>
          </div>
          <div className="ml-auto">
            <Badge className={getStatusColor(order.order_status || "pending")}>
              {order.order_status
                ? order.order_status.replace(/_/g, " ").toUpperCase()
                : "PENDING"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-4 flex items-start gap-4">
            <div
              className={`p-2 rounded-full ${
                order.order_status === "cancelled" ||
                order.order_status === "rejected"
                  ? "bg-red-100"
                  : "bg-green-100"
              }`}
            >
              <Clock
                className={`h-5 w-5 ${
                  order.order_status === "cancelled" ||
                  order.order_status === "rejected"
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              />
            </div>
            <div>
              <p
                className={`font-medium ${
                  order.order_status === "cancelled" ||
                  order.order_status === "rejected"
                    ? "text-red-700"
                    : "text-green-900"
                }`}
              >
                {order.order_status === "cancelled" ||
                order.order_status === "rejected"
                  ? "Order Cancelled"
                  : order.order_status === "ready_for_pickup"
                  ? "Ready for Pickup"
                  : order.order_status === "on_the_way"
                  ? "On the Way"
                  : order.order_status === "delivered"
                  ? "Delivered"
                  : order.order_status === "claimed"
                  ? "Order Claimed"
                  : order.order_status === "preparing"
                  ? "Preparing"
                  : order.order_status === "accepted"
                  ? "Accepted"
                  : order.order_status === "pending"
                  ? "Order Pending"
                  : "Estimated Order Status"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  order.order_status === "cancelled" ||
                  order.order_status === "rejected"
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {order.order_status === "pending"
                  ? "Waiting for store to accept your order."
                  : order.order_status === "preparing"
                  ? "The store is preparing your food."
                  : order.order_status === "ready_for_pickup"
                  ? "Your order is ready! Please proceed to the counter."
                  : order.order_status === "completed"
                  ? "This order has been completed."
                  : order.order_status === "cancelled"
                  ? "This order was cancelled."
                  : "Order in progress."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 p-4 border rounded-xl bg-white shadow-sm">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {order.shop_id.profile_photo_url ? (
              <img
                src={order.shop_id.profile_photo_url}
                alt={order.shop_id.shop_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ShoppingBag className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {order.shop_id.shop_name}
            </h3>
            <p className="text-xs text-gray-500">Store</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-4 w-4" /> Order Items
          </h3>
          <div className="divide-y border rounded-xl overflow-hidden bg-white shadow-sm">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                    x{item.quantity}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {item.product_id.items_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₱{item.product_id.items_price.toFixed(2)} / item
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Order Summary</h3>
          <div className="bg-white border rounded-xl p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Method
              </span>
              <span className="font-medium capitalize">
                {order.payment_method === "gcash"
                  ? "GCash"
                  : "Cash on Delivery"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Status
              </span>
              <span
                className={`font-medium capitalize ${
                  order.payment_status === "paid"
                    ? "text-green-600"
                    : order.order_status === "cancelled" ||
                      order.order_status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.order_status === "cancelled" ||
                order.order_status === "rejected"
                  ? "Failed"
                  : order.payment_status}
              </span>
            </div>

            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Delivery Address
              </span>
              <span className="font-medium text-right max-w-[200px]">
                {order.delivery_address}
              </span>
            </div>

            {order.notes && (
              <div className="flex justify-between items-start text-sm bg-yellow-50 p-2 rounded">
                <span className="text-yellow-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Note/Instructions
                </span>
                <span className="font-medium text-right text-yellow-900 max-w-[200px]">
                  {order.notes}
                </span>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₱{(order.total_amount - order.delivery_fee).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  ₱{order.delivery_fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total Amount</span>
                <span className="text-green-600">
                  ₱{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          {canClaim && (
            <Button
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 font-bold"
              onClick={handleClaimOrder}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "I Have Received My Order"
              )}
            </Button>
          )}

          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full h-12 text-lg font-bold"
                  disabled={isActionLoading}
                >
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelOrder}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => navigate("/customer/orders")}
          >
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
