import axiosInstance from "../axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCustomerData {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  student_id?: string;
  department?: string;
  gender?: string;
}

export interface RegisterShopData {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  shop_name: string;
  delivery_fee: number;
  business_permit_code?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "shop" | "admin";
  access_level?: "admin" | "base";
  userId?: string;
  profile_photo_url?: string;
  createdAt?: string;
  contact_number?: string;
  department?: string;
  gender?: string;
  student_id?: string;
  shop_name?: string;
  business_permit_code?: string;
  delivery_fee?: number;
  logo_url?: string;
  gcash_qr_url?: string;
  status?: string;
  isTemporarilyClosed?: boolean;
  operating_hours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken?: string;
    user: User;
  };
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const registerCustomer = async (
  data: RegisterCustomerData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register/customer",
    data
  );
  return response.data;
};

export const registerShop = async (
  data: RegisterShopData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register/shop",
    data
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<{
  success: boolean;
  data: { user: User };
}> => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const logout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.post("/auth/update-password", data);
  return response.data;
};

export const updateProfile = async (data: {
  name?: string;
  contact_number?: string;
}): Promise<{
  success: boolean;
  message: string;
  data: { user: User };
}> => {
  const response = await axiosInstance.put("/auth/profile", data);
  return response.data;
};

export const updateShopSettings = async (data: {
  shop_name?: string;
  delivery_fee?: number;
  logo_url?: string;
  gcash_qr_url?: string;
  isTemporarilyClosed?: boolean;
  operating_hours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
}): Promise<{
  success: boolean;
  message: string;
  data: { user: User };
}> => {
  const response = await axiosInstance.put("/auth/shop/settings", data);
  return response.data;
};
