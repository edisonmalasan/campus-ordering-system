import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  X,
  StickyNote,
  Loader2,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as customerApi from "@/lib/api/customer";
import { useIsMobile } from "@/hooks/use-mobile";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  });
  const [shopName, setShopName] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [fulfillmentOption, setFulfillmentOption] = useState<
    "delivery" | "pickup"
  >("delivery");
  const [address, setAddress] = useState("Dormitory 1, Room 305");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");

  const [showQrModal, setShowQrModal] = useState(false);
  const [gcashQrUrl, setGcashQrUrl] = useState("");

  useEffect(() => {
    fetchCheckoutDetails();
  }, []);

  useEffect(() => {
    if (fulfillmentOption === "pickup") {
      setTotals((prev) => ({
        ...prev,
        total: prev.subtotal,
      }));
    } else {
      fetchCheckoutDetails();
    }
  }, [fulfillmentOption]);

  const fetchCheckoutDetails = async () => {
    try {
      const selectedItemIds = location.state?.selectedItems || [];
      const response = await customerApi.getCheckout(selectedItemIds);
      const data = response.data;

      if (
        !data ||
        !data.cart ||
        !data.cart.items ||
        data.cart.items.length === 0
      ) {
        setCheckoutItems([]);
        return;
      }

      const items = data.cart.items.map((item: any) => ({
        id: item._id,
        name: item.product_id.items_name || item.product_id.name,
        price: item.product_id.items_price || item.product_id.price,
        quantity: item.quantity,
        image_url: item.product_id.photo_url || item.product_id.image_url,
      }));

      setCheckoutItems(items);
      setShopName(data.shop?.shop_name || "Store");
      setGcashQrUrl(data.shop?.gcash_qr_url || "");

      const deliveryFee =
        fulfillmentOption === "pickup" ? 0 : data.delivery_fee || 0;

      setTotals({
        subtotal: data.subtotal || 0,
        deliveryFee: deliveryFee,
        total: (data.subtotal || 0) + deliveryFee,
      });
    } catch (error: any) {
      console.error("Error fetching checkout:", error);
      toast.error("Failed to load checkout details");
      navigate("/customer/cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "gcash" && !referenceNumber) {
      toast.error("Please enter GCash reference number");
      return;
    }

    if (fulfillmentOption === "delivery" && !address.trim()) {
      toast.error("Delivery address is required for delivery orders.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const orderPayload = {
        shop_id: checkoutItems[0]?.id,
        delivery_address:
          fulfillmentOption === "pickup" ? "Pickup at Store" : address,
        payment_method: paymentMethod,
        fulfillment_option: fulfillmentOption,
        notes: note,
        gcash_reference:
          paymentMethod === "gcash" ? referenceNumber : undefined,
        selected_items: location.state?.selectedItems,
      };

      const response = await customerApi.placeOrder(orderPayload as any);

      toast.success("Order placed successfully!");
      navigate(`/customer/cart/order-placed`, {
        state: {
          orderId: response.data._id,
        },
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? "pb-24" : "pb-12"}`}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/customer/cart")}
              className="hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Checkout</h1>
              <span className="text-xs text-green-600 font-medium">
                {shopName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <Package className="h-4 w-4" /> Fulfillment Option
            </h2>
            <RadioGroup
              value={fulfillmentOption}
              onValueChange={(val: "delivery" | "pickup") =>
                setFulfillmentOption(val)
              }
              className="grid grid-cols-2 gap-4"
            >
              <div
                onClick={() => setFulfillmentOption("delivery")}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  fulfillmentOption === "delivery"
                    ? "border-green-600 bg-green-50/50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <Truck
                  className={`h-6 w-6 ${
                    fulfillmentOption === "delivery"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    fulfillmentOption === "delivery"
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  Delivery
                </span>
                <RadioGroupItem
                  value="delivery"
                  id="delivery"
                  className="sr-only"
                />
              </div>
              <div
                onClick={() => setFulfillmentOption("pickup")}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  fulfillmentOption === "pickup"
                    ? "border-green-600 bg-green-50/50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <Package
                  className={`h-6 w-6 ${
                    fulfillmentOption === "pickup"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    fulfillmentOption === "pickup"
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  Pickup
                </span>
                <RadioGroupItem
                  value="pickup"
                  id="pickup"
                  className="sr-only"
                />
              </div>
            </RadioGroup>
          </div>

          {fulfillmentOption === "delivery" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Delivery Address
                </h2>
              </div>
              <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 font-medium text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter delivery address..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment Method
            </h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val: "cash" | "gcash") => setPaymentMethod(val)}
              className="space-y-3"
            >
              <div
                className={`flex items-center space-x-3 border p-3 rounded-lg transition-colors ${
                  paymentMethod === "cash"
                    ? "border-green-600 bg-green-50/30"
                    : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value="cash"
                  id="cash"
                  className="text-green-600"
                  onChange={() => setPaymentMethod("cash")}
                />
                <Label
                  htmlFor="cash"
                  className="flex-1 cursor-pointer"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <span className="font-bold block text-gray-900">Cash</span>
                  <span className="text-sm text-gray-500">
                    Pay when you receive current order
                  </span>
                </Label>
              </div>
              <div
                className={`flex items-center space-x-3 border p-3 rounded-lg transition-colors ${
                  paymentMethod === "gcash"
                    ? "border-green-600 bg-green-50/30"
                    : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value="gcash"
                  id="gcash"
                  className="text-green-600"
                  onChange={() => setPaymentMethod("gcash")}
                />
                <Label
                  htmlFor="gcash"
                  className="flex-1 cursor-pointer"
                  onClick={() => setPaymentMethod("gcash")}
                >
                  <span className="font-bold block text-blue-700">GCash</span>
                  <span className="text-sm text-gray-500">
                    Pay via GCash wallet
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "gcash" && (
              <div className="pt-2 animate-in slide-in-from-top-2 space-y-3">
                {gcashQrUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowQrModal(true)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Scan/View GCash QR
                  </Button>
                )}
                <div>
                  <Label
                    htmlFor="reference"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Reference Number
                  </Label>
                  <Input
                    id="reference"
                    placeholder="Enter GCash reference number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <StickyNote className="h-4 w-4" /> Note to Store
            </h2>
            <Textarea
              placeholder="Add specific instructions (e.g., 'Ensure soup is hot', 'Less ice')"
              className="resize-none border-gray-200 focus:border-green-500 min-h-[100px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4 md:sticky md:top-20">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                    <div className="mt-1 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        ₱{item.price} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₱{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>
                  {fulfillmentOption === "pickup" ? (
                    <span className="text-green-600 font-medium">
                      Free (Pickup)
                    </span>
                  ) : (
                    `₱${totals.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-green-600">
                  ₱{totals.total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>
      </div>
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowQrModal(false)}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img
                  src="/gcash-logo.png"
                  alt="GCash"
                  className="h-8 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Scan to Pay</h3>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-2 bg-gray-50">
                <img
                  src={gcashQrUrl}
                  alt="Shop GCash QR"
                  className="w-full h-auto rounded-lg object-contain bg-white"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>1. Open GCash App</p>
                <p>2. Tap "QR" then "Scan QR"</p>
                <p>
                  3. Enter Amount:{" "}
                  <span className="font-bold text-gray-900">
                    ₱{totals.total.toFixed(2)}
                  </span>
                </p>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowQrModal(false)}
              >
                Done Scanning
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
