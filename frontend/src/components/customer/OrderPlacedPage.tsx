import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Clock, MapPin, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import * as customerApi from "@/lib/api/customer";
import { toast } from "sonner";

export default function OrderPlacedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { orderId } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<customerApi.Order | null>(null);

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found");
      navigate("/customer/foods");
      return;
    }
    fetchOrderDetails();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await customerApi.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order confirmation");
    } finally {
      setIsLoading(false);
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

  return (
    <div className={`h-full bg-white ${isMobile ? "p-4" : "p-8"}`}>
      {!isMobile && (
        <div className="max-w-6xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-1">
            Thank you for your purchase from{" "}
            <span className="font-semibold text-green-600">
              {order.shop_id.shop_name}
            </span>
            .
          </p>
        </div>
      )}

      <div
        className={`max-w-6xl mx-auto ${
          !isMobile && "grid grid-cols-1 md:grid-cols-3 gap-12"
        }`}
      >
        <div className={`space-y-8 ${!isMobile && "md:col-span-2"}`}>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <Check className="h-8 w-8 text-green-600 stroke-[4]" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                We've received your order!
              </h2>
              <p className="text-gray-600 max-w-md">
                Your order is being processed by the store. You will receive a
                notification once it's on the way to{" "}
                <strong>{order.delivery_address}</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4" /> Estimated Time
              </p>
              <p className="text-2xl font-bold text-gray-900">5 - 10 mins</p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="capitalize font-medium text-green-600">
                  {order.order_status
                    ? order.order_status.replace(/_/g, " ")
                    : "Pending"}
                </span>
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Delivered To
              </p>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {order.delivery_address}
              </p>
              <p className="text-sm text-gray-500">Saint Louis University</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/customer/orders")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Track My Order
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-xl text-lg font-bold border-gray-200 hover:bg-gray-50 text-gray-600"
              onClick={() => navigate("/customer/foods")}
            >
              Back to Home
            </Button>
          </div>
        </div>

        <div className={`space-y-6 ${!isMobile && "md:col-span-1"}`}>
          <div
            className={`p-6 rounded-2xl border border-gray-100 shadow-sm bg-white ${
              !isMobile ? "sticky top-10" : "bg-gray-50 mt-8"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">Order Receipt</h3>
              <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                #{order._id.slice(-6).toUpperCase()}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    x{item.quantity} {item.product_id?.items_name || "Item"}
                  </span>
                  <span className="font-medium">
                    ₱ {(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.payment_method === "gcash" ? "GCash" : "COD"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  ₱ {order.delivery_fee}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-5 border-t border-dashed mt-2">
                <span>Total Paid</span>
                <span className="text-green-600 text-xl">
                  ₱ {order.total_amount.toFixed(0)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 text-center leading-relaxed">
                Order ID:{" "}
                <span className="font-mono text-gray-700">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
