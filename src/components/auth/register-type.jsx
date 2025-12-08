import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const roles = [
  { id: "customer", label: "Customer" },
  { id: "vendor", label: "Vendor" },
];

export default function RegisterType({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-md">
        <h1 className="text-base font-semibold text-center mb-2">
          Please select your role
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose the account type that best describes you
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`flex flex-col items-center justify-center p-6 border rounded-xl cursor-pointer transition
                ${selected === role.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400"}
              `}
            >

              <div className="mb-2 text-gray-400">{role.label === "Customer" ? "👤" : "🏪"}</div>
              <span className="font-medium">{role.label}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => selected && onSelect(selected)}
          className="w-full !bg-[#35956F] text-white"
          disabled={!selected}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}