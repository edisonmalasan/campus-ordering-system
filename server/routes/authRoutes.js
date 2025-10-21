const express = require('express');

const { handleLogin, handleAuthorize} = require("../controller/authController.js")

const authRoutes = express.Router();
authRoutes.use(express.json);

authRoutes.post("/login", handleLogin);
authRoutes.post("/authorize", handleAuthorize);

module.exports = authRoutes;