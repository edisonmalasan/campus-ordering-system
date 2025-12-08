import * as authService from "../../service/authService.js";

export const handleCustomerRegistration = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.registerCustomer(userData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleShopRegistration = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.registerShop(userData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleLogout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const handleGetCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token required",
      });
    }

    const { refreshAccessToken } = await import(
      "../../service/refreshService.js"
    );
    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
