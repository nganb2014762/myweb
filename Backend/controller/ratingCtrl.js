const Product = require("../models/productModel");
const mongoose = require("mongoose");
// Lấy danh sách đánh giá sản phẩm và populate thông tin người dùng và sản phẩm
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Product.aggregate([
      { $unwind: "$ratings" }, // Tách mảng ratings thành các phần tử riêng lẻ
      {
        $lookup: {
          from: "users",
          localField: "ratings.postedby",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: { $ifNull: ["$userDetails.name", "N/A"] },
          star: "$ratings.star",
          comment: "$ratings.comment",
          product: "$title", // Trả tên sản phẩm từ chính document
          ratingId: "$ratings._id", // Trả về ID đánh giá
        },
      },
    ]);
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rating ID" });
    }

    const result = await Product.updateOne(
      { "ratings._id": id },
      { $pull: { ratings: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRating:", error);
    res.status(500).json({ error: error.message });
  }
};
