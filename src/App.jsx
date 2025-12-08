import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import CustomerRegister from "./pages/auth/register-customer";
import VendorRegister from "./pages/auth/register-vendor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/customer" element={<CustomerRegister />} />
      <Route path="/register/vendor" element={<VendorRegister />} />
    </Routes>
  );
}

export default App;