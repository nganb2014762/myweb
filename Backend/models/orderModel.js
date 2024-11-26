const mongoose = require("mongoose"); // Erase if already required

// Khai báo Schema của mô hình Mongo
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      
      pincode: {
        type: Number,
        required: true,
      },
    },
    paymentInfo: {
      method: { // Thêm phương thức thanh toán
        type: String,
        enum: ["PayPal", "COD"],
        required: true,
      },
      paypalOrderId: {
        type: String,
      },
      paypalPaymentId: {
        type: String,
      },
      payerId: {
        type: String,
      },
      payerEmail: {
        type: String,
      },
      paymentStatus: {
        type: String,
        default: "Pending", 
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paidAt: {
      type: Date,
    },
    month: {
      type: Number,
      default: new Date().getMonth(),
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Ordered",
    },
  },
  {
    timestamps: true,
  }
);

// Xuất mô hình
module.exports = mongoose.model("Order", orderSchema);
