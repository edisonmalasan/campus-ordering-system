import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, PackageCheck, Truck, Clock, ChefHat } from "lucide-react";

type OrderStatus =
  | "pending"
  | "accepted"
  | "cancelled"
  | "preparing"
  | "ready_for_pickup"
  | "on_the_way"
  | "delivered"
  | "claimed";
type PaymentMethod = "gcash" | "cash";
type PaymentStatus = "pending" | "completed" | "failed";

type Order = {
  id: string;
  customer: string;
  items: string;
  total: number;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  time: string;
  gcash_reference?: string;
};

export default function OrdersList() {
  const orders: Order[] = [
    {
      id: "#ORD-001",
      customer: "Edison Malasan",
      items: "Chicken Adobo Rice x2",
      total: 150.0,
      order_status: "pending",
      payment_method: "gcash",
      payment_status: "pending",
      time: "10:30 AM",
    },
    {
      id: "#ORD-002",
      customer: "John Doe",
      items: "Pancit Canton, Iced Coffee",
      total: 100.0,
      order_status: "accepted",
      payment_method: "cash",
      payment_status: "pending",
      time: "11:15 AM",
    },
    {
      id: "#ORD-003",
      customer: "Jane Smith",
      items: "Halo-Halo x3",
      total: 165.0,
      order_status: "preparing",
      payment_method: "gcash",
      payment_status: "completed",
      time: "11:45 AM",
      gcash_reference: "GC123456",
    },
    {
      id: "#ORD-004",
      customer: "Mike Johnson",
      items: "Lumpia Shanghai",
      total: 45.0,
      order_status: "ready_for_pickup",
      payment_method: "cash",
      payment_status: "pending",
      time: "12:00 PM",
    },
    {
      id: "#ORD-005",
      customer: "Sarah Williams",
      items: "Iced Coffee x2",
      total: 80.0,
      order_status: "on_the_way",
      payment_method: "cash",
      payment_status: "pending",
      time: "12:15 PM",
    },
    {
      id: "#ORD-006",
      customer: "Tom Brown",
      items: "Chicken Adobo",
      total: 75.0,
      order_status: "delivered",
      payment_method: "gcash",
      payment_status: "completed",
      time: "12:30 PM",
      gcash_reference: "GC789012",
    },
    {
      id: "#ORD-007",
      customer: "Lisa Green",
      items: "Pancit x3",
      total: 180.0,
      order_status: "claimed",
      payment_method: "cash",
      payment_status: "completed",
      time: "01:00 PM",
    },
  ];

  const getOrdersByStatus = (statuses: OrderStatus[]) => {
    return orders.filter((order) => statuses.includes(order.order_status));
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
      accepted: { label: "Accepted", className: "bg-blue-100 text-blue-700" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      preparing: {
        label: "Preparing",
        className: "bg-orange-100 text-orange-700",
      },
      ready_for_pickup: {
        label: "Ready for Pickup",
        className: "bg-purple-100 text-purple-700",
      },
      on_the_way: {
        label: "On the Way",
        className: "bg-indigo-100 text-indigo-700",
      },
      delivered: { label: "Delivered", className: "bg-teal-100 text-teal-700" },
      claimed: { label: "Claimed", className: "bg-green-100 text-green-700" },
    };
    const config = statusConfig[status];
    return (
      <Badge className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (method: PaymentMethod, status: PaymentStatus) => {
    const paymentColor =
      status === "completed"
        ? "text-green-600"
        : status === "failed"
        ? "text-red-600"
        : "text-gray-600";
    return (
      <div className="text-xs">
        <span className="font-medium">{method.toUpperCase()}</span>
        <span className={`ml-2 ${paymentColor}`}>({status})</span>
      </div>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg">{order.id}</h3>
            {getStatusBadge(order.order_status)}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Customer: {order.customer}
          </p>
          <p className="text-sm text-gray-600 mb-1">Items: {order.items}</p>
          <p className="text-sm text-gray-500 mb-2">Time: {order.time}</p>
          {getPaymentBadge(order.payment_method, order.payment_status)}
          {order.gcash_reference && (
            <p className="text-xs text-gray-500 mt-1">
              Ref: {order.gcash_reference}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-lg mb-3">₱{order.total.toFixed(2)}</p>
          <div className="flex flex-col gap-2">
            {order.order_status === "pending" && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button size="sm" variant="destructive">
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            )}
            {order.order_status === "accepted" && (
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <ChefHat className="h-4 w-4 mr-1" /> Start Preparing
              </Button>
            )}
            {order.order_status === "preparing" && (
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <PackageCheck className="h-4 w-4 mr-1" /> Mark Ready
              </Button>
            )}
            {order.order_status === "ready_for_pickup" && (
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Truck className="h-4 w-4 mr-1" /> Out for Delivery
              </Button>
            )}
            {order.order_status === "on_the_way" && (
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <PackageCheck className="h-4 w-4 mr-1" /> Mark Delivered
              </Button>
            )}
            {order.order_status === "delivered" &&
              order.payment_status !== "completed" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-1" /> Confirm Payment
                </Button>
              )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-4 max-w-2xl">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="preparing">Preparing</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4 mt-6">
        {getOrdersByStatus(["pending", "accepted"]).length > 0 ? (
          getOrdersByStatus(["pending", "accepted"]).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No active orders
          </div>
        )}
      </TabsContent>

      <TabsContent value="preparing" className="space-y-4 mt-6">
        {getOrdersByStatus(["preparing", "ready_for_pickup"]).length > 0 ? (
          getOrdersByStatus(["preparing", "ready_for_pickup"]).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No orders in preparation
          </div>
        )}
      </TabsContent>

      <TabsContent value="delivery" className="space-y-4 mt-6">
        {getOrdersByStatus(["on_the_way", "delivered"]).length > 0 ? (
          getOrdersByStatus(["on_the_way", "delivered"]).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No orders out for delivery
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4 mt-6">
        {getOrdersByStatus(["claimed", "cancelled"]).length > 0 ? (
          getOrdersByStatus(["claimed", "cancelled"]).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No completed orders
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
