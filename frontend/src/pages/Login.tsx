import { LoginForm } from "@/components/login-form";
import iconLogo from "@/assets/icon.png";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Left Side - Login Form */}
          <div className="p-8 lg:p-12">
            <LoginForm />
          </div>

          {/* Right Side - Branding with Logo */}
          <div className="hidden lg:flex items-center justify-center bg-gray-100 p-12 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

            {/* Logo and Text */}
            <div className="relative z-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl"></div>
                  <img
                    src={iconLogo}
                    alt="NaviBites Logo"
                    className="relative w-48 h-48 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-[#379570]">NaviBites</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
