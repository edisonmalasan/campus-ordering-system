const express = require("express");

const { handleLogin, handleAuthorize } = require(/* TODO: authController */);

const authRoutes = express.Router();
authRoutes.use(express.json);

authRoutes.post("/login", handleLogin);
authRoutes.post("/authorize", handleAuthorize);

export default authRoutes;
