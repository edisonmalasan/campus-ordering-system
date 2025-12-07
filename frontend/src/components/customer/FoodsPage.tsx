import { useState } from "react";
import { Search, Plus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import navibitesLogo from "@/assets/icon.png";

// Import data
import { foodItems, type FoodItem } from "@/data/foods";
import { categories } from "@/data/categories";

interface CartItem extends FoodItem {
  quantity: number;
}

export default function FoodsPage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredFoods = foodItems.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your food"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  Hungry? NaviBites
                  <br />
                  Has You Covered!
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Delicious meals, delivered fast. Enjoy your campus favorites,
                  anytime, anywhere.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Order Now
                </Button>
              </div>
              <div className="hidden sm:block">
                <img
                  src="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp"
                  alt="Food"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 mb-6">
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div
          className={`flex gap-3 ${
            isMobile ? "overflow-x-auto pb-2" : "flex-wrap"
          }`}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory === category.name ? "default" : "outline"
              }
              className={`${isMobile ? "flex-shrink-0" : ""} gap-2`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <h3 className="font-semibold text-lg mb-3">Explore Foods</h3>
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
