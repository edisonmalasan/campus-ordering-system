import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Store, MapPin } from "lucide-react";

import { shops } from "@/data/shops";

export default function StorePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
                Discover amazing food from campus vendors
              </p>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-4 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {shops.map((shop, index) => (
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
                            <img
                              src={shop.logo_url}
                              alt={shop.shop_name}
                              className="w-16 h-16 object-contain"
                            />
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
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {shop.description}
                    </p>

                    <div className="pt-3 border-t border-gray-100">
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          Open
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Store className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No shops available
            </h3>
            <p className="text-sm text-gray-500">
              Check back later for new vendors
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
