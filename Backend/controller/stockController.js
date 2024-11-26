const Stock = require("../models/stockModel");
const Product = require("../models/productModel");

exports.addStockEntry = async (req, res) => {
    try {
      const { date, items } = req.body;
  
      // Lưu thông tin phiếu nhập kho
      const stockEntry = await StockEntry.create({ date, items });
  
      // Cập nhật số lượng tồn kho cho từng sản phẩm
      for (let item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }
  
      res.status(201).json({ success: true, stockEntry });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Lấy lịch sử nhập kho
exports.getStockHistory = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("product", "title").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
