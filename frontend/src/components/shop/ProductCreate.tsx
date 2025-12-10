import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import * as shopApi from "@/lib/api/shop";
import { toast } from "sonner";

export default function ProductCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    items_name: "",
    items_category: "",
    items_price: "",
    items_description: "",
    photo_url: "",
    status: "available",
    stock: "0",
    preparation_time: "15",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await shopApi.addProduct({
        items_name: formData.items_name,
        items_description: formData.items_description,
        items_price: parseFloat(formData.items_price),
        items_category: formData.items_category,
        photo_url: formData.photo_url || undefined,
        status: formData.status,
        stock: parseInt(formData.stock),
        preparation_time: parseInt(formData.preparation_time),
      });
      
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.error || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate("/shop/products");
  };

  const handleAddAnother = () => {
    setShowSuccessDialog(false);
    setFormData({
      items_name: "",
      items_category: "",
      items_price: "",
      items_description: "",
      photo_url: "",
      status: "available",
      stock: "0",
      preparation_time: "15",
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/shop/products")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
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
                    onChange={(e) => setFormData({ ...formData, items_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="items_category">Category *</Label>
                  <Select
                    value={formData.items_category}
                    onValueChange={(value) => setFormData({ ...formData, items_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
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
                    placeholder="Describe your product..."
                    rows={4}
                    value={formData.items_description}
                    onChange={(e) => setFormData({ ...formData, items_description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                  Details & Pricing
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="items_price">Price (₱) *</Label>
                      <Input
                        id="items_price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
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
                        placeholder="0"
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
                        placeholder="15"
                        value={formData.preparation_time}
                        onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                        required
                      />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                  Product Image
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="photo_url">Photo URL (Optional)</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Enter image URL</p>
                </div>
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
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/shop/products")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Product Added Successfully!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your product has been added to the catalog. What would you like to do next?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <AlertDialogAction 
              onClick={handleAddAnother}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              Add Another Product
            </AlertDialogAction>
            <Button
                variant="outline"
                onClick={handleSuccessClose}
                className="w-full sm:w-auto mt-2 sm:mt-0"
            >
                Go to Products List
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
