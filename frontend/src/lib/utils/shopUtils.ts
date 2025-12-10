import type { Shop } from "../api/customer";

export const getShopStatus = (shop: Shop) => {
  if (shop.isTemporarilyClosed) return { status: "Temporarily Closed", color: "gray" };

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const currentTime = now.getHours() * 60 + now.getMinutes(); 

  const todayHours = shop.operating_hours?.find((h: any) => h.day === currentDay);

  if (!todayHours || todayHours.isClosed) {
     return { status: "Closed", color: "red" };
  }

  if (!todayHours.open || !todayHours.close) {
      return { status: "Closed", color: "red" };
  }

  const [openHour, openMinute] = todayHours.open.split(":").map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);

  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  if (currentTime >= openTime && currentTime < closeTime) {
    return { status: "Open Now", color: "green" };
  } else {
    return { status: "Closed", color: "red" };
  }
};
