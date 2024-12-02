import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "name",
  },
  {
    title: "Sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
  },
  {
    title: "Ngày đặt",
    dataIndex: "date",
  },
  {
    title: "Trạng thái",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config3 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getOrders(config3));
  }, [dispatch]);

  const updateOrderStatus = (orderId, newStatus) => {
    dispatch(updateAOrder({ id: orderId, status: newStatus }));
  };

  const data1 = orderState?.map((order, index) => ({
    key: index + 1,
    name: order?.user?.name,
    product: <Link to={`/admin/order/${order?._id}`}>Chi tiết</Link>,
    amount: order?.totalPrice.toFixed(2),
    date: new Date(order?.createdAt).toLocaleString(),
    action: (
      <select
        defaultValue={order?.orderStatus}
        onChange={(e) => updateOrderStatus(order?._id, e.target.value)}
        className="form-control form-select"
      >
        <option value="Ordered" disabled>
          Đã đặt
        </option>
        <option value="Processed">Đang chuẩn bị hàng</option>
        <option value="Shipped">Đang vận chuyển</option>
        <option value="Cancelled">Hủy</option>
        <option value="Delivered">Thành công</option>
      </select>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Đơn hàng</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Orders;
