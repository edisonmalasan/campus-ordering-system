import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import * as customerApi from "@/lib/api/customer";
import { toast } from "sonner";

export default function CartPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<customerApi.CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await customerApi.getCart();
      // DONT REMOVE COMMENT: { success: true, data: { items: [], shop_id, total_amount } }
      const cartData = response.data?.data || response.data;
      setCartItems(cartData?.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await customerApi.updateCartItem(itemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await customerApi.removeFromCart(itemId);
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Item removed");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
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
              Continue Shopping
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
                  Browse Shops
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-start hover:shadow-md transition-shadow"
                >
                  <div className="h-24 w-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    {item.product_id.image_url ? (
                      <img
                        src={item.product_id.image_url}
                        alt={item.product_id.name}
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
                          {item.product_id.name}
                        </h3>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          onClick={() => removeItem(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="font-bold text-green-600">
                        ₱{item.product_id.price.toFixed(2)}
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
                <>
                  <h2 className="font-bold text-lg mb-6 text-gray-900">
                    Order Summary
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-3 pb-6 border-b border-gray-100">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Subtotal ({itemCount} items)</span>
                        <span className="font-medium text-gray-900">
                          ₱{subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Delivery Fee</span>
                        <span className="font-medium text-gray-900">
                          ₱{deliveryFee.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">
                          Total Payment
                        </span>
                        <span className="font-bold text-2xl text-green-600">
                          ₱{total.toFixed(2)}
                        </span>
                      </div>

                      <Button
                        className="w-full h-14 text-lg rounded-xl bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-200"
                        onClick={() => navigate("/customer/cart/checkout")}
                        disabled={itemCount === 0}
                      >
                        Check Out ({itemCount})
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {isMobile && (
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-green-600 text-lg">
                    ₱{total.toFixed(2)}
                  </span>

                  <Button
                    className="w-40 h-12 text-base rounded-xl bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-200"
                    onClick={() => navigate("/customer/cart/checkout")}
                    disabled={itemCount === 0}
                  >
                    Check Out ({itemCount})
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
