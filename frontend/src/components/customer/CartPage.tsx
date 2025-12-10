import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingBag,
  Store,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import * as customerApi from "@/lib/api/customer";
import { toast } from "sonner";

interface CartItemWithSelection extends customerApi.CartItem {
  selected: boolean;
  shopName: string;
  shopId: string;
  deliveryFee: number;
}

export default function CartPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await customerApi.getCart();
      const data = response.data?.data || response.data;

      if (data && data.items) {
        // Backend now returns items with populated shop_id
        const mappedItems = data.items.map((item: any) => ({
          ...item,
          selected: false,
          shopName: item.shop_id?.shop_name || "Unknown Shop",
          shopId: item.shop_id?._id,
          // We need delivery fee per shop for calculation
          deliveryFee: item.shop_id?.delivery_fee || 0,
        }));

        setCartItems(mappedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, CartItemWithSelection[]> = {};
    cartItems.forEach((item) => {
      // Use shopId as key for robustness, but display Name
      const key = item.shopId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [cartItems]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await customerApi.updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update quantity");
      fetchCart();
    }
  };

  const removeItem = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));

    try {
      await customerApi.removeFromCart(itemId);
      toast.success("Item removed");
      // if (cartItems.length <= 1) fetchCart(); // No need to refetch aggressively
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  const toggleItemSelection = (id: string, shopId: string) => {
    setCartItems((prev) => {
      // Check if we are selecting an item
      const itemToToggle = prev.find((i) => i._id === id);
      const willBeSelected = !itemToToggle?.selected;

      if (willBeSelected) {
        // If selecting, deselect all items from OTHER shops
        return prev.map((item) => {
          if (item.shopId !== shopId) {
            return { ...item, selected: false };
          }
          if (item._id === id) {
            return { ...item, selected: true };
          }
          return item;
        });
      } else {
        // If deselecting, just deselect
        return prev.map((item) =>
          item._id === id ? { ...item, selected: false } : item
        );
      }
    });
  };

  const toggleShopSelection = (
    shopId: string,
    isCurrentlySelected: boolean
  ) => {
    setCartItems((prev) => {
      if (!isCurrentlySelected) {
        // Selecting this shop -> Deselect everything else
        return prev.map((item) => ({
          ...item,
          selected: item.shopId === shopId,
        }));
      } else {
        // Deselecting this shop -> Deselect its items
        return prev.map((item) => {
          if (item.shopId === shopId) {
            return { ...item, selected: false };
          }
          return item;
        });
      }
    });
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      ((item.product_id as any).items_price || item.product_id.price || 0) *
        item.quantity,
    0
  );

  // Delivery fee is based on the selected shop (assuming only one shop selected)
  const selectedShopId =
    selectedItems.length > 0 ? selectedItems[0].shopId : null;
  const deliveryFee = selectedShopId
    ? cartItems.find((i) => i.shopId === selectedShopId)?.deliveryFee || 0
    : 0;

  const total = selectedSubtotal + deliveryFee;
  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedCount === 0) return;
    const selectedItemIds = selectedItems.map((item) => item._id);
    navigate("/customer/cart/checkout", {
      state: { selectedItems: selectedItemIds },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

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
              My Cart ({cartItems.length})
            </h1>
            <Button
              variant="link"
              className="text-gray-500 hover:text-green-600 text-xs h-auto p-0"
              onClick={() => navigate("/customer/store")}
            >
              Add more items
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">
                Your cart is empty
              </h3>
              <Link to="/customer/store">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  Browse Foods
                </Button>
              </Link>
            </div>
          ) : (
            // groupedItems keys are shopIds now
            Object.entries(groupedItems).map(([shopId, items]) => {
              const isShopFullySelected = items.every((i) => i.selected);
              const shopName = items[0].shopName; // Get name from items

              return (
                <div
                  key={shopId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-white">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      checked={isShopFullySelected}
                      onChange={() =>
                        toggleShopSelection(shopId, isShopFullySelected)
                      }
                    />
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/customer/store/${shopId}`)}
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
                        key={item._id}
                        className="p-4 flex gap-4 items-start hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="pt-8">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                            checked={item.selected || false}
                            onChange={() =>
                              toggleItemSelection(item._id, item.shopId)
                            }
                          />
                        </div>

                        <div className="h-24 w-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          {(item.product_id as any).photo_url ||
                          item.product_id.image_url ? (
                            <img
                              src={
                                (item.product_id as any).photo_url ||
                                item.product_id.image_url
                              }
                              alt={
                                (item.product_id as any).items_name ||
                                item.product_id.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base leading-tight">
                                {(item.product_id as any).items_name ||
                                  item.product_id.name}
                              </h3>
                              <button
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                onClick={() => removeItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {/* Category usually not in cart item, but strictly following structure */}
                              {(item.product_id as any).items_category ||
                                "Food"}
                            </p>
                          </div>

                          <div className="flex justify-between items-end">
                            <p className="font-bold text-green-600">
                              ₱{" "}
                              {(
                                (item.product_id as any).items_price ||
                                item.product_id.price ||
                                0
                              ).toFixed(0)}
                            </p>

                            <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8 shadow-sm">
                              <button
                                className="px-2.5 h-full text-gray-500 hover:bg-gray-50 rounded-l-lg hover:text-gray-900 disabled:opacity-50"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                className="px-2.5 h-full text-gray-500 hover:bg-gray-50 rounded-r-lg hover:text-gray-900"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
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
                        ₱ {selectedSubtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-gray-900">
                        ₱ {deliveryFee.toFixed(2)}
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
                    {/* All checkbox removed for mobile per request */}

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
