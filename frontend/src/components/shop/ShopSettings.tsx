import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, Edit2, X, Store, BadgeCheck, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/lib/api/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type DayHours = {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
};

export default function ShopSettings() {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    shop_name: (authUser as any)?.shop_name || "",
    business_permit_code: (authUser as any)?.business_permit_code || "",
    logo_url: (authUser as any)?.logo_url || "",
    delivery_fee: (authUser as any)?.delivery_fee?.toString() || "20",
    gcash_qr_url: (authUser as any)?.gcash_qr_url || "",
    isTemporarilyClosed: (authUser as any)?.isTemporarilyClosed || false,
    operating_hours: ((authUser as any)?.operating_hours as DayHours[]) || [
      { day: "Monday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Tuesday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Wednesday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Thursday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Friday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Saturday", open: "08:00", close: "16:00", isClosed: false },
      { day: "Sunday", open: "", close: "", isClosed: true },
    ],
  });

  useEffect(() => {
    if (authUser) {
      setSettings((prev) => ({
        ...prev,
        shop_name: (authUser as any)?.shop_name || "",
        business_permit_code: (authUser as any)?.business_permit_code || "",
        logo_url: (authUser as any)?.logo_url || "",
        delivery_fee: (authUser as any)?.delivery_fee?.toString() || "20",
        gcash_qr_url: (authUser as any)?.gcash_qr_url || "",
        isTemporarilyClosed: (authUser as any)?.isTemporarilyClosed || false,
        operating_hours:
          ((authUser as any)?.operating_hours as DayHours[]) ||
          prev.operating_hours,
      }));
    }
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.updateShopSettings({
        shop_name: settings.shop_name,
        delivery_fee: parseFloat(settings.delivery_fee),
        logo_url: settings.logo_url,
        gcash_qr_url: (settings as any).gcash_qr_url,
        isTemporarilyClosed: settings.isTemporarilyClosed,
        operating_hours: settings.operating_hours,
      });

      if (response.success && response.data.user) {
        useAuth.setState({ user: response.data.user });
        toast.success("Shop settings updated successfully!");
        setIsEditing(false);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update settings";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (authUser) {
      setSettings({
        shop_name: (authUser as any)?.shop_name || "",
        business_permit_code: (authUser as any)?.business_permit_code || "",
        logo_url: (authUser as any)?.logo_url || "",
        delivery_fee: (authUser as any)?.delivery_fee?.toString() || "20",
        gcash_qr_url: (authUser as any)?.gcash_qr_url || "",
        isTemporarilyClosed: (authUser as any)?.isTemporarilyClosed || false,
        operating_hours:
          ((authUser as any)?.operating_hours as DayHours[]) ||
          settings.operating_hours,
      });
    }
  };

  const updateDayHours = (
    index: number,
    field: keyof DayHours,
    value: string | boolean
  ) => {
    const newHours = [...settings.operating_hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setSettings({ ...settings, operating_hours: newHours });
  };

  return (
    <div className="space-y-6 pb-20">
      {!isEditing && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit Settings
          </Button>
        </div>
      )}

      {isEditing ? (
        /* EDIT MODE */
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shop_name">Business Name *</Label>
                <Input
                  id="shop_name"
                  value={settings.shop_name}
                  onChange={(e) =>
                    setSettings({ ...settings, shop_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Shop Logo URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder="https://example.com/logo.jpg"
                  value={settings.logo_url}
                  onChange={(e) =>
                    setSettings({ ...settings, logo_url: e.target.value })
                  }
                />
                {settings.logo_url && (
                  <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden border">
                    <img
                      src={settings.logo_url}
                      alt="Shop logo"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_permit_code">
                  Business Permit Code *
                </Label>
                <Input
                  id="business_permit_code"
                  placeholder="e.g. BP-2024-12345"
                  value={settings.business_permit_code}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_permit_code: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery & Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_fee">Delivery Fee (₱) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-gray-500 font-medium">
                    ₱
                  </span>
                  <Input
                    id="delivery_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="20.00"
                    value={settings.delivery_fee}
                    onChange={(e) =>
                      setSettings({ ...settings, delivery_fee: e.target.value })
                    }
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcash_qr_url">GCash QR Code URL</Label>
                <Input
                  id="gcash_qr_url"
                  type="url"
                  placeholder="https://example.com/my-qr-code.jpg"
                  value={(settings as any).gcash_qr_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      gcash_qr_url: e.target.value,
                    } as any)
                  }
                />
                {/* Preview for GCash QR */}
                {(settings as any).gcash_qr_url && (
                  <div className="mt-2 h-32 w-32 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                    <img
                      src={(settings as any).gcash_qr_url}
                      alt="GCash QR"
                      className="w-full h-full object-contain"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50/50">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isTemporarilyClosed"
                    className="text-base cursor-pointer font-medium"
                  >
                    Temporarily Closed
                  </Label>
                  <p className="text-sm text-gray-500">
                    Hide your shop from customers temporarily
                  </p>
                </div>
                <Switch
                  id="isTemporarilyClosed"
                  checked={settings.isTemporarilyClosed}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, isTemporarilyClosed: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {settings.operating_hours.map((dayHours, index) => (
                <div
                  key={dayHours.day}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 sm:items-center p-3 sm:p-0 border sm:border-0 rounded-lg"
                >
                  <Label className="sm:col-span-3 font-medium text-base sm:text-sm">
                    {dayHours.day}
                  </Label>

                  {dayHours.isClosed ? (
                    <div className="sm:col-span-6 text-sm text-gray-500 italic">
                      Closed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:contents">
                      <Input
                        type="time"
                        value={dayHours.open}
                        onChange={(e) =>
                          updateDayHours(index, "open", e.target.value)
                        }
                        className="flex-1 sm:col-span-3"
                        disabled={dayHours.isClosed}
                      />
                      <span className="text-center text-gray-500 text-sm sm:col-span-1">
                        to
                      </span>
                      <Input
                        type="time"
                        value={dayHours.close}
                        onChange={(e) =>
                          updateDayHours(index, "close", e.target.value)
                        }
                        className="flex-1 sm:col-span-3"
                        disabled={dayHours.isClosed}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <Label
                      htmlFor={`closed-${index}`}
                      className="text-sm sm:text-xs cursor-pointer"
                    >
                      Closed
                    </Label>
                    <Switch
                      id={`closed-${index}`}
                      checked={dayHours.isClosed}
                      onCheckedChange={(checked) =>
                        updateDayHours(index, "isClosed", checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </form>
      ) : (
        /* VIEW MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Left Column: Key Configuration */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Shop Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium text-gray-700">
                    Online Visibility
                  </span>
                  {settings.isTemporarilyClosed ? (
                    <Badge variant="destructive">Hidden (Closed)</Badge>
                  ) : (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Visible (Active)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {settings.isTemporarilyClosed
                    ? "Your shop is currently hidden from customers."
                    : "Your shop is visible to customers during operating hours."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Delivery Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Standard Delivery Fee</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₱ {parseFloat(settings.delivery_fee).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Business Permit Code
                  </p>
                  <p className="font-mono text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 block text-center">
                    {settings.business_permit_code || "Not Set"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-100 lg:col-span-2 h-fit">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <CardTitle>Operating Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {settings.operating_hours.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 w-32">
                      {day.day}
                    </span>
                    <div className="flex-1 text-right">
                      {day.isClosed ? (
                        <Badge
                          variant="outline"
                          className="text-gray-400 border-gray-200"
                        >
                          Closed
                        </Badge>
                      ) : (
                        <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                          {day.open} - {day.close}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
