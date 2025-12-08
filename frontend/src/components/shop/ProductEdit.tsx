import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    items_name: "Chicken Adobo Rice",
    items_category: "Main Course",
    items_price: "75.00",
    stock: "50",
    items_description:
      "Delicious Filipino-style chicken adobo served with steamed rice",
    preparation_time: "15",
    photo_url: "https://example.com/adobo.jpg",
    status: "available",
  });

  useEffect(() => {
    // TODO: Fetch product data by ID
    console.log("Editing product ID:", id);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to update product
    console.log("Updating product:", formData);
    navigate("/shop/products");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/shop/products")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="items_name">Product Name *</Label>
                <Input
                  id="items_name"
                  placeholder="e.g. Chicken Adobo Rice"
                  value={formData.items_name}
                  onChange={(e) =>
                    setFormData({ ...formData, items_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="items_category">Category *</Label>
                <Select
                  value={formData.items_category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, items_category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Beverage">Beverage</SelectItem>
                    <SelectItem value="Noodles">Noodles</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items_description">Description *</Label>
                <Textarea
                  id="items_description"
                  placeholder="Describe your product..."
                  rows={4}
                  value={formData.items_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      items_description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Pricing & Inventory
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="items_price">Price (₱) *</Label>
                  <Input
                    id="items_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.items_price}
                    onChange={(e) =>
                      setFormData({ ...formData, items_price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation_time">Prep Time (min) *</Label>
                  <Input
                    id="preparation_time"
                    type="number"
                    placeholder="15"
                    value={formData.preparation_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preparation_time: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Estimated preparation time
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Product Image
              </h3>

              <div className="space-y-2">
                <Label htmlFor="photo_url">Photo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="photo_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.photo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, photo_url: e.target.value })
                    }
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter image URL or upload a file
                </p>
              </div>

              {formData.photo_url && (
                <div className="mt-2">
                  <img
                    src={formData.photo_url}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Availability
              </h3>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="sold_out">Sold Out</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Control product visibility and availability
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" /> Update Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/shop/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
