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

// Hủy đơn hàng
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId); // Sử dụng req.params.orderId

  if (order) {
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng đã giao." });
    }

    order.orderStatus = "Cancelled";
    const cancelledOrder = await order.save();
    res.json(cancelledOrder);
  } else {
    res.status(404).json({ message: "Không tìm thấy đơn hàng." });
  }
});


module.exports = {
  createOrder,

  updateOrderStatus,
  cancelOrder,
};
