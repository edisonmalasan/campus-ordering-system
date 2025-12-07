import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, X, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  shopName: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Get items passed from Cart
  const checkoutItems = (location.state?.items as CartItem[]) || [];

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gcash">("cod");
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("Room D425 - SAMCIS");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState("");

  // Calculate totals dynamically based on passed items
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = checkoutItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  // Redirect if no items (e.g. direct access)
  useEffect(() => {
    if (checkoutItems.length === 0) {
      // navigate("/customer/cart"); // Commented out for dev/testing ease, but good practice
    }
  }, [checkoutItems, navigate]);

  const handleContinue = () => {
    if (paymentMethod === "gcash") {
      setShowGCashModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleOpenAddressModal = () => {
    setTempAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (tempAddress.trim()) {
      setAddress(tempAddress);
    }
    setShowAddressModal(false);
  };

  const handleGCashConfirm = () => {
    if (!referenceNumber.trim()) return;
    setShowGCashModal(false);
    setShowConfirmModal(true);
  };

  const handlePlaceOrder = () => {
    navigate("/customer/cart/order-placed", {
      state: {
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "GCash",
        total,
        address,
        items: checkoutItems, // Pass items to order placed if needed
      },
    });
  };

  return (
    <div className={`min-h-screen bg-white ${isMobile ? "pb-20 pt-4" : "p-8"}`}>
      {/* Header - Desktop Only Title */}
      {!isMobile && (
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Complete your order details
          </p>
        </div>
      )}

      {/* Mobile Header (Back Button) */}
      {isMobile && (
        <div className="px-4 mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="-ml-2 mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      )}

      <div
        className={`max-w-6xl mx-auto ${
          !isMobile && "grid grid-cols-1 md:grid-cols-3 gap-12"
        }`}
      >
        {/* Left Column: Form Details */}
        <div className={`space-y-8 ${!isMobile && "md:col-span-2"}`}>
          {/* Order Brief Summary (New Addition to see what we are buying) */}
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              Order Details
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              {checkoutItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₱ {(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              {checkoutItems.length === 0 && (
                <p className="text-gray-400 italic">No items selected</p>
              )}
            </div>
          </div>

          <Separator className={isMobile ? "mx-4 w-auto" : ""} />

          {/* Delivery Section */}
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" /> Delivery Address
            </h2>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between hover:border-green-200 transition-colors cursor-pointer group">
              <div>
                <p className="font-medium text-gray-900">{address}</p>
                <p className="text-sm text-gray-500">
                  Saint Louis University, Baguio City
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenAddressModal}
                className="text-green-600 font-bold hover:text-green-700 hover:bg-green-50"
              >
                CHANGE
              </Button>
            </div>
          </div>

          <Separator className={isMobile ? "mx-4 w-auto" : ""} />

          {/* Payment Section */}
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`cursor-pointer border rounded-xl p-4 flex items-start gap-4 transition-all ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50/30 ring-1 ring-green-600"
                    : "border-gray-200 hover:border-green-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="mt-1"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div>
                  <span className="font-bold block text-gray-900">
                    Cash on Delivery
                  </span>
                  <span className="text-sm text-gray-500">
                    Pay when you receive current order
                  </span>
                </div>
              </label>

              <label
                className={`cursor-pointer border rounded-xl p-4 flex items-start gap-4 transition-all ${
                  paymentMethod === "gcash"
                    ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="mt-1"
                  checked={paymentMethod === "gcash"}
                  onChange={() => setPaymentMethod("gcash")}
                />
                <div>
                  <span className="font-bold block text-blue-700">
                    GCash E-Wallet
                  </span>
                  <span className="text-sm text-gray-500">
                    Scan QR code to pay digitally
                  </span>
                </div>
              </label>
            </div>
          </div>

          <Separator className={isMobile ? "mx-4 w-auto" : ""} />

          {/* Note Section */}
          <div className="space-y-4 px-4 md:px-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-green-600" /> Note to
              Store/Rider
            </h2>
            <textarea
              className="w-full min-h-[100px] p-4 text-sm border border-gray-200 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all resize-none bg-white"
              placeholder="Any special requests? e.g. extra sauce, no plastic cutlery..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* summary card*/}
        <div className={`space-y-6 ${!isMobile && "md:col-span-1"}`}>
          <div
            className={`p-6 rounded-2xl border border-gray-100 shadow-sm bg-white ${
              !isMobile ? "sticky top-10" : "mx-4 mt-8 bg-gray-50"
            }`}
          >
            <h3 className="font-bold text-xl mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₱ {subtotal.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  ₱ {deliveryFee.toFixed(0)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                <span>Total to Pay</span>
                <span className="text-green-600 text-xl">
                  ₱ {total.toFixed(0)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 rounded-xl text-lg shadow-lg shadow-green-200 transition-all hover:translate-y-[-2px]"
              disabled={checkoutItems.length === 0}
            >
              {paymentMethod === "gcash"
                ? "Proceed to Payment"
                : "Place Order Now"}
            </Button>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Change Location
              </h2>
              <p className="text-gray-500 text-sm">
                Where should we deliver this?
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Room / Building / Landmark
              </label>
              <Input
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="e.g. Room D425, Main Library..."
                className="h-12 rounded-xl"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-gray-900 hover:bg-black h-12 rounded-xl font-bold"
                onClick={handleSaveAddress}
              >
                Update Location
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-900 h-10 rounded-xl"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* gc modal */}
      {showGCashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-[#007DFE] text-white">
              <h3 className="font-bold text-lg">Pay with GCash</h3>
              <button
                onClick={() => setShowGCashModal(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8 space-y-6 flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center p-2">
                  <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-bold text-blue-600">SCAN QR CODE</p>
                </div>
              </div>

              <div className="w-full space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Reference Number
                </label>
                <Input
                  placeholder="000 000 000 000"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="text-center font-mono text-xl h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  maxLength={13}
                />
              </div>

              <Button
                className="w-full bg-[#007DFE] hover:bg-blue-600 h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-200"
                onClick={handleGCashConfirm}
                disabled={!referenceNumber.trim()}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* confirm order modal*/}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Confirm Order
              </h2>
              <p className="text-gray-500">Please review your order details</p>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deliver to</span>
                <span className="font-bold text-gray-900 text-right">
                  {address}
                </span>
              </div>
              {note && (
                <div className="flex justify-between text-sm items-start gap-4">
                  <span className="text-gray-500">Note</span>
                  <span className="font-medium text-gray-900 text-right text-xs italic bg-white p-1 rounded border overflow-hidden text-ellipsis line-clamp-2">
                    {note}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-bold text-gray-900 text-right uppercase">
                  {paymentMethod}
                </span>
              </div>
              {paymentMethod === "gcash" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ref No.</span>
                  <span className="font-mono font-bold text-blue-600 text-right text-xs bg-blue-50 px-2 py-0.5 rounded">
                    {referenceNumber}
                  </span>
                </div>
              )}

              {/* Items Summary in Confirmation */}
              <Separator className="bg-gray-200" />
              <div className="py-2 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Items
                </p>
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₱ {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-200" />
              <div className="flex justify-between items-end pt-2">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₱ {total.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-gray-900 hover:bg-black h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 rounded-xl"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
