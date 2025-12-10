import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import * as shopApi from "@/lib/api/shop";
import { toast } from "sonner";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    items_name: "",
    items_category: "",
    items_price: "",
    items_description: "",
    photo_url: "",
    status: true,
    stock: "0",
    preparation_time: "15",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await shopApi.getProducts();
        const product = response.data.find((p: any) => p._id === id);
        if (product) {
          setFormData({
            items_name: product.items_name,
            items_category: product.items_category,
            items_price: product.items_price.toString(),
            items_description: product.items_description,
            photo_url: product.photo_url || "",
            status: product.status === "available",
            stock: (product.stock || 0).toString(),
            preparation_time: (product.preparation_time || 15).toString(),
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      await shopApi.updateProduct(id, {
        items_name: formData.items_name,
        items_description: formData.items_description,
        items_price: parseFloat(formData.items_price),
        items_category: formData.items_category,
        photo_url: formData.photo_url || undefined,
        status: formData.status ? "available" : "unavailable",
        stock: parseInt(formData.stock),
        preparation_time: parseInt(formData.preparation_time),
      });
      toast.success("Product updated successfully");
      navigate("/shop/products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.error || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/shop/products")}>
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
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="items_name">Product Name *</Label>
                <Input
                  id="items_name"
                  value={formData.items_name}
                  onChange={(e) => setFormData({ ...formData, items_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items_category">Category *</Label>
                <Select value={formData.items_category} onValueChange={(value) => setFormData({ ...formData, items_category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Snack">Snack</SelectItem>
                    <SelectItem value="Drink">Drink</SelectItem>
                    <SelectItem value="Rice Meals">Rice Meals</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="items_description">Description *</Label>
                <Textarea
                  id="items_description"
                  rows={4}
                  value={formData.items_description}
                  onChange={(e) => setFormData({ ...formData, items_description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Details & Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="items_price">Price (₱) *</Label>
                  <Input
                    id="items_price"
                    type="number"
                    step="0.01"
                    value={formData.items_price}
                    onChange={(e) => setFormData({ ...formData, items_price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preparation_time">Preparation Time (mins) *</Label>
                <Input
                  id="preparation_time"
                  type="number"
                  value={formData.preparation_time}
                  onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Product Image</h3>
              <div className="space-y-2">
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Availability</h3>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status ? "true" : "false"}
                  onValueChange={(value) => setFormData({ ...formData, status: value === "true" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/shop/products")} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
