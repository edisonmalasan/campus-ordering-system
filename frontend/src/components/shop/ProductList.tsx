import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock product data with backend schema fields
  const products = [
    {
      id: 1,
      items_name: "Chicken Adobo Rice",
      items_category: "Main Course",
      items_price: 75.0,
      stock: 50,
      status: "available",
      preparation_time: 15,
      photo_url: "https://example.com/adobo.jpg",
    },
    {
      id: 2,
      items_name: "Pancit Canton",
      items_category: "Noodles",
      items_price: 60.0,
      stock: 30,
      status: "available",
      preparation_time: 10,
      photo_url: "",
    },
    {
      id: 3,
      items_name: "Lumpia Shanghai (5pcs)",
      items_category: "Appetizer",
      items_price: 45.0,
      stock: 5,
      status: "available",
      preparation_time: 8,
      photo_url: "",
    },
    {
      id: 4,
      items_name: "Halo-Halo",
      items_category: "Dessert",
      items_price: 55.0,
      stock: 0,
      status: "sold_out",
      preparation_time: 5,
      photo_url: "",
    },
    {
      id: 5,
      items_name: "Iced Coffee",
      items_category: "Beverage",
      items_price: 40.0,
      stock: 100,
      status: "available",
      preparation_time: 3,
      photo_url: "",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.items_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.items_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: {
        label: "Available",
        className: "bg-green-100 text-green-700 hover:bg-green-100",
      },
      unavailable: {
        label: "Unavailable",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
      },
      sold_out: {
        label: "Sold Out",
        className: "bg-red-100 text-red-700 hover:bg-red-100",
      },
      hidden: {
        label: "Hidden",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/shop/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Prep Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.photo_url ? (
                      <img
                        src={product.photo_url}
                        alt={product.items_name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Image className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {product.items_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.items_category}
                  </td>
                  <td className="px-4 py-3">
                    ₱{product.items_price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock <= 10 ? "text-orange-600 font-medium" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.preparation_time} min
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/shop/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
