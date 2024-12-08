const express = require("express");
const Stock = require("../models/stockModel");
const Product = require("../models/productModel");

const router = express.Router();

router.post("/add-stock", async (req, res) => {
  const { products, note } = req.body; // Nhận danh sách sản phẩm và ghi chú

  try {
    console.log("Dữ liệu nhận từ frontend:", req.body);
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const stockEntries = []; // Danh sách sản phẩm thêm vào phiếu nhập kho
    const productUpdates = []; // Danh sách cập nhật sản phẩm

    for (const { productId, quantityAdded, price } of products) {
      console.log(`Xử lý sản phẩm: ${productId}, số lượng: ${quantityAdded}, giá: ${price}`);
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Sản phẩm ${productId} không tồn tại` });
      }
    
      // Cập nhật số lượng sản phẩm
      product.quantity += quantityAdded;
    
      // Cập nhật giá sản phẩm (chỉ cập nhật nếu có giá mới từ frontend)
      if (price) {
        product.price = price;
      }
    
      // Thêm sản phẩm vào danh sách cần cập nhật
      productUpdates.push(product.save());
    
      // Lưu thông tin phiếu nhập kho vào mảng
      stockEntries.push({
        product: productId,
        title: product.title,
        brand: product.brand,
        category: product.category,
        price, // Lấy giá từ frontend để lưu vào phiếu nhập kho
        quantityAdded,
      });
    } 

    const stock = await Stock.create({
      products: stockEntries,
      note,
    });

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
      .populate("products.product", "title") 
      .sort("-createdAt");
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
});

// Lấy tổng chi phí nhập hàng theo tháng
router.get("/monthly-stock-cost", async (req, res) => {
  try {
    // Tính tổng chi phí nhập hàng theo tháng từ bảng Stock
    const monthlyStockCost = await Stock.aggregate([
      { $unwind: "$products" }, // Tách các sản phẩm trong phiếu nhập kho
      {
        $project: {
          month: { $month: "$createdAt" }, // Lấy tháng của phiếu nhập kho
          sum: "$products.sum", // Lấy chi phí nhập hàng từ 'sum' của mỗi sản phẩm
        },
      },
      {
        $group: {
          _id: "$month", // Nhóm theo tháng
          totalCost: { $sum: "$sum" }, // Cộng tổng chi phí nhập hàng cho mỗi tháng
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo tháng
    ]);

    // Trả về tổng chi phí nhập hàng theo tháng
    const result = Array(12).fill(0); // Khởi tạo mảng với 12 tháng
    monthlyStockCost.forEach((item) => {
      result[item._id - 1] = item.totalCost; // Gán chi phí vào tháng tương ứng
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lấy chi phí nhập hàng", error });
  }
});


module.exports = router;
