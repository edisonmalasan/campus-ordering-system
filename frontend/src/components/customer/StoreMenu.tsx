import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, ShoppingCart, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="mb-4">
        <Link to="/customer/store">
          <Button variant="outline" size="sm" className="gap-2 pl-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shops
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="h-24 bg-gradient-to-r from-green-600/10 to-blue-600/10 dark:from-green-900/20 dark:to-blue-900/20 relative"></div>
          <CardContent className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 text-center sm:text-left">
              <div
                className={`bg-white dark:bg-gray-900 p-1.5 rounded-full shadow-lg shrink-0 ${
                  isMobile ? "w-24 h-24" : "w-28 h-28"
                }`}
              >
                <img
                  src={shop.logo_url}
                  alt={shop.shop_name}
                  className="w-full h-full object-contain rounded-full bg-white"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                    {shop.shop_name}
                  </h1>
                  {shop.status === "verified" && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 gap-1 px-2 py-0.5 h-6"
                    >
                      <span className="text-[10px]">VERIFIED</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {shop.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {filteredFoods.map((food) => (
          <Card
            key={food.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {food.category}
                </Badge>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-base mb-1">{food.name}</h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">
                    ₱ {food.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    className="gap-2"
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

      <Link to="/customer/cart">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-lg z-50 hover:scale-110 transition-transform text-lg font-bold"
        >
          {cartItemCount > 0 ? (
            <span className="text-xl">{cartItemCount}</span>
          ) : (
            <ShoppingCart className="h-6 w-6" />
          )}
        </Button>
      </Link>
    </div>
  );
}
