const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel'); 

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

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId); 

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

const successOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    console.log(`Trạng thái đơn hàng hiện tại: ${order.orderStatus}`);
   

    // Cập nhật trạng thái đơn hàng thành "Delivered"
    order.orderStatus = 'Delivered';
    await order.save();
    console.log(`Cập nhật trạng thái đơn hàng thành "Delivered" thành công`);

    res.status(200).json({ message: 'Cập nhật đơn hàng thành công', order });
  } catch (error) {
    console.error('Lỗi khi xác nhận đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};



module.exports = {
  createOrder,
  successOrder,

  updateOrderStatus,
  cancelOrder,
};
