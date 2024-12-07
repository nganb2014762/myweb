const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantityAdded: { type: Number, required: true },
        title: { type: String, required: true }, 
        price: { type: Number, required: true },
        brand: { type: String, required: true },        
        category: { type: String, required: true },
        sum: { type: Number }, // Sẽ được tính tự động
      },
    ],
    total: { type: Number }, // Tổng của tất cả các 'sum'
    note: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  },
  { timestamps: true }
);

stockSchema.pre("save", function (next) {
  this.products.forEach((product) => {
    product.sum = product.quantityAdded * product.price;
  });

  this.total = this.products.reduce((acc, product) => acc + product.sum, 0);

  next();
});

module.exports = mongoose.model("Stock", stockSchema);
