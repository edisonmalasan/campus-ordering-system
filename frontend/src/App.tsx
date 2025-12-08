import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterShop from "./pages/RegisterShop";
import { Toaster } from "./components/ui/sonner";

import CustomerPage from "./pages/customer/CustomerPage";
import FoodsPage from "./components/customer/FoodsPage";
import StorePage from "./components/customer/StorePage";
import StoreMenu from "./components/customer/StoreMenu";
import CartPage from "./components/customer/CartPage";
import CheckoutPage from "./components/customer/CheckoutPage";
import OrderPlacedPage from "./components/customer/OrderPlacedPage";
import OrderDetails from "./components/customer/OrderDetails";
import OrdersPage from "./components/customer/OrdersPage";
import ProfilePage from "./components/customer/ProfilePage";

import ShopPage from "./pages/shop/ShopPage";
import ShopPendingVerification from "./pages/shop/ShopPendingVerification";
import ShopDashboard from "./components/shop/ShopDashboard";
import ShopProfile from "./components/shop/ShopProfile";
import ShopSettings from "./components/shop/ShopSettings";
import ProductList from "./components/shop/ProductList";
import ProductCreate from "./components/shop/ProductCreate";
import ProductEdit from "./components/shop/ProductEdit";
import OrdersList from "./components/shop/OrdersList";
import DailySales from "./components/shop/DailySales";
import WeeklySales from "./components/shop/WeeklySales";

import AdminPage from "./pages/admin/AdminPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ShopVerification from "./components/admin/ShopVerification";
import ManageShops from "./components/admin/ManageShops";
import ManageCustomers from "./components/admin/ManageCustomers";
import AllUsers from "./components/admin/AllUsers";

import AuthProvider from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/shop" element={<RegisterShop />} />
          <Route path="/shop/pending" element={<ShopPendingVerification />} />

          {/* protected customer routes */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer" element={<CustomerPage />}>
              <Route index element={<Navigate to="foods" replace />} />
              <Route
                path="foods"
                element={<FoodsPage />}
                handle={{ title: "Foods" }}
              />
              <Route
                path="store"
                element={<StorePage />}
                handle={{ title: "Store" }}
              />
              <Route
                path="store/:id"
                element={<StoreMenu />}
                handle={{ title: "{name}" }}
              />
              <Route
                path="cart"
                element={<CartPage />}
                handle={{ title: "Your Cart" }}
              />
              <Route
                path="cart/checkout"
                element={<CheckoutPage />}
                handle={{ title: "Checkout" }}
              />
              <Route
                path="cart/order-placed"
                element={<OrderPlacedPage />}
                handle={{ title: "Order Placed" }}
              />
              <Route
                path="orders"
                element={<OrdersPage />}
                handle={{ title: "Your Orders" }}
              />
              <Route
                path="orders/:id"
                element={<OrderDetails />}
                handle={{ title: "Order Details" }}
              />
              <Route
                path="profile"
                element={<ProfilePage />}
                handle={{ title: "Your Profile" }}
              />
            </Route>
          </Route>

          {/* protected shop routes */}
          <Route element={<ProtectedRoute allowedRoles={["shop"]} />}>
            <Route path="/shop" element={<ShopPage />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ShopDashboard />} />
              <Route path="profile" element={<ShopProfile />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductCreate />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="reports/daily" element={<DailySales />} />
              <Route path="reports/weekly" element={<WeeklySales />} />
              <Route path="settings" element={<ShopSettings />} />
            </Route>
          </Route>

          {/* protected admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="shops/pending" element={<ShopVerification />} />
              <Route path="shops" element={<ManageShops />} />
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="users" element={<AllUsers />} />
            </Route>
          </Route>

          {/* redirect any form of routes thats not included into entry route (palitan ko ng 404 not found to) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}
