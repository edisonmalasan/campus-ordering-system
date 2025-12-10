import axiosInstance from "../axios";

export interface DashboardStats {
  totalShops: number;
  verifiedShops: number;
  pendingShops: number;
  totalCustomers: number;
}

export interface Shop {
  _id: string;
  name: string;
  email: string;
  shop_name: string;
  profile_photo_url?: string;
  business_permit_code?: string;
  delivery_fee: number;
  contact_number?: string;
  status: string;
  createdAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  profile_photo_url?: string;
  department?: string;
  student_id?: string;
  gender?: string;
  status: string;
  createdAt: string;
}

export const getDashboardStats = async () => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: DashboardStats;
  }>("/admin/dashboard/stats");
  return response.data;
};

export const getPendingShops = async () => {
  const response = await axiosInstance.get<{ success: boolean; data: Shop[] }>(
    "/admin/shops/pending"
  );
  return response.data;
};

export const getAllShops = async () => {
  const response = await axiosInstance.get<{ success: boolean; data: Shop[] }>(
    "/admin/shops"
  );
  return response.data;
};

export const approveShop = async (id: string) => {
  const response = await axiosInstance.put<{
    success: boolean;
    message: string;
    data: Shop;
  }>(`/admin/shops/${id}/approve`);
  return response.data;
};

export const rejectShop = async (id: string) => {
  const response = await axiosInstance.put<{
    success: boolean;
    message: string;
    data: Shop;
  }>(`/admin/shops/${id}/reject`);
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Customer[];
  }>("/admin/customers");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get<{ success: boolean; data: any[] }>(
    "/admin/users"
  );
  return response.data;
};
