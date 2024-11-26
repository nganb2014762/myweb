const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantityAdded: { type: Number, required: true },
      },
    ],
    note: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người nhập (nếu cần)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
