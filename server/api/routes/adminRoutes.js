import express from "express";
import {
  getPendingShops,
  getAllShops,
  approveShop,
  rejectShop,
  getAllCustomers,
  getAllUsers,
  getDashboardStats,
} from "../controller/adminController.js";
import { validateToken } from "../../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(validateToken());
adminRouter.get("/dashboard/stats", getDashboardStats);
adminRouter.get("/shops/pending", getPendingShops);
adminRouter.get("/shops", getAllShops);
adminRouter.put("/shops/:id/approve", approveShop);
adminRouter.put("/shops/:id/reject", rejectShop);
adminRouter.get("/customers", getAllCustomers);
adminRouter.get("/users", getAllUsers);
export default adminRouter;
