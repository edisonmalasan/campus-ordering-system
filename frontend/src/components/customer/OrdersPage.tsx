import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  Package,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import * as customerApi from "@/lib/api/customer";

type OrderStatus = "ongoing" | "completed" | "cancelled";

export default function OrdersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<OrderStatus>("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<customerApi.Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await customerApi.getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const getStatusCategory = (status: string): OrderStatus => {
    const s = status?.toLowerCase().trim() || "";
    if (s === "completed" || s === "claimed" || s === "delivered") return "completed";
    if (s === "cancelled" || s === "rejected" || s === "declined" || s === "failed") return "cancelled";
    return "ongoing";
  };

  const filteredOrders = orders.filter(
    (order) =>
      getStatusCategory(order.order_status) === activeTab &&
      (order.shop_id.shop_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()))
  );



  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "ongoing":
        return "from-blue-500 to-blue-600";
      case "completed":
        return "from-green-500 to-green-600";
      case "cancelled":
        return "from-gray-400 to-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-green-600 transition-colors" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white shadow-sm"
          />
        </div>

        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl border-2 border-gray-200">
          {[
            { value: "ongoing", label: "Ongoing", icon: Clock },
            { value: "completed", label: "Completed", icon: CheckCircle },
            { value: "cancelled", label: "Cancelled", icon: XCircle },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value as OrderStatus)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all
                ${
                  activeTab === value
                    ? "bg-white text-gray-900 shadow-lg shadow-gray-200/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <Card
                key={order._id}
                className="group overflow-hidden border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/customer/orders/${order._id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <Badge
                          className={`bg-gradient-to-r ${getStatusColor(
                            getStatusCategory(order.order_status)
                          )} text-white border-0`}
                        >
                          {order.order_status ? order.order_status.replace(/_/g, " ").toUpperCase() : "PENDING"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {order.shop_id.shop_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>{order.items.length} item(s)</span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Payment Status
                      </span>
                      <span className={`text-sm font-semibold capitalize ${
                        (order.order_status === "cancelled" || order.order_status === "rejected" || order.order_status === "failed") 
                          ? "text-red-600" 
                          : order.payment_status === "paid" 
                            ? "text-green-600" 
                            : "text-amber-600"
                      }`}>
                        {(order.order_status === "cancelled" || order.order_status === "rejected" || order.order_status === "failed") 
                          ? "Failed" 
                          : order.payment_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₱{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab} orders
              </h3>
              <p className="text-sm text-gray-500">
                {activeTab === "ongoing"
                  ? "You don't have any ongoing orders"
                  : activeTab === "completed"
                  ? "No completed orders yet"
                  : "No cancelled orders"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
