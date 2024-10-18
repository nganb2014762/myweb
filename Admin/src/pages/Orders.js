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
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const orderState = useSelector((state) => state?.auth?.orders.orders);

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.user?.firstname,

      product: (
        <Link to={`/admin/order/${orderState[i]?._id}`}>Chi tiết</Link>
      ),
      amount: orderState[i]?.totalPrice,
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      action: (
        <>
          <select
            name=""
            defaultValue={orderState[i]?.orderStatus}
            onChange={(e) =>
              updateOrderStatus(orderState[i]?._id, e.target.value)
            }
            className="form-control form-select"
            id=""
          >
            <option value="Ordered" disabled selected>
              Đã đặt
            </option>

            <option value="Processed">Đang chuẩn bị hàng</option>
            <option value="Shipped">Đang vận chuyển</option>
            <option value="Out for Delivery">Hủy</option>
            <option value="Delivered">Thành công</option>
          </select>
        </>
      ),
    });
  }

  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }));
  };
  return (
    <div>
      <h3 className="mb-4 title">Đơn hàng</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;
