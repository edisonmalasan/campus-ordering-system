import axiosInstance from "../axios";

export interface Product {
  _id: string;
  items_name: string;
  items_description: string;
  items_price: number;
  items_category: string;
  photo_url: string;
  status: string;
  stock: number;
  preparation_time: number;
}

export interface Order {
  _id: string;
  customer_id: {
    _id: string;
    name: string;
  };
  items: Array<{
    product_id: {
      _id: string;
      items_name: string;
      items_price: number;
    };
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  fulfillment_option: string;
  notes?: string;
  createdAt: string;
}

export interface DailySalesReport {
  date: string;
  total_revenue: number;
  total_orders: number;
  orders: any[];
}

export interface WeeklySalesReport {
  period: {
    start: string;
    end: string;
  };
  total_revenue: number;
  total_orders: number;
  daily_breakdown: Record<string, { orders: number; revenue: number }>;
}

export const getProfile = async () => {
  const response = await axiosInstance.get("/shop/profile");
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/shop/dashboard/stats");
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await axiosInstance.put("/shop/profile", profileData);
  return response.data;
};

export const getProducts = async () => {
  const response = await axiosInstance.get("/shop/product");
  return response.data;
};

export const addProduct = async (productData: {
  items_name: string;
  items_description: string;
  items_price: number;
  items_category: string;
  photo_url?: string;
  status?: string;
  stock?: number;
  preparation_time?: number;
}) => {
  const response = await axiosInstance.post("/shop/product", productData);
  return response.data;
};

export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
) => {
  const response = await axiosInstance.put(
    `/shop/product/${productId}`,
    productData
  );
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await axiosInstance.delete(`/shop/product/${productId}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get("/shop/orders");
  return response.data;
};

export const acceptOrder = async (orderId: string) => {
  const response = await axiosInstance.patch(`/shop/orders/${orderId}/accept`);
  return response.data;
};

export const rejectOrder = async (orderId: string) => {
  const response = await axiosInstance.patch(`/shop/orders/${orderId}/reject`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axiosInstance.patch(`/shop/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

export const updatePaymentStatus = async (orderId: string, status: string) => {
  const response = await axiosInstance.patch(`/shop/orders/${orderId}/payment-status`, {
    status,
  });
  return response.data;
};

export const getDailySales = async () => {
  const response = await axiosInstance.get("/shop/reports/daily");
  return response.data;
};

export const getWeeklySales = async () => {
  const response = await axiosInstance.get("/shop/reports/weekly");
  return response.data;
};
