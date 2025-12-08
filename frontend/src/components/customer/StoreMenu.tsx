import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plus,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Store,
  Package,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as customerApi from "@/lib/api/customer";
import { toast } from "sonner";

export default function StoreMenu() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<customerApi.Product[]>([]);
  const [shop, setShop] = useState<customerApi.Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const shopsResponse = await customerApi.getShops();
        const foundShop = shopsResponse.data.find(
          (s: customerApi.Shop) => s._id === id
        );
        setShop(foundShop || null);

        const productsResponse = await customerApi.getShopProducts(id);
        setProducts(productsResponse.data || []);
      } catch (error) {
        console.error("Error fetching shop data:", error);
        toast.error("Failed to load shop menu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (productId: string) => {
    try {
      await customerApi.addToCart(productId, 1);
      toast.success("Added to cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "Failed to add to cart");
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
          </div>

          <CardContent className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl -rotate-3"></div>
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl ring-4 ring-white">
                  {shop.logo_url ? (
                    <img
                      src={shop.logo_url}
                      alt={shop.shop_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Store className="w-full h-full text-green-600" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {shop.shop_name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    ₱{shop.delivery_fee.toFixed(2)} delivery
                  </Badge>
                  {shop.status === "verified" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-300"
                    >
                      Verified
                    </Badge>
                  )}
                  {shop.isTemporarilyClosed && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-300"
                    >
                      Temporarily Closed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                This shop hasn't added any products yet
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ₱{product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={!product.availability}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {product.availability ? "Add" : "Unavailable"}
                      </Button>
                    </div>
                    {!product.availability && (
                      <Badge
                        variant="outline"
                        className="mt-2 bg-gray-100 text-gray-600"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Link to="/customer/cart">
        <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-2xl bg-green-600 hover:bg-green-700"
          size="icon"
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
