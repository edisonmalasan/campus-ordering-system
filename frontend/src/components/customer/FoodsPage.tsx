import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Loader2,
  Package,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as customerApi from "@/lib/api/customer";
import { getShopStatus } from "@/lib/utils/shopUtils";

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Snack" },
  { id: 3, name: "Drink" },
  { id: 4, name: "Rice Meals" },
  { id: 5, name: "Desserts" },
];

export default function FoodsPage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<customerApi.Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const productsRes = await customerApi.getProducts();
      setProducts(productsRes.data || []);

      try {
        const cartRes = await customerApi.getCart();
        const count = (cartRes.data?.items || []).reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(count);
      } catch (error) {
        console.log("Could not fetch cart (user might be guest)");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: customerApi.Product) => {
    try {
      const shopId = (product as any).shop_id?._id || (product as any).shop_id;

      if (!shopId) {
        toast.error("Invalid product data: missing shop ID");
        return;
      }

      await customerApi.addToCart(product._id, 1, shopId);
      setCartCount((prev) => prev + 1);
      toast.success("Added to cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const filteredFoods = products.filter((food) => {
    const matchesSearch = food.items_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || food.items_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-green-600 transition-colors" />
          <Input
            placeholder="Search delicious food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white shadow-sm"
          />
        </div>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-600">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

          <CardContent className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                  <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30 backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular Today
                  </Badge>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  Hungry? NaviBites
                  <br />
                  Has You Covered!
                </h2>
                <p className="text-green-50/90 text-sm lg:text-base max-w-md">
                  Delicious meals, delivered fast. Enjoy your campus favorites,
                  anytime, anywhere.
                </p>
                <Button
                  size={isMobile ? "default" : "lg"}
                  className="bg-white text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
                >
                  Order Now →
                </Button>
              </div>
              {!isMobile && (
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                  <img
                    src="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp"
                    alt="Featured Food"
                    className="relative h-36 w-36 object-cover rounded-2xl shadow-2xl ring-4 ring-white/20"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            Categories
          </h3>
          <div
            className={`flex gap-2 ${
              isMobile ? "overflow-x-auto pb-2 no-scrollbar" : "flex-wrap"
            }`}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className={`
                  ${isMobile ? "flex-shrink-0" : ""} 
                  ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 border-0"
                      : "bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-500"
                  }
                  rounded-xl px-5 py-2.5 font-medium transition-all hover:scale-105 active:scale-95
                `}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-green-600"></div>
              Explore Foods
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              {filteredFoods.length} items
            </span>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `No foods found matching "${searchQuery}"`
                  : "There are no products available in the store right now."}
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
              {filteredFoods.map((food, index) => {
                const shopStatus = (food as any).shop_id
                  ? getShopStatus((food as any).shop_id)
                  : { status: "Unknown", color: "gray" };
                const isShopOpen = shopStatus.status === "Open Now";

                return (
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

                        {/* shop badge */}
                        <Badge
                          className={`absolute top-3 left-3 border-0 shadow-lg backdrop-blur-sm ${
                            shopStatus.color === "green"
                              ? "bg-green-500/90 text-white"
                              : shopStatus.color === "red"
                              ? "bg-red-500/90 text-white"
                              : "bg-gray-500/90 text-white"
                          }`}
                        >
                          {shopStatus.status}
                        </Badge>

                        {(food as any).shop_id?.shop_name && (
                          <Badge
                            className="absolute bottom-3 left-3 bg-black/50 text-white border-0 backdrop-blur-md text-xs font-normal cursor-pointer hover:bg-black/70 transition-colors z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Link
                              to={`/customer/store/${
                                (food as any).shop_id._id
                              }`}
                              className="flex items-center gap-1"
                            >
                              <Store className="h-3 w-3" />
                              {(food as any).shop_id.shop_name}
                            </Link>
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                          {food.items_name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 h-8">
                          {food.items_description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ₱{food.items_price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            disabled={
                              food.status !== "available" || !isShopOpen
                            }
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
                );
              })}
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
