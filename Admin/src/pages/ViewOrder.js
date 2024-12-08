import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { BiEdit } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getaOrder } from "../features/auth/authSlice";
import { HiOutlineArrowLeft } from "react-icons/hi";
const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Hình ảnh",
    dataIndex: "img",
    render: (img) => (
      <img
        src={img}
        alt="product"
        style={{ width: "120px", height: "150px", objectFit: "cover" }}
      />
    ),
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Phân loại",
    dataIndex: "category",
  },
  {
    title: "Số lượng",
    dataIndex: "count",
  },
  {
    title: "Giá tiền",
    dataIndex: "amount",
  },
];


const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getaOrder(orderId));
  }, []);
  const orderState = useSelector((state) => state?.auth?.singleorder?.orders);
  console.log(orderState);
  const data1 = [];
  for (let i = 0; i < orderState?.orderItems?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState?.orderItems[i]?.title,
      img: orderState?.orderItems[i]?.images[0]?.url,
      brand: orderState?.orderItems[i]?.brand,
      category: orderState?.orderItems[i]?.category,
      count: orderState?.orderItems[i]?.quantity,
      amount: orderState?.orderItems[i]?.price,
      
    });
  }
  return (
    <div>
      <h3 className="mb-4 title">Chi tiết đơn</h3>
      <Link to="/admin/orders" className="d-flex align-items-center gap-10">
        <HiOutlineArrowLeft className="fs-4" />
      </Link>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default ViewOrder;
