const express = require("express");

const { validateToken } = require(/* TODO: authMiddleware.js */);

const {
  handleGetMembers,
  handlePostMembers,
  handlePutMembers,
  handleDeleteMembers,
  handleGetCount,
} = require(/* TODO: memberController.js */);

const memberRoutes = express.Router();
memberRoutes.use(express.json());

memberRoutes.get("/", validateToken("admin"), handleGetMembers);
memberRoutes.post(
  "/",
  validateToken("guest", "admin", "superuser"),
  handlePostMembers
);
memberRoutes.put(
  "/:id",
  validateToken("guest", "admin", "superuser"),
  handlePutMembers
);
memberRoutes.get("/count", validateToken(""), handleGetCount);

// TODO: other routes

export default memberRoutes;
