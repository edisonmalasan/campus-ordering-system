import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingBag,
  Store,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// mock data for now
import { foodItems } from "@/data/foods";

//
const initialCart = [
  {
    ...foodItems[0],
    quantity: 1,
    shopName: "Emerson Canteen",
    selected: false,
  },
  { ...foodItems[6], quantity: 2, shopName: "On the Go Cafe", selected: false },
  {
    ...foodItems[9],
    quantity: 1,
    shopName: "Seminary Canteen",
    selected: false,
  },
  {
    ...foodItems[1],
    quantity: 1,
    shopName: "Emerson Canteen",
    selected: false,
  },
  { ...foodItems[2], quantity: 1, shopName: "On the Go Cafe", selected: false },
  {
    ...foodItems[3],
    quantity: 1,
    shopName: "Seminary Canteen",
    selected: false,
  },
];

export default function CartPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [cart, setCart] = useState(initialCart);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof cart> = {};
    cart.forEach((item) => {
      if (!groups[item.shopName]) {
        groups[item.shopName] = [];
      }
      groups[item.shopName].push(item);
    });
    return groups;
  }, [cart]);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItemSelection = (id: number, shopName: string) => {
    setCart((prev) => {
      const isDifferentShopSelected = prev.some(
        (item) => item.selected && item.shopName !== shopName
      );

      return prev.map((item) => {
        if (isDifferentShopSelected && item.shopName !== shopName) {
          return { ...item, selected: false };
        }
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
    });
  };

  const toggleShopSelection = (
    shopName: string,
    isCurrentlySelected: boolean
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.shopName === shopName) {
          return { ...item, selected: !isCurrentlySelected };
        }
        if (!isCurrentlySelected) {
          return { ...item, selected: false };
        }
        return item;
      })
    );
  };

  const selectedItems = cart.filter((item) => item.selected);
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = selectedItems.length > 0 ? 50 : 0;
  const total = selectedSubtotal + deliveryFee;
  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedCount === 0) return;
    navigate("/customer/cart/checkout", {
      state: {
        items: selectedItems,
        total: total,
      },
    });
  };

  return (
    <div className={`min-h-screen bg-white ${isMobile ? "pb-24 pt-4" : "p-8"}`}>
      <div
        className={`max-w-4xl mx-auto ${
          !isMobile && "grid grid-cols-1 md:grid-cols-3 gap-8"
        }`}
      >
        {/* LEFT */}
        <div className={`space-y-4 ${!isMobile && "md:col-span-2"}`}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <h1 className="font-bold text-gray-900 text-lg">
              My Cart ({cart.length})
            </h1>
            <Button
              variant="link"
              className="text-gray-500 hover:text-red-500 text-xs h-auto p-0"
              onClick={() => navigate("/customer/foods")}
            >
              Add more items
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">
                Your cart is empty
              </h3>
              <Link to="/customer/foods">
                <Button className="mt-4">Browse Foods</Button>
              </Link>
            </div>
          ) : (
            Object.entries(groupedItems).map(([shopName, items]) => {
              const isShopFullySelected = items.every((i) => i.selected);

              return (
                <div
                  key={shopName}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-white">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      checked={isShopFullySelected}
                      onChange={() =>
                        toggleShopSelection(shopName, isShopFullySelected)
                      }
                    />
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        navigate(
                          `/customer/store/${encodeURIComponent(shopName)}`
                        )
                      }
                    >
                      <Store className="h-4 w-4 text-gray-700" />
                      <span className="font-bold text-gray-900 text-sm">
                        {shopName}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex gap-4 items-start hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="pt-8">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                            checked={item.selected || false}
                            onChange={() =>
                              toggleItemSelection(item.id, item.shopName)
                            }
                          />
                        </div>

                        <div className="h-24 w-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base leading-tight">
                                {item.name}
                              </h3>
                              <button
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {item.category}
                            </p>
                          </div>

                          <div className="flex justify-between items-end">
                            <p className="font-bold text-green-600">
                              ₱ {item.price.toFixed(0)}
                            </p>

                            <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8 shadow-sm">
                              <button
                                className="px-2.5 h-full text-gray-500 hover:bg-gray-50 rounded-l-lg hover:text-gray-900 disabled:opacity-50"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                className="px-2.5 h-full text-gray-500 hover:bg-gray-50 rounded-r-lg hover:text-gray-900"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div
          className={`
            ${
              isMobile
                ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] pb-4 px-4 pt-4"
                : "col-span-1"
            }
        `}
        >
          <div className={`${!isMobile && "sticky top-8 space-y-4"}`}>
            {/* Summary Card */}
            <div
              className={`${
                !isMobile
                  ? "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  : ""
              }`}
            >
              {!isMobile && (
                <h2 className="font-bold text-lg mb-6 text-gray-900">
                  Order Summary
                </h2>
              )}

              {!isMobile && (
                <div className="space-y-6">
                  <div className="space-y-3 pb-6 border-b border-gray-100">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Subtotal ({selectedCount} items)</span>
                      <span className="font-medium text-gray-900">
                        ₱ {selectedSubtotal}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-gray-900">
                        ₱ {deliveryFee}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">
                        Total Payment
                      </span>
                      <span className="font-bold text-2xl text-green-600">
                        ₱ {total.toFixed(0)}
                      </span>
                    </div>

                    <Button
                      className="w-full h-14 text-lg rounded-xl bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-200 transition-all hover:translate-y-[-1px]"
                      onClick={handleCheckout}
                      disabled={selectedCount === 0}
                    >
                      Check Out ({selectedCount})
                    </Button>
                  </div>
                </div>
              )}

              {isMobile && (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedCount > 0 &&
                          selectedCount ===
                            cart.reduce((a, b) => a + b.quantity, 0)
                        }
                        disabled
                        className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        All
                      </span>
                    </div>

                    <span className="font-bold text-green-600 text-lg">
                      ₱ {total.toFixed(0)}
                    </span>
                  </div>

                  <Button
                    className="w-40 h-12 text-base rounded-xl bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-200"
                    onClick={handleCheckout}
                    disabled={selectedCount === 0}
                  >
                    Check Out ({selectedCount})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
