export interface FoodItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  shopId?: string; // Optional for now, to link to shops later
}

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Pepperoni Cheese Pizza",
    price: 120.99,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Snack",
  },
  {
    id: 2,
    name: "Classic Beef Burger",
    price: 80.99,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Snack",
  },
  {
    id: 3,
    name: "Chicken Fried Rice",
    price: 95.00,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Rice Meals",
  },
  {
    id: 4,
    name: "Mango Smoothie",
    price: 65.00,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Drink",
  },
  {
    id: 5,
    name: "Chocolate Cake Slice",
    price: 75.00,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Desserts",
  },
  {
    id: 6,
    name: "Caesar Salad",
    price: 110.00,
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/03/10/0/FNK_BEST-CHICKEN-AND-RICE-H_s4x3.jpg.rend.hgtvcom.791.594.85.suffix/1583851621211.webp",
    category: "Snack",
  },
  // Additional Items for StoreMenu specific items
  {
    id: 7,
    name: "Cola",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Drink",
  },
  {
    id: 8,
    name: "Donut Box",
    price: 11.04,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Desserts",
  },
  {
    id: 9,
    name: "Jumbo Beef Burger",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Snack",
  },
  {
    id: 10,
    name: "Cheese Fries",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1585109649139-36680186c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Snack",
  },
];
