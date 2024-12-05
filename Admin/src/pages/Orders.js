import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "ID",
    dataIndex: "id", // Cột ID mới
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
  const [filterStatus, setFilterStatus] = useState("All"); // Lưu trạng thái được chọn để lọc
  const [filteredOrders, setFilteredOrders] = useState([]); // State để lưu danh sách đã lọc
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
    console.log("Fetching orders...");
    dispatch(getOrders(config3));
  }, [dispatch]);

  useEffect(() => {
    // Lọc đơn hàng dựa trên trạng thái được chọn
    const filtered = orderState?.filter(
      (order) => filterStatus === "All" || order.orderStatus === filterStatus
    );
    setFilteredOrders(filtered);
  }, [filterStatus, orderState]);

  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    dispatch(updateAOrder({ id: orderId, status: newStatus }));
  };

  console.log("Trạng thái lọc:", filterStatus); // Kiểm tra trạng thái lọc
  console.log("Dữ liệu đơn hàng ban đầu:", orderState); // Kiểm tra dữ liệu từ API
  console.log("Dữ liệu đơn hàng sau khi lọc:", filteredOrders); // Kiểm tra dữ liệu sau khi lọc

  const data1 = filteredOrders?.map((order, index) => ({
    key: index + 1,
    id: order?._id,
    name: order?.user?.name,
    product: <Link to={`/admin/order/${order?._id}`}>Chi tiết</Link>,
    amount: order?.totalPrice.toFixed(2),
    date: new Date(order?.createdAt).toLocaleString(),
    action: (
      <select
        value={order?.orderStatus} // Đảm bảo luôn dùng giá trị từ dữ liệu gốc
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
      <div className="mb-3">
        <label htmlFor="order-status" className="form-label">
          Lọc theo trạng thái:
        </label>
        <select
          id="order-status"
          className="form-control form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">Tất cả</option>
          <option value="Ordered">Đã đặt</option>
          <option value="Processed">Đang chuẩn bị hàng</option>
          <option value="Shipped">Đang vận chuyển</option>
          <option value="Cancelled">Hủy</option>
          <option value="Delivered">Thành công</option>
        </select>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Orders;
