import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterShop from "./pages/RegisterShop";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* common entry point for all roles */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
        <Route path="/register/shop" element={<RegisterShop />} />
      </Routes>
    </Router>
  );
}
