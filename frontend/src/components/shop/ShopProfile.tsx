import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  User2,
  Save,
  Calendar,
  Building2,
  BadgeCheck,
  Lock,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/lib/api/auth";
import { toast } from "sonner";

export default function ShopProfile() {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
  };

  const [user, setUser] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    contact_number: authUser?.contact_number || "",
    profile_photo_url:
      authUser?.profile_photo_url ||
      "https://i.pinimg.com/736x/0a/f7/4e/0af74e593c1473623388a4c3d3c55e8.jpg",
    shop_name: (authUser as any)?.shop_name || "",
    business_permit_code:
      (authUser as any)?.business_permit_code || "Not provided",
    delivery_fee: (authUser as any)?.delivery_fee || 0,
    member_since: formatJoinDate(authUser?.createdAt),
  });

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name || "",
        email: authUser.email || "",
        contact_number: authUser.contact_number || "",
        profile_photo_url:
          authUser.profile_photo_url ||
          "https://i.pinimg.com/736x/0a/f7/4e/0af74e593c1473623388a4c3d3c55e8.jpg",
        shop_name: (authUser as any)?.shop_name || "",
        business_permit_code:
          (authUser as any)?.business_permit_code || "Not provided",
        delivery_fee: (authUser as any)?.delivery_fee || 0,
        member_since: formatJoinDate(authUser.createdAt),
      });
    }
  }, [authUser]);

  const handleSave = async () => {
    try {
      const profileResponse = await authApi.updateProfile({
        name: user.name,
        contact_number: user.contact_number,
      });

      const shopResponse = await authApi.updateShopSettings({
        delivery_fee: parseFloat(user.delivery_fee.toString()),
      });

      if (profileResponse.success && shopResponse.success) {
        const updatedUser = {
          ...profileResponse.data.user,
          ...shopResponse.data.user,
        };
        useAuth.setState({ user: updatedUser });
        toast.success("Profile updated successfully!");
      }
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    try {
      const response = await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="relative h-60 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-yellow-600/20"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="absolute top-6 right-6 z-10 flex gap-3">
          {!isEditing && !isChangingPassword ? (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
              >
                <User2 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button
                onClick={() => setIsChangingPassword(true)}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
              >
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setIsChangingPassword(false);
                  if (authUser) {
                    setUser({
                      name: authUser.name || "",
                      email: authUser.email || "",
                      contact_number: authUser.contact_number || "",
                      profile_photo_url:
                        authUser.profile_photo_url ||
                        "https://i.pinimg.com/736x/0a/f7/4e/0af74e593c1473623388a4c3d3c55e8.jpg",
                      shop_name: (authUser as any)?.shop_name || "",
                      business_permit_code:
                        (authUser as any)?.business_permit_code ||
                        "Not provided",
                      delivery_fee: (authUser as any)?.delivery_fee || 0,
                      member_since: formatJoinDate(authUser.createdAt),
                    });
                  }
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={isChangingPassword ? handlePasswordChange : handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 -mt-20 relative z-20">
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                <div className="relative group mb-5">
                  <div className="h-32 w-32 rounded-full p-1 bg-white ring-4 ring-gray-50 ring-offset-2 overflow-hidden shadow-2xl">
                    <img
                      src={user.profile_photo_url}
                      alt="Profile"
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.shop_name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {user.business_permit_code}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200 inline-flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Verified
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200 inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>

                <div className="w-full pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-600 justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="font-medium text-gray-900">
                        {user.member_since}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 pt-0 lg:pt-20 space-y-8">
            {isChangingPassword ? (
              <div className="space-y-5 pt-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Change Password
                  </h3>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="h-12 pl-11 pr-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                      />
                      {passwordData.newPassword && (
                        <div className="absolute right-3 top-3.5">
                          {passwordData.newPassword.length >= 8 ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        passwordData.newPassword &&
                        passwordData.newPassword.length < 8
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordData.newPassword &&
                      passwordData.newPassword.length < 8
                        ? `${passwordData.newPassword.length}/8 characters`
                        : "Min 8 characters"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="h-12 pl-11 pr-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                      />
                      {passwordData.confirmPassword && (
                        <div className="absolute right-3 top-3.5">
                          {passwordData.newPassword ===
                          passwordData.confirmPassword ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? "Passwords do not match"
                        : "Re-enter your new password"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Shop Information
                    </h3>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 grid gap-6">
                    <div className="grid gap-2">
                      <label className="text-sm font-bold text-gray-700">
                        Shop Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                          value={user.shop_name}
                          disabled={true}
                          className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50 text-gray-700 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-bold text-gray-700">
                        Delivery Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400 font-semibold">
                          ₱
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={user.delivery_fee}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              delivery_fee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Contact Information
                    </h3>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 grid gap-6">
                    <div className="grid gap-2">
                      <label className="text-sm font-bold text-gray-700">
                        Owner Name
                      </label>
                      <Input
                        value={user.name}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <label className="text-sm font-bold text-gray-700">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <Input
                            value={user.email}
                            disabled={true}
                            className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-bold text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                          <Input
                            value={user.contact_number}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setUser({
                                ...user,
                                contact_number: e.target.value,
                              })
                            }
                            className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
