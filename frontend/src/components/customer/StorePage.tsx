import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Store, MapPin, Loader2, Clock } from "lucide-react";
import * as customerApi from "@/lib/api/customer";

export default function StorePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [shops, setShops] = useState<customerApi.Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await customerApi.getShops();
        setShops(response.data || []);
      } catch (err: any) {
        console.error("Error fetching shops:", err);
        setError(err.response?.data?.error || "Failed to load shops");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const getShopStatus = (shop: customerApi.Shop) => {
    if (shop.isTemporarilyClosed)
      return { status: "Temporarily Closed", color: "gray" };

    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = shop.operating_hours?.find((h) => h.day === currentDay);

    if (!todayHours || todayHours.isClosed) {
      return { status: "Closed", color: "red" };
    }

    if (!todayHours.open || !todayHours.close) {
      return { status: "Closed", color: "red" };
    }

    const [openHour, openMinute] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    if (currentTime >= openTime && currentTime < closeTime) {
      return { status: "Open Now", color: "green" };
    } else {
      return { status: "Closed", color: "red" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Shops</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  All Shops
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Discover amazing food from campus vendors
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-20">
            <Store className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Shops Available
            </h3>
            <p className="text-gray-600 mb-6">
              There are no shops registered yet. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All Shops
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Discover amazing food from campus vendors ({shops.length}{" "}
                {shops.length === 1 ? "shop" : "shops"})
              </p>
            </div>
          </div>
        </div>

        <div
          className={` grid gap-4 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {shops.map((shop, index) => {
            const statusParams = getShopStatus(shop);

            return (
              <div
                key={shop._id}
                onClick={() => navigate(`/customer/store/${shop._id}`)}
                className="cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full overflow-hidden border-2 border-gray-100 hover:border-green-500 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 p-6 border-b-2 border-gray-100">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white rounded-xl blur-sm"></div>
                            <div className="relative bg-white p-3 rounded-xl shadow-lg ring-2 ring-green-500/20">
                              {shop.profile_photo_url ? (
                                <img
                                  src={shop.profile_photo_url}
                                  alt={shop.shop_name}
                                  className="w-16 h-16 object-contain"
                                />
                              ) : (
                                <Store className="w-16 h-16 text-green-600" />
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                              {shop.shop_name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>Campus Location</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                          ₱{shop.delivery_fee.toFixed(2)} delivery
                        </Badge>

                        <Badge
                          variant="outline"
                          className={`ml-0 
                               ${
                                 statusParams.color === "green"
                                   ? "bg-green-50 text-green-700 border-green-300"
                                   : statusParams.color === "red"
                                   ? "bg-red-50 text-red-700 border-red-300"
                                   : "bg-gray-50 text-gray-700 border-gray-300"
                               }
                           `}
                        >
                          {/* Add icon if open */}
                          {statusParams.color === "green" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {statusParams.status}
                        </Badge>

                        {shop.status === "verified" && (
                          <Badge
                            variant="outline"
                            className="ml-0 bg-blue-50 text-blue-700 border-blue-300"
                          >
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
