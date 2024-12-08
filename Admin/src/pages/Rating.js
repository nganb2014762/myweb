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
  const [localRatings, setLocalRatings] = useState([]); 

  useEffect(() => {
    dispatch(getRatings()); 
  }, [dispatch]);

  useEffect(() => {
    setLocalRatings(ratings); 
  }, [ratings]);

  const showModal = (ratingId) => {
    setSelectedRatingId(ratingId);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRatingId(null);
  };

  const handleOk = () => {
    if (selectedRatingId) {
      dispatch(deleteRating(selectedRatingId))
        .then(() => {
          console.log("Rating deleted successfully");
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
    key: index + 1, 
    productName: rating.product, 
    user: rating.user, 
    star: rating.star, 
    content: rating.comment, 
    action: (
      <button
        className="btn btn-danger"
        onClick={() => showModal(rating.ratingId)} 
      >
        <AiFillDelete />
      </button>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Danh sách đánh giá</h3>
      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title="Xác nhận xóa"
        open={isModalOpen} 
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
