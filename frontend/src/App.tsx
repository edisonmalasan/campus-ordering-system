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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* pub routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
        <Route path="/register/shop" element={<RegisterShop />} />
        <Route path="*" element={<Navigate to="/" replace />} />

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
        {/* <Route path="/customer/notifications" element={<Notifications />} /> */}
      </Routes>
    </Router>
  );
}
