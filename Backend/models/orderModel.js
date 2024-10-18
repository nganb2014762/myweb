// const mongoose = require("mongoose"); // Erase if already required

// // Khai báo Schema của mô hình Mongo
// var orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     shippingInfo: {
//       firstname: {
//         type: String,
//         required: true,
//       },
//       lastname: {
//         type: String,
//         required: true,
//       },
//       address: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       other: {
//         type: String,
//       },
//       pincode: {
//         type: Number,
//         required: true,
//       },
//     },
//     paymentInfo: {
//       paypalOrderId: {
//         type: String,
//         required: true,
//       },
//       paypalPaymentId: {
//         type: String,
//         required: true,
//       },
//       payerId: { // Trường mới để lưu PayPal payer ID
//         type: String,
//       },
//       payerEmail: { // Trường mới để lưu email của người thanh toán
//         type: String,
//       },
//       paymentStatus: {
//         type: String,
//         default: "Pending", // trạng thái thanh toán ban đầu
//       },
//       currency: { // Trường mới để lưu đơn vị tiền tệ trong giao dịch
//         type: String,
//         default: "USD",
//       },
//     },
//     orderItems: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         color: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Color",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     paidAt: {
//       type: Date,
//       default: Date.now(),
//     },
//     month: {
//       type: Number,
//       default: new Date().getMonth(),
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     totalPriceAfterDiscount: {
//       type: Number,
//       required: true,
//     },
//     orderStatus: {
//       type: String,
//       default: "Ordered",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Xuất mô hình
// module.exports = mongoose.model("Order", orderSchema);
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
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
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
      state: {
        type: String,
        required: true,
      },
      other: {
        type: String,
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
