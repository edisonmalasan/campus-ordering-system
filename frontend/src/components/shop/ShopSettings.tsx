import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, Upload } from "lucide-react";

type DayHours = {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
};

export default function ShopSettings() {
  const [settings, setSettings] = useState({
    shop_name: "Emerson Canteen",
    business_permit_code: "BP-2024-12345",
    logo_url: "",
    delivery_radius: "5",
    delivery_fee: "20",
    isTemporarilyClosed: false,
    operating_hours: [
      { day: "Monday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Tuesday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Wednesday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Thursday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Friday", open: "07:00", close: "18:00", isClosed: false },
      { day: "Saturday", open: "08:00", close: "16:00", isClosed: false },
      { day: "Sunday", open: "", close: "", isClosed: true },
    ] as DayHours[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to update settings
    console.log("Updating settings:", settings);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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
            <Label htmlFor="logo_url">Shop Logo</Label>
            <div className="flex gap-2">
              <Input
                id="logo_url"
                type="url"
                placeholder="https://example.com/logo.jpg"
                value={settings.logo_url}
                onChange={(e) =>
                  setSettings({ ...settings, logo_url: e.target.value })
                }
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>
            {settings.logo_url && (
              <img
                src={settings.logo_url}
                alt="Shop logo"
                className="w-20 h-20 rounded-lg object-cover mt-2"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_permit_code">Business Permit Code *</Label>
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
            <p className="text-xs text-gray-500">
              Enter your business permit code for verification
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_radius">Delivery Radius (km) *</Label>
              <Input
                id="delivery_radius"
                type="number"
                step="0.1"
                min="0"
                placeholder="5"
                value={settings.delivery_radius}
                onChange={(e) =>
                  setSettings({ ...settings, delivery_radius: e.target.value })
                }
                required
              />
              <p className="text-xs text-gray-500">
                Maximum delivery distance from your location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_fee">Delivery Fee (₱) *</Label>
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
                required
              />
              <p className="text-xs text-gray-500">Standard delivery charge</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label
                htmlFor="isTemporarilyClosed"
                className="text-base cursor-pointer"
              >
                Temporarily Closed
              </Label>
              <p className="text-sm text-gray-500">
                Close your shop temporarily without affecting your account
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

      <div className="flex gap-3">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
