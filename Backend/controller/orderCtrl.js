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
  const order = await Order.findById(req.params.orderId).populate('orderItems.product'); // Populate để lấy thông tin sản phẩm

  if (order) {
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng đã giao." });
    }

    // Cập nhật trạng thái đơn hàng thành "Cancelled"
    order.orderStatus = "Cancelled";

    // Tăng số lượng kho cho từng sản phẩm trong đơn hàng
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product._id);
      if (product) {
        console.log(`Kiểm tra sản phẩm: ${product.title} - Số lượng hiện tại: ${product.quantity}`);
        
        // Tăng số lượng kho và giảm số lượng đã bán
        product.quantity += item.quantity;
        product.sold -= item.quantity;

        // Đảm bảo số lượng đã bán không giảm dưới 0
        if (product.sold < 0) {
          product.sold = 0;
        }

        await product.save();
        console.log(`Cập nhật số lượng kho cho sản phẩm: ${product.title}. Số lượng hiện tại: ${product.quantity}`);
      }
    }

    const cancelledOrder = await order.save();
    res.json({ message: 'Đơn hàng đã được hủy và số lượng kho được cập nhật thành công.', cancelledOrder });
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
    order.paymentInfo.paymentStatus = 'Đã thanh toán';
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
