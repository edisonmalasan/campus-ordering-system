import { useLocation, useNavigate } from "react-router-dom";
import { X, Clock, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod, referenceNumber, total } = location.state || {
    paymentMethod: "COD",
    total: 0,
  };

  const handleConfirm = () => {
    // TODO: API CALL
    navigate("/customer/cart/order-placed", {
      state: { paymentMethod, total },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center relative">
      {/* Close Button acting as Cancel/Back */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Confirm Your Order
          </h1>
          <p className="text-muted-foreground text-sm">
            Your order would be delivered in the <br /> 30 mins atmost
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1 flex justify-between">
              <span className="text-gray-500 text-sm">Estimated time</span>
              <span className="font-medium text-sm">15 mins</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1 flex justify-between">
              <span className="text-gray-500 text-sm">Deliver to</span>
              <span className="font-medium text-sm">Room D425</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1 flex justify-between">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="font-medium text-sm">₱ {total?.toFixed(0)}</span>
            </div>
          </div>
          {paymentMethod === "GCash" && (
            <div className="pl-9 text-xs text-blue-600">
              Ref: {referenceNumber}
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl font-bold"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-gray-100 hover:bg-gray-200 h-12 rounded-xl font-bold text-gray-900"
            onClick={() => navigate("/customer/cart")}
          >
            Cancel Order
          </Button>
        </div>
      </div>
    </div>
  );
}
