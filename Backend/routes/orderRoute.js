const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderCtrl");
const { protect, admin } = require("../middleware/authMiddleware");

// Tạo đơn hàng
router.post("/", protect, createOrder);

// Lấy đơn hàng của người dùng đã đăng nhập
router.get("/myorders", protect, getMyOrders);

// Lấy tất cả đơn hàng (admin)
router.get("/", protect, admin, getAllOrders);

// Cập nhật trạng thái đơn hàng (admin)
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
