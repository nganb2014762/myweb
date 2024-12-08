import React, { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getRatings, deleteRating } from "../features/rating/ratingSlice";
import { AiFillDelete } from "react-icons/ai";

const Ratings = () => {
  const dispatch = useDispatch();
  const ratings = useSelector((state) => state.rating.ratings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const [localRatings, setLocalRatings] = useState([]); // State để quản lý danh sách đánh giá

  useEffect(() => {
    dispatch(getRatings()); // Lấy danh sách đánh giá từ API
  }, [dispatch]);

  useEffect(() => {
    setLocalRatings(ratings); // Đồng bộ state localRatings với Redux ratings
  }, [ratings]);

  // Hiển thị modal xác nhận
  const showModal = (ratingId) => {
    setSelectedRatingId(ratingId);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRatingId(null);
  };

  // Xử lý xóa sau khi xác nhận
  const handleOk = () => {
    if (selectedRatingId) {
      dispatch(deleteRating(selectedRatingId))
        .then(() => {
          console.log("Rating deleted successfully");
          // Cập nhật danh sách localRatings mà không cần reload
          setLocalRatings((prevRatings) =>
            prevRatings.filter((rating) => rating.ratingId !== selectedRatingId)
          );
        })
        .catch((error) => {
          console.error("Error deleting rating:", error);
        })
        .finally(() => {
          setIsModalOpen(false);
          setSelectedRatingId(null);
        });
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Người dùng",
      dataIndex: "user",
    },
    {
      title: "Số sao",
      dataIndex: "star",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
    },
  ];

  const dataSource = localRatings.map((rating, index) => ({
    key: index + 1, // Thứ tự
    productName: rating.product, // Tên sản phẩm
    user: rating.user, // Người dùng
    star: rating.star, // Số sao
    content: rating.comment, // Nội dung
    action: (
      <button
        className="btn btn-danger"
        onClick={() => showModal(rating.ratingId)} // Hiển thị modal khi nhấn nút
      >
        <AiFillDelete />
      </button>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Danh sách đánh giá</h3>
      <Table columns={columns} dataSource={dataSource} />

      {/* Modal Xác Nhận Xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen} // Sử dụng `open` thay vì `visible`
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
      </Modal>
    </div>
  );
};

export default Ratings;
