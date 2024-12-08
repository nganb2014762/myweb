const express = require("express");
const Product = require("../models/productModel");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);
router.post("/update-top-selling-tags", async (req, res) => {
  try {
    const topSellingProducts = await Product.find().sort({ sold: -1 }).limit(5);

    await Product.updateMany({ tags: "Bán chạy nhất" }, { $set: { tags: "" } });

    const promises = topSellingProducts.map((product) =>
      Product.findByIdAndUpdate(product._id, { $set: { tags: "Bán chạy nhất" } })
    );
    await Promise.all(promises);

    res.status(200).json({ message: "Top selling tags updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error updating top selling tags" });
  }
});
module.exports = router;
