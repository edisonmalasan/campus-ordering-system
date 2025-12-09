import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, PackageCheck, Truck, Loader2, ShoppingBag } from "lucide-react";
import * as shopApi from "@/lib/api/shop";

export default function OrdersList() {
  const [orders, setOrders] = useState<shopApi.Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await shopApi.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      await shopApi.acceptOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await shopApi.rejectOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await shopApi.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getOrdersByStatus = (statuses: string[]) => {
    return orders.filter((order) => statuses.includes(order.status));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
      accepted: { label: "Accepted", className: "bg-blue-100 text-blue-700" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      preparing: { label: "Preparing", className: "bg-orange-100 text-orange-700" },
      ready: { label: "Ready for Pickup", className: "bg-purple-100 text-purple-700" },
      completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const OrderCard = ({ order }: { order: shopApi.Order }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg">{order.order_number}</h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Customer: {order.customer_id.name}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Items: {order.items.length} item(s)
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg mb-3">₱{order.total_price.toFixed(2)}</p>
          <div className="flex flex-col gap-2">
            {order.status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAccept(order._id)}
                >
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(order._id)}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            )}
            {order.status === "accepted" && (
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleUpdateStatus(order._id, "preparing")}
              >
                Start Preparing
              </Button>
            )}
            {order.status === "preparing" && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleUpdateStatus(order._id, "ready")}
              >
                <PackageCheck className="h-4 w-4 mr-1" /> Mark Ready
              </Button>
            )}
            {order.status === "ready" && (
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleUpdateStatus(order._id, "completed")}
              >
                <Truck className="h-4 w-4 mr-1" /> Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-4 max-w-2xl">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="preparing">Preparing</TabsTrigger>
        <TabsTrigger value="ready">Ready</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4 mt-6">
        {getOrdersByStatus(["pending", "accepted"]).length > 0 ? (
          getOrdersByStatus(["pending", "accepted"]).map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No active orders</div>
        )}
      </TabsContent>

      <TabsContent value="preparing" className="space-y-4 mt-6">
        {getOrdersByStatus(["preparing"]).length > 0 ? (
          getOrdersByStatus(["preparing"]).map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No orders in preparation</div>
        )}
      </TabsContent>

      <TabsContent value="ready" className="space-y-4 mt-6">
        {getOrdersByStatus(["ready"]).length > 0 ? (
          getOrdersByStatus(["ready"]).map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No orders ready</div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4 mt-6">
        {getOrdersByStatus(["completed", "cancelled"]).length > 0 ? (
          getOrdersByStatus(["completed", "cancelled"]).map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No completed orders</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
