import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

type OrderStatus = "ongoing" | "completed" | "cancelled";

interface Order {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  shopName: string;
  total: number;
  items: string[];
  date: string;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: "8X29D",
    status: "ongoing",
    statusLabel: "On the way",
    shopName: "2nd Floor - 180 Main",
    total: 225,
    items: ["1x Sisig with Rice", "1x Fried Chicken", "1x Mountain Dew"],
    date: "Today, 10:30 AM",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "7B12A",
    status: "completed",
    statusLabel: "Delivered",
    shopName: "Cafeteria - Main Hall",
    total: 150,
    items: ["1x Spaghetti", "1x Iced Tea"],
    date: "Yesterday, 1:15 PM",
    image:
      "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3X99C",
    status: "cancelled",
    statusLabel: "Cancelled",
    shopName: "Snack Bar",
    total: 85,
    items: ["1x Burger", "1x Fries"],
    date: "Dec 05, 11:00 AM",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<OrderStatus>("ongoing");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.status === activeTab &&
      (order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "ongoing":
        return <Clock className="h-5 w-5" />;
      case "completed":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
    }
  };

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

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-green-600 transition-colors" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white shadow-sm"
          />
        </div>

        {/* Modern Tabs */}
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
                ${activeTab === value
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <Card
                key={order.id}
                className="group overflow-hidden border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/customer/orders/${order.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Order Image */}
                    <div className="relative sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={order.image}
                        alt="Order"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              Order #{order.id}
                            </h3>
                            <Badge
                              className={`bg-gradient-to-r ${getStatusColor(order.status)} text-white border-0`}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.statusLabel}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {order.shopName}
                          </p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Items */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {order.items.join(", ")}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Amount</span>
                          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ₱{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
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
