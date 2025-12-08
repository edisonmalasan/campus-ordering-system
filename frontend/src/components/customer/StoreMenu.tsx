import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, ShoppingCart, ArrowLeft, Clock, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { shops } from "@/data/shops";
import { foodItems, type FoodItem } from "@/data/foods";

interface CartItem extends FoodItem {
  quantity: number;
}

export default function StoreMenu() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [cart, setCart] = useState<CartItem[]>([]);
  const shop = shops.find((s) => s._id === id) || shops[0];

  // TODO: Implement filter by shopId: foodItems.filter(item => item.shopId === id)
  const filteredFoods = foodItems;

  const addToCart = (food: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl ring-4 ring-white">
                  <img
                    src={shop.logo_url}
                    alt={shop.shop_name}
                    className="w-full h-full object-contain"
                  />
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

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">15-20 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Campus Location</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Open Now
                    </div>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 pt-8">
              <p className="text-sm text-gray-600">{shop.description}</p>
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
              {filteredFoods.length} items
            </span>
          </div>

          <div
            className={`grid gap-4 ${
              isMobile
                ? "grid-cols-1"
                : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="group overflow-hidden border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Badge className="absolute top-3 right-3 bg-white/95 text-gray-800 border-0 shadow-lg backdrop-blur-sm">
                      {food.category}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {food.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₱{food.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        onClick={() => addToCart(food)}
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Link to="/customer/cart">
        <Button
          size="lg"
          className={`
            fixed bottom-6 right-6 
            ${cartItemCount > 0 ? "h-16 w-16" : "h-14 w-14"}
            rounded-full shadow-2xl z-50 
            bg-gradient-to-r from-green-600 to-emerald-600 
            hover:from-green-700 hover:to-emerald-700
            border-4 border-white
            transition-all hover:scale-110 active:scale-95
            ${cartItemCount > 0 ? "animate-bounce" : ""}
          `}
        >
          {cartItemCount > 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{cartItemCount}</span>
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
