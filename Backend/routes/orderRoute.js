const express = require("express");
const router = express.Router();
const {
  cancelOrder, successOrder
} = require("../controller/orderCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


router.put("/cancel/:orderId", cancelOrder);
router.put("/success/:orderId", successOrder);

module.exports = router;
