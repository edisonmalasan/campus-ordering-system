// src/pages/auth/register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterType from "../../components/auth/register-type";

export default function Register() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "customer") {
      navigate("/register/customer");
    } else if (role === "vendor") {
      navigate("/register/vendor");
    }
  };

  return <RegisterType onSelect={handleSelect} />;
}