const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");

// Tạo đơn hàng mới
const createOrder = asyncHandler(async (req, res) => {
    const {
      shippingInfo,
      paymentInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
    } = req.body;
  
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng." });
    }
  
    // Tạo đơn hàng
    const order = new Order({
      user: req.user._id, // Lấy từ user đã xác thực
      shippingInfo,
      paymentInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paidAt: paymentInfo.method === "COD" ? Date.now() : null, // Nếu là COD thì cập nhật paidAt
    });
  
    const createdOrder = await order.save();
  
    res.status(201).json(createdOrder);
  });
  

// Lấy thông tin đơn hàng của người dùng đã đăng nhập
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    console.log(`Fetching orders for user ID: ${req.user._id}`);
    const orders = await Order.find({ user: req.user._id });
    
    if (!orders || orders.length === 0) {
      console.warn(`No orders found for user ID: ${req.user._id}`);
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    console.log(`Orders found: ${orders.length}`);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đơn hàng." });
  }
});

// Lấy thông tin tất cả đơn hàng (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "firstname lastname email");
  res.status(200).json(orders);
});

// Cập nhật trạng thái đơn hàng (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.orderStatus || order.orderStatus;

    if (order.orderStatus === "Delivered") {
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Không tìm thấy đơn hàng." });
  }
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
