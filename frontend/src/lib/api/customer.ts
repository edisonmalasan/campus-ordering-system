import axiosInstance from "../axios";

export interface Shop {
  _id: string;
  shop_name: string;
  logo_url?: string;
  delivery_fee: number;
  isTemporarilyClosed: boolean;
  status: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  availability: boolean;
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
  order_number: string;
  shop_id: {
    _id: string;
    shop_name: string;
  };
  items: Array<{
    product_id: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  total_price: number;
  delivery_fee: number;
  delivery_address: string;
  status: string;
  createdAt: string;
}

export const getShops = async () => {
  const response = await axiosInstance.get("/customer/shops");
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

export const addToCart = async (productId: string, quantity: number) => {
  const response = await axiosInstance.post("/customer/cart/add", {
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

export const getCheckout = async () => {
  const response = await axiosInstance.get("/customer/checkout");
  return response.data;
};

export const placeOrder = async (orderData: {
  shop_id: string;
  delivery_address: string;
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
