const express = require("express");
const { getRatings, deleteRating } = require("../controller/ratingCtrl");

const router = express.Router();

// Route để lấy danh sách ratings
router.get("/", getRatings);
router.delete("/:id", deleteRating); 

module.exports = router;
