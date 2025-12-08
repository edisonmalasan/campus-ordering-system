import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function RegisterShop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_number: "",
    shop_name: "",
    delivery_fee: "",
    business_permit_code: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // TODO: API call to register shop
    console.log("Shop Registration Data:", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contact_number: formData.contact_number,
      shop_name: formData.shop_name,
      delivery_fee: parseFloat(formData.delivery_fee),
      business_permit_code: formData.business_permit_code,
      role: "shop",
      status: "pending", // Shop will be pending verification
    });

    // Navigate to login after successful registration
    // navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account type selection
          </Link>

          <div className="flex flex-col items-center gap-1 text-center mb-6">
            <h1 className="text-2xl font-bold">Create Shop Account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to register your shop
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Personal Information */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-200">
                  <h2 className="font-semibold text-base text-gray-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Details about the shop owner
                  </p>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Owner Name *</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email *</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shop@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password *</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={8}
                    />
                    <FieldDescription>Min 8 characters</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password *
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      minLength={8}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="contact_number">Contact Number</FieldLabel>
                    <Input
                      id="contact_number"
                      type="tel"
                      placeholder="+63 912 345 6789"
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_number: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
              </div>

              {/* Right Column - Business Information */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-200">
                  <h2 className="font-semibold text-base text-gray-900">
                    Business Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Details about your shop
                  </p>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="shop_name">Shop Name *</FieldLabel>
                    <Input
                      id="shop_name"
                      type="text"
                      placeholder="Emerson Canteen"
                      value={formData.shop_name}
                      onChange={(e) =>
                        setFormData({ ...formData, shop_name: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="delivery_fee">Delivery Fee (₱) *</FieldLabel>
                    <Input
                      id="delivery_fee"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="20.00"
                      value={formData.delivery_fee}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_fee: e.target.value })
                      }
                      required
                    />
                    <FieldDescription>Standard delivery charge</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="business_permit_code">
                      Business Permit Code
                    </FieldLabel>
                    <Input
                      id="business_permit_code"
                      type="text"
                      placeholder="BP-2024-12345"
                      value={formData.business_permit_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_permit_code: e.target.value,
                        })
                      }
                    />
                    <FieldDescription>For verification</FieldDescription>
                  </Field>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-900">
                      <strong>Note:</strong> Your shop will be pending
                      verification. Set operating hours after approval.
                    </p>
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <div className="mt-6 space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold"
              >
                Create Shop Account
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
