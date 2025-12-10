import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const { registerCustomer, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_number: "",
    student_id: "",
    department: "",
    gender: "",
  });

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await registerCustomer(registrationData);

      navigate("/customer");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account type selection
          </Link>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center mb-2">
                <h1 className="text-2xl font-bold">Create Customer Account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Fill in the form below to create your customer account
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Full Name *</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
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
                    placeholder="example@slu.edu.ph"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password *</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    {formData.password && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {formData.password.length >= 8 ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                  <FieldDescription
                    className={
                      formData.password && formData.password.length < 8
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formData.password && formData.password.length < 8
                      ? `${formData.password.length}/8 characters`
                      : "Min 8 characters"}
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password *
                  </FieldLabel>
                  <div className="relative">
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
                      className="pr-10"
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {formData.password === formData.confirmPassword ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                  <FieldDescription
                    className={
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "Passwords do not match"
                      : "Re-enter your password"}
                  </FieldDescription>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="contact_number">
                    Contact Number
                  </FieldLabel>
                  <Input
                    id="contact_number"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.contact_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_number: e.target.value,
                      })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="student_id">Student ID</FieldLabel>
                  <Input
                    id="student_id"
                    type="text"
                    placeholder="22XXXXX"
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="department">Department</FieldLabel>
                  <Input
                    id="department"
                    type="text"
                    placeholder="e.g., CS, MMA, IT, etc."
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 h-11 text-base font-semibold mt-2"
                >
                  Create Customer Account
                </Button>
              </Field>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-700 underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
