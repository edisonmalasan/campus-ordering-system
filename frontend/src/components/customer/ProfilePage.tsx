import { useState } from "react";
import {
  Mail,
  Phone,
  User2,
  Camera,
  Save,
  LogOut,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock Data
const initialUser = {
  name: "Edison Malasan",
  email: "edisonmalasan@gmail.com",
  contact_number: "09123456789",
  profile_photo_url: "https://github.com/shadcn.png",
  department:
    "School of Accountancy, Management, Computing and Information Studies",
  gender: "male",
  member_since: "August 2023",
  student_id: "2212345",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving profile:", user);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="relative h-60 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-blue-600/20"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="absolute top-6 right-6 z-10 flex gap-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
            >
              <User2 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
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
                  {isEditing && (
                    <div className="absolute inset-0 m-1 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                      <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-500 font-medium mb-4">
                  {user.student_id}
                </p>

                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100">
                    Student
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                    {user.gender}
                  </span>
                </div>

                <div className="w-full pt-6 border-t border-gray-50 text-center">
                  <span className="block text-2xl font-bold text-gray-900">
                    12
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Orders
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Member Details
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="font-medium text-gray-900">
                    {user.member_since}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 pt-0 lg:pt-20 space-y-8">
            <div className="space-y-5 pt-5">
              <div className="flex items-center gap-3 ">
                <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 grid gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Full Name
                  </label>
                  <Input
                    value={user.name}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
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
                          setUser({ ...user, contact_number: e.target.value })
                        }
                        className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Academic & Security
                </h3>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 grid gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Department
                  </label>
                  <Select
                    disabled={!isEditing}
                    value={user.department}
                    onValueChange={(val) =>
                      setUser({ ...user, department: val })
                    }
                  >
                    <SelectTrigger className="h-auto py-3 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white">
                      <div className="text-left whitespace-normal leading-tight">
                        <SelectValue placeholder="Select Department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="School of Accountancy, Management, Computing and Information Studies">
                        School of Accountancy, Management, Computing and
                        Information Studies
                      </SelectItem>
                      <SelectItem value="School of Engineering and Architecture">
                        School of Engineering and Architecture
                      </SelectItem>
                      <SelectItem value="School of Nursing">
                        School of Nursing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      Gender
                    </label>
                    <Select
                      disabled={true}
                      value={user.gender}
                      onValueChange={(val) => setUser({ ...user, gender: val })}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        value="••••••••••••"
                        disabled={true}
                        className="h-12 pl-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-500"
                      />
                      <Button
                        variant="link"
                        className="absolute right-2 top-1 h-10 text-xs text-blue-600"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
