const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded); // Log decoded để kiểm tra

        const user = await User.findById(decoded?.id);
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        req.user = user;
        next();
      }
    } catch (error) {
      console.error("Lỗi khi xác thực:", error); // Log lỗi
      throw new Error("Đã hết phiên đăng nhập. Vui lòng đăng nhập lại!");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (!adminUser || adminUser.role !== "admin") {
    throw new Error("Bạn không phải là admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
