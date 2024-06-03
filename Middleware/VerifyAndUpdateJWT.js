const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const verifyAndUpdateJWTIfNeeded = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken || !refreshToken) {
    res.status(401);
    throw new Error("Both tokens are required");
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await userModel.findMatchingRefreshToken(refreshToken);
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      if (user._id.toString() !== decodedRefreshToken.id) {
        res.status(401);
        throw new Error("Refresh token payload does not match");
      }
      const newAccessToken = jwt.sign(
        { id: user._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { id: user._id.toString() },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      req.userId = user._id;
      next();
    } else {
      res.status(401);
      throw new Error("Invalid access token");
    }
  }
});

module.exports = verifyAndUpdateJWTIfNeeded;
