// Import local assets
import emersonLogo from "@/assets/shops/Emerson-Canteen.png";
import onTheGoLogo from "@/assets/shops/On-The-Go.png";
import seminaryLogo from "@/assets/shops/Seminary-Canteen.png";

export interface Shop {
  _id: string;
  shop_name: string;
  description: string;
  logo_url: string;
  status: "verified" | "pending" | "rejected";
}

export const shops: Shop[] = [
  {
    _id: "1",
    shop_name: "On the Go Cafe",
    description: "Fresh fuel for bright minds. Offering sustainable salads, quick wraps, and organic coffee to keep you energized through your next lecture.",
    logo_url: onTheGoLogo,
    status: "verified",
  },
  {
    _id: "2",
    shop_name: "Seminary Canteen",
    description: "Divine flavors in a peaceful setting. Best known for wholesome, home-cooked meals and a quiet atmosphere perfect for a study break.",
    logo_url: seminaryLogo,
    status: "verified",
  },
  {
    _id: "3",
    shop_name: "Emerson Canteen",
    description: "Friendly faces and hearty portions. Stop by for our famous grilled burgers, classic comfort food, and a warm welcome from Emerson himself!",
    logo_url: emersonLogo,
    status: "verified",
  },
  {
    _id: "4",
    shop_name: "On the Go Cafe", // Duplicate for demo purposes
    description: "Fresh fuel for bright minds. Offering sustainable salads, quick wraps, and organic coffee to keep you energized through your next lecture.",
    logo_url: onTheGoLogo,
    status: "verified",
  },
  {
    _id: "5",
    shop_name: "Seminary Canteen",
    description: "Divine flavors in a peaceful setting. Best known for wholesome, home-cooked meals and a quiet atmosphere perfect for a study break.",
    logo_url: seminaryLogo,
    status: "verified",
  },
  {
    _id: "6",
    shop_name: "Emerson Canteen",
    description: "Friendly faces and hearty portions. Stop by for our famous grilled burgers, classic comfort food, and a warm welcome from Emerson himself!",
    logo_url: emersonLogo,
    status: "verified",
  },
];
