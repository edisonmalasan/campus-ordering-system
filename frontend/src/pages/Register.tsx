import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, User } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Join NaviBites
          </h1>
          <p className="text-gray-600">
            Choose your account type to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Registration Card */}
          <Link to="/register/customer">
            <Card className="group overflow-hidden border-2 border-gray-200 hover:border-green-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 group-hover:bg-green-500 transition-colors">
                  <User className="h-10 w-10 text-green-600 group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    Customer
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Order delicious food from campus vendors and get it
                    delivered SAMCIS campus
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 rounded-xl"
                    asChild
                  >
                    <span>Register as Customer</span>
                  </Button>
                </div>

                <ul className="text-left space-y-2 pt-4 border-t border-gray-100">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Browse multiple vendors
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Track your orders
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Fast campus delivery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Shop Registration Card */}
          <Link to="/register/shop">
            <Card className="group overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 group-hover:bg-blue-500 transition-colors">
                  <Store className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Shop Owner
                  </h2>
                  <p className="text-gray-600 text-sm">
                    List your products, manage orders, and grow your campus
                    business
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
                    asChild
                  >
                    <span>Register as Shop</span>
                  </Button>
                </div>

                <ul className="text-left space-y-2 pt-4 border-t border-gray-100">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    Manage your menu & inventory
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    Accept & fulfill orders
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    View sales analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:text-green-700 underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
