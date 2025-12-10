import axiosInstance from "../axios";

export interface Shop {
  _id: string;
  shop_name: string;
  profile_photo_url?: string;
  delivery_fee: number;
  operating_hours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  gcash_qr_url?: string;
  isTemporarilyClosed?: boolean;
  status: string;
}

export interface Product {
  _id: string;
  items_name: string;
  items_description: string;
  items_price: number;
  items_category: string;
  photo_url?: string;
  status: string;
  stock: number;
  preparation_time: number;
  shop_id: string;
}

export interface CartItem {
  _id: string;
  product_id: {
    _id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  shop_id: {
    _id: string;
    shop_name: string;
    profile_photo_url?: string;
  };
  items: Array<{
    product_id: {
      items_name: string;
      items_price: number;
    };
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  payment_method: string;
  payment_status: string;
  fulfillment_option: string;
  gcash_reference?: string;
  notes?: string;
  order_status: string;
  createdAt: string;
}

export const getShops = async () => {
  const response = await axiosInstance.get("/customer/shops");
  return response.data;
};

export const getShopById = async (shopId: string) => {
  const response = await axiosInstance.get(`/customer/shops/${shopId}`);
  return response.data;
};

export const getProducts = async () => {
  const response = await axiosInstance.get("/customer/products");
  return response.data;
};

export const getShopProducts = async (shopId: string) => {
  const response = await axiosInstance.get(`/customer/shops/${shopId}/product`);
  return response.data;
};

export const getCart = async () => {
  const response = await axiosInstance.get("/customer/cart");
  return response.data;
};

export const addToCart = async (
  productId: string,
  quantity: number,
  shopId: string
) => {
  const response = await axiosInstance.post("/customer/cart/add", {
    shop_id: shopId,
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await axiosInstance.put(`/customer/cart/update/${itemId}`, {
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (itemId: string) => {
  const response = await axiosInstance.delete(
    `/customer/cart/remove/${itemId}`
  );
  return response.data;
};

export const getCheckout = async (selectedItemIds?: string[]) => {
  const response = await axiosInstance.post("/customer/checkout", {
    selected_items: selectedItemIds,
  });
  return response.data;
};

export const placeOrder = async (orderData: {
  shop_id: string;
  delivery_address: string;
  fulfillment_option: "delivery" | "pickup";
}) => {
  const response = await axiosInstance.post("/customer/orders", orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get("/customer/orders");
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await axiosInstance.get(`/customer/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await axiosInstance.post(
    `/customer/orders/${orderId}/cancel`
  );
  return response.data;
};

export const claimOrder = async (orderId: string) => {
  const response = await axiosInstance.post(
    `/customer/orders/${orderId}/claim`
  );
  return response.data;
};
