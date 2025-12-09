import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function ShopPendingVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.status === "verified") {
      navigate("/shop");
    }
  }, [user, navigate]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-8">
          {/* Animated Clock Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-8 shadow-2xl">
              <Clock
                className="h-24 w-24 text-green-600 animate-pulse"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Verification Pending
            </h1>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50">
              <p className="text-lg text-gray-700 mb-4">
                Thank you for registering{" "}
                <strong className="text-green-600">{user?.shop_name}</strong>!
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your shop is currently under review. Our admin team will verify
                your information within <strong>5-10 minutes</strong>.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleBackToLogin}
            variant="outline"
            className="w-full h-12 text-base font-medium hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>

          <p className="text-sm text-gray-500">
            Please check back shortly or try logging in again
          </p>
        </div>
      </div>
    </div>
  );
}
