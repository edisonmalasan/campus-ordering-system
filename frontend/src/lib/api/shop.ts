import axiosInstance from "../axios";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  availability: boolean;
}

export interface Order {
  _id: string;
  order_number: string;
  customer_id: {
    _id: string;
    name: string;
  };
  items: Array<{
    product_id: {
      _id: string;
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

export interface SalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
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
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  availability?: boolean;
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

export const getDailySales = async () => {
  const response = await axiosInstance.get("/shop/reports/daily");
  return response.data;
};

export const getWeeklySales = async () => {
  const response = await axiosInstance.get("/shop/reports/weekly");
  return response.data;
};
