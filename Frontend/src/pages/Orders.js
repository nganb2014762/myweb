import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrders,
  cancelOrder,
  successOrder,
} from "../features/user/userSlice";

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const dispatch = useDispatch();
  const orderState = useSelector(
    (state) => state?.auth?.getorderedProduct?.orders
  );

  const filteredOrders = orderState?.filter(
    (order) => filterStatus === "All" || order.orderStatus === filterStatus
  );

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getOrders(config2));
  }, []);

  const translateStatus = (status) => {
    switch (status) {
      case "Ordered":
        return "Đã đặt";
      case "Processed":
        return "Đang chuẩn bị hàng";
      case "Shipped":
        return "Đang vận chuyển";
      case "Cancelled":
        return "Hủy";
      case "Delivered":
        return "Thành công";
      default:
        return status;
    }
  };

  const handleCancelOrder = (orderId) => {
    const url = `http://localhost:5000/api/orders/cancel/${orderId}`;
    console.log(url);
    dispatch(cancelOrder({ orderId, config: config2 }))
      .then(() => {
        alert("Đơn hàng đã được hủy thành công!");
        dispatch(getOrders(config2));
      })
      .catch((error) => {
        console.error("Hủy đơn hàng thất bại:", error);
      });
  };

  const handleSuccessOrder = (orderId) => {
    dispatch(successOrder({ orderId, config: config2 }))
      .then((response) => {
        if (response.type.endsWith("/fulfilled")) {
          alert("Xác nhận đã nhận hàng thành công!");
        } else {
          alert(response.payload.message || "Xác nhận nhận hàng thất bại!");
        }
        dispatch(getOrders(config2));
      })
      .catch((error) => {
        console.error("Xác nhận nhận hàng thất bại:", error);
      });
  };

  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <BreadCrumb title="Đơn hàng của tôi" />

      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="filter-bar my-3">
          <label htmlFor="order-status" style={{ marginRight: "10px" }}>
            Lọc theo trạng thái:
          </label>
          <select
            id="order-status"
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "200px", display: "inline-block" }}
          >
            <option value="All">Tất cả</option>
            <option value="Ordered">Đã đặt</option>
            <option value="Processed">Đang chuẩn bị hàng</option>
            <option value="Shipped">Đang vận chuyển</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Delivered">Thành công</option>
          </select>
        </div>

        <div className="row">
          {filteredOrders  &&
            filteredOrders.map((item, index) => (
              <div
                className="row pt-3 my-3"
                key={index}
                style={{
                  border: "1px solid #077a33",
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th
                            colSpan="3"
                            style={{
                              fontWeight: "bold",
                              borderBottom: "none",
                            }}
                          >
                            STT: {index + 1}
                          </th>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>
                            Ngày đặt hàng:{" "}
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>
                            Phương thức thanh toán: {item?.paymentInfo?.method}
                          </td>
                        </tr>
                        <tr>
                          <th
                            style={{
                              width: "70%",
                              borderBottom: "none",
                            }}
                          >
                            Tên sản phẩm
                          </th>
                          <th
                            style={{
                              width: "15%",
                              borderBottom: "none",
                            }}
                          >
                            Số lượng
                          </th>
                          <th
                            style={{
                              width: "15%",
                              borderBottom: "none",
                            }}
                          >
                            Giá
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {item?.orderItems?.map((i, idx) => (
                          <tr key={idx}>
                            <td
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {i?.product?.title}
                            </td>
                            <td>{i?.quantity}</td>
                            <td>
                              {item?.paymentInfo?.method === "PayPal"
                                ? i?.price
                                : formatVND(i?.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="table-responsive">
                    <table
                      className="table"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold", width: "30%" }}>
                            Tạm tính:
                          </td>
                          <td style={{ width: "70%" }}>
                            {item?.paymentInfo?.method === "PayPal"
                              ? item?.totalPriceAfterDiscount
                              : formatVND(item?.totalPriceAfterDiscount)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", width: "30%" }}>
                            Tổng giá:
                          </td>
                          <td style={{ width: "70%" }}>
                            {item?.paymentInfo?.method === "PayPal"
                              ? item?.totalPrice
                              : formatVND(item?.totalPrice)}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ fontWeight: "bold", width: "30%" }}>
                            Trạng thái:
                          </td>
                          <td style={{ width: "70%" }}>
                            {translateStatus(item?.orderStatus)}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan="2">
                            {["Ordered", "Processed"].includes(
                              item?.orderStatus
                            ) ? (
                              <button
                                className="btn btn-danger"
                                onClick={() => handleCancelOrder(item._id)}
                              >
                                Hủy đơn hàng
                              </button>
                            ) : (
                              <button className="btn btn-secondary" disabled>
                                Không thể hủy
                              </button>
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan="2">
                            {item?.orderStatus === "Shipped" && (
                              <button
                                className="btn btn-success"
                                onClick={() => handleSuccessOrder(item._id)}
                              >
                                Đã nhận được hàng
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Container>
    </>
  );
};

export default Orders;
