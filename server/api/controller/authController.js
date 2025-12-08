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

export const handleUpdatePassword = async (req, res) => {
  console.log("=== UPDATE PASSWORD ENDPOINT HIT ===");
  console.log("Request body:", req.body);
  console.log("User from token:", req.user);

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    const result = await authService.updatePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    const result = await authService.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { user: result.user },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleUpdateShopSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const settingsData = req.body;

    const result = await authService.updateShopSettings(userId, settingsData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { user: result.user },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
