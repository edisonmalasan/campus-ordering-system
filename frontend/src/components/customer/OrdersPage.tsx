import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <div className={`min-h-screen bg-white ${isMobile ? "pb-20 pt-4" : "p-6"}`}>
      {isMobile && (
        <div className="px-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="-ml-2 mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </div>
      )}

      {/* main content */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar border border-gray-200">
            {(["ongoing", "completed", "cancelled"] as OrderStatus[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[100px] py-2 text-sm font-bold rounded-lg transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by shop or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-gray-200 rounded-xl focus:ring-gray-200"
            />
          </div>
        </div>

        {/* list */}
        <div className="space-y-3 px-4 md:px-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-900">No {activeTab} orders</h3>
              {activeTab === "ongoing" && (
                <Button
                  variant="link"
                  className="text-green-600 font-bold"
                  onClick={() => navigate("/customer/foods")}
                >
                  Browse Foods
                </Button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                onClick={() => navigate(`/customer/orders/${order.id}`)}
              >
                <div className="flex gap-4 items-center">
                  {/* Store Image */}
                  <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={order.image}
                      alt={order.shopName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base truncate pr-2">
                        {order.shopName}
                      </h3>
                      <StatusBadge
                        status={order.status}
                        label={order.statusLabel}
                      />
                    </div>

                    <div className="text-xs text-gray-500 mb-2 truncate">
                      {order.items.join(", ")}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-900 text-sm">
                        ₱ {order.total}
                      </p>
                      <p className="text-[10px] text-gray-400">{order.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  const styles = {
    ongoing: "bg-blue-50 text-blue-700 border-blue-100",
    completed: "bg-green-50 text-green-700 border-green-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide border ${styles[status]}`}
    >
      {label}
    </span>
  );
}
