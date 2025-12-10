import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plus,
  ShoppingCart,
  ArrowLeft,
  Clock,
  MapPin,
  Loader2,
  Store,
  Package,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as customerApi from "@/lib/api/customer";

export default function StoreMenu() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [shop, setShop] = useState<customerApi.Shop | null>(null);
  const [products, setProducts] = useState<customerApi.Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [shopResponse, productsResponse] = await Promise.all([
          customerApi.getShopById(id),
          customerApi.getShopProducts(id),
        ]);

        setShop(shopResponse.data);
        setProducts(productsResponse.data || []);

        try {
          const cartResponse = await customerApi.getCart();
          const count = (cartResponse.data?.items || []).reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          setCartCount(count);
        } catch (error) {
          console.log("Cart fetch failed (likely auth), ignoring.");
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        toast.error("Failed to load shop menu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = async (product: customerApi.Product) => {
    try {
      if (!id) return;
      await customerApi.addToCart(product._id, 1, id);
      setCartCount((prev) => prev + 1);
      toast.success("Added to cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

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
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Shop Not Found</h3>
          <Link to="/customer/store">
            <Button>Browse All Shops</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isShopOpen = shop ? getShopStatus(shop).status === "Open Now" : false;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-4">
        <Link to="/customer/store">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 pl-2 hover:bg-green-50 hover:border-green-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shops
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="h-32 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
          </div>

          <CardContent className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 text-center sm:text-left">
              <div
                className={`relative ${isMobile ? "w-28 h-28" : "w-32 h-32"}`}
              >
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl -rotate-3"></div>
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl ring-4 ring-white flex items-center justify-center">
                  {shop.profile_photo_url ? (
                    <img
                      src={shop.profile_photo_url}
                      alt={shop.shop_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Store className="w-16 h-16 text-green-600" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {shop.shop_name}
                  </h1>
                  {shop.status === "verified" && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                      ✓ VERIFIED
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">15-20 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Campus Location</span>
                  </div>
                  {(() => {
                    const statusParams = getShopStatus(shop);
                    return (
                      <Badge
                        variant="outline"
                        className={`border-0 
                               ${
                                 statusParams.color === "green"
                                   ? "bg-green-100 text-green-700"
                                   : statusParams.color === "red"
                                   ? "bg-red-100 text-red-700"
                                   : "bg-gray-100 text-gray-700"
                               }
                           `}
                      >
                        <div className="flex items-center gap-1.5">
                          {statusParams.color === "green" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          )}
                          {statusParams.status}
                        </div>
                      </Badge>
                    );
                  })()}
                  <Badge
                    variant="outline"
                    className="border-green-200 text-green-700"
                  >
                    ₱{shop.delivery_fee?.toFixed(2) || "0.00"} Delivery
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-green-600"></div>
              Menu
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {products.length} items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                This shop hasn't added any products yet.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                isMobile
                  ? "grid-cols-1"
                  : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {products.map((food, index) => (
                <Card
                  key={food._id}
                  className="group overflow-hidden border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden h-48">
                      {food.photo_url ? (
                        <img
                          src={food.photo_url}
                          alt={food.items_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Badge className="absolute top-3 right-3 bg-white/95 text-gray-800 border-0 shadow-lg backdrop-blur-sm">
                        {food.items_category}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                        {food.items_name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₱{food.items_price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          disabled={food.status !== "available" || !isShopOpen}
                          className={`gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
                            food.status === "available" && isShopOpen
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            food.status === "available" &&
                            isShopOpen &&
                            addToCart(food)
                          }
                        >
                          <Plus className="h-4 w-4" />
                          {!isShopOpen
                            ? "Unavailable"
                            : food.status === "available"
                            ? "Add"
                            : "Sold Out"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Link to="/customer/cart">
        <Button
          size="lg"
          className={`
            fixed bottom-6 right-6 
            ${cartCount > 0 ? "h-16 w-16" : "h-14 w-14"}
            rounded-full shadow-2xl z-50 
            bg-gradient-to-r from-green-600 to-emerald-600 
            hover:from-green-700 hover:to-emerald-700
            border-4 border-white
            transition-all hover:scale-110 active:scale-95
            ${cartCount > 0 ? "animate-bounce" : ""}
          `}
        >
          {cartCount > 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{cartCount}</span>
              <span className="text-[10px] opacity-90">items</span>
            </div>
          ) : (
            <ShoppingCart className="h-6 w-6" />
          )}
        </Button>
      </Link>
    </div>
  );
}
