const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  cancelOrder, 
} = require("../controller/orderCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


router.put("/cancel/:orderId", cancelOrder);

module.exports = router;
