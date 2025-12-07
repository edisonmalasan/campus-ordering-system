import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

import { shops } from "@/data/shops";

export default function StorePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <h1 className="text-2xl font-bold mb-6">All Shops</h1>

      <div
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {shops.map((shop) => (
          <div
            key={shop._id}
            onClick={() => navigate(`/customer/store/${shop._id}`)}
            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Card className="h-full overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={shop.logo_url}
                    alt={shop.shop_name}
                    className="w-20 h-20 object-contain"
                  />
                  <div className="text-center mt-1">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block leading-tight">
                      {shop.shop_name.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{shop.shop_name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {shop.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
