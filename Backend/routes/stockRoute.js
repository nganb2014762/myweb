const express = require("express");
const Stock = require("../models/stockModel");
const Product = require("../models/productModel");

const router = express.Router();

// Tạo phiếu nhập kho và cập nhật số lượng sản phẩm
router.post("/add-stock", async (req, res) => {
  const { products, note } = req.body; // Nhận danh sách sản phẩm và ghi chú

  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const stockEntries = []; // Danh sách sản phẩm thêm vào phiếu nhập kho
    const productUpdates = []; // Danh sách cập nhật sản phẩm

    // Lặp qua danh sách sản phẩm và thêm vào phiếu nhập kho
    for (const { productId, quantityAdded } of products) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Sản phẩm ${productId} không tồn tại` });
      }

      // Cập nhật số lượng sản phẩm
      product.quantity += quantityAdded;
      productUpdates.push(product.save());

      // Lưu thông tin phiếu nhập kho vào mảng
      stockEntries.push({
        product: productId,
        quantityAdded,
      });
    }

    // Tạo phiếu nhập kho với thông tin các sản phẩm được nhập
    const stock = await Stock.create({
      products: stockEntries,
      note,
    });

    // Đợi tất cả các cập nhật sản phẩm hoàn tất
    await Promise.all(productUpdates);

    res.status(201).json({
      message: "Phiếu nhập kho được tạo thành công",
      stock,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
});

// Lấy danh sách phiếu nhập kho
router.get("/stock-history", async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate("products.product", "title") // Populate tên sản phẩm
      .sort("-createdAt");
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
});

module.exports = router;
