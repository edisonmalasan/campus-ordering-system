import { useState, useEffect } from "react";
import {
  Check,
  X,
  Loader2,
  Search,
  AlertCircle,
  Eye,
  CreditCard,
} from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as shopApi from "@/lib/api/shop";
import { toast } from "sonner";

export default function OrdersList() {
  const [orders, setOrders] = useState<shopApi.Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<shopApi.Order | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await shopApi.getOrders();
      setOrders(response.data || []);
      if (selectedOrder) {
        const updatedSelected = response.data.find(
          (o: any) => o._id === selectedOrder._id
        );
        if (updatedSelected) setSelectedOrder(updatedSelected);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      await shopApi.acceptOrder(orderId);
      toast.success("Order accepted");
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order");
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await shopApi.rejectOrder(orderId);
      toast.success("Order rejected");
      fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("Failed to reject order");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await shopApi.updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status.replace(/_/g, " ")}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      await shopApi.updatePaymentStatus(orderId, "completed");
      toast.success("Payment verified");
      fetchOrders();
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment");
    }
  };

  const getFilteredOrders = (statuses: string[]) => {
    return orders.filter(
      (order) =>
        statuses.includes(order.order_status) &&
        (order.customer_id.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          order._id.toLowerCase().includes(searchQuery.toLowerCase())) // Search by ID instead
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
      accepted: {
        label: "Accepted",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
      preparing: {
        label: "Preparing",
        className: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      },
      on_the_way: {
        label: "On the Way",
        className: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      },
      delivered: {
        label: "Delivered",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      claimed: {
        label: "Claimed",
        className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
      ready_for_pickup: {
        label: "Ready for Pickup",
        className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      },
    };
    const config = statusConfig[status] || {
      label: status.replace(/_/g, " "),
      className: "bg-gray-100 text-gray-700",
    };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const OrderTable = ({ data }: { data: shopApi.Order[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono font-bold text-xs">
                  #{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.customer_id.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.delivery_address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{order.items.length} item(s)</TableCell>
                <TableCell className="font-bold">
                  ₱{order.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.payment_status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      order.payment_status === "completed"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {order.payment_method === "cod"
                      ? "Cash"
                      : order.payment_method}
                    {order.payment_status === "completed" ? " (Paid)" : ""}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                    {order.order_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 py-0"
                          onClick={() => handleAccept(order._id)}
                          title="Accept"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleReject(order._id)}
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {order.order_status === "accepted" && (
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() =>
                          handleUpdateStatus(order._id, "preparing")
                        }
                      >
                        Start Prep
                      </Button>
                    )}
                    {order.order_status === "preparing" &&
                      (order.fulfillment_option === "pickup" ? (
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={() =>
                            handleUpdateStatus(order._id, "ready_for_pickup")
                          }
                        >
                          Ready for Pickup
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() =>
                            handleUpdateStatus(order._id, "on_the_way")
                          }
                        >
                          On the Way
                        </Button>
                      ))}
                    {order.order_status === "ready_for_pickup" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleUpdateStatus(order._id, "claimed")}
                      >
                        Claimed
                      </Button>
                    )}
                    {order.order_status === "on_the_way" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() =>
                          handleUpdateStatus(order._id, "delivered")
                        }
                      >
                        Delivered
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage your store orders here.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="preparing">Prep</TabsTrigger>
          <TabsTrigger value="fulfillment">To Fulfill</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <OrderTable data={getFilteredOrders(["pending", "accepted"])} />
        </TabsContent>

        <TabsContent value="preparing" className="mt-4">
          <OrderTable data={getFilteredOrders(["preparing"])} />
        </TabsContent>

        <TabsContent value="fulfillment" className="mt-4">
          <OrderTable
            data={getFilteredOrders(["on_the_way", "ready_for_pickup"])}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {/* Include delivered, claimed, cancelled, rejected */}
          <OrderTable
            data={getFilteredOrders([
              "delivered",
              "claimed",
              "cancelled",
              "rejected",
            ])}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Customer
                  </h4>
                  <p className="font-medium">
                    {selectedOrder.customer_id.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.delivery_address}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Status
                  </h4>
                  {getStatusBadge(selectedOrder.order_status)}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-yellow-800">
                      Note from Customer:
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {selectedOrder.notes}
                    </p>
                  </div>
                </div>
              )}

              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 h-8 w-8 rounded flex items-center justify-center font-bold text-gray-600">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.product_id.items_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₱{item.product_id.items_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ₱{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex flex-col gap-2 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payment Status
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedOrder.payment_status === "completed"
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedOrder.payment_status === "completed"
                          ? "bg-green-600"
                          : ""
                      }
                    >
                      {selectedOrder.payment_status?.toUpperCase() || "PENDING"}
                    </Badge>
                    {selectedOrder.payment_status !== "completed" &&
                      selectedOrder.order_status !== "cancelled" &&
                      selectedOrder.order_status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 text-xs"
                          onClick={() => handleVerifyPayment(selectedOrder._id)}
                        >
                          Verify
                        </Button>
                      )}
                  </div>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    ₱
                    {(
                      selectedOrder.total_amount - selectedOrder.delivery_fee
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₱{selectedOrder.delivery_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-green-600">
                    ₱{selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
