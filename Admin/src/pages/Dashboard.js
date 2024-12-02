import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyData, getOrders } from "../features/auth/authSlice";

const columns = [
  { title: "Tên khách hàng", dataIndex: "name" },
  { title: "Số lượng", dataIndex: "product" },
  { title: "Tạm tính", dataIndex: "price" },
  { title: "Tổng", dataIndex: "dprice" },
  { title: "Trạng thái", dataIndex: "staus" },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

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
    dispatch(getMonthlyData(config3));
    dispatch(getOrders(config3));
  }, [dispatch]);

  useEffect(() => {
    let monthNames = [
      "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12",
    ];
  
    // Xử lý số lượng đơn hàng và doanh thu theo tháng từ orderState
    let monthlyOrderCount = Array(12).fill(0);
    let monthlyRevenueCount = Array(12).fill(0);
  
    orderState?.forEach((order) => {
      const month = new Date(order.createdAt).getMonth(); // Tháng từ 0 đến 11
  
      if (order.orderStatus === "Delivered") {
        // Tăng số lượng đơn hàng theo tháng
        monthlyOrderCount[month] += 1;
  
        // Cộng doanh thu vào tháng tương ứng, áp dụng điều kiện PayPal
        let revenue = order.totalPriceAfterDiscount;
        if (order.paymentInfo.method === "PayPal") {
          revenue = (order.totalPriceAfterDiscount / 0.000039).toFixed(2);
        }
        monthlyRevenueCount[month] += parseFloat(revenue); // Chuyển đổi sang số để cộng dồn
      }
    });
  
    // Cập nhật dữ liệu cho biểu đồ số đơn hàng
    const dataMonthlySales = monthNames.map((month, index) => {
      return {
        type: month,
        income: monthlyOrderCount[index] || 0,
      };
    });
    setDataMonthlySales(dataMonthlySales);
  
    // Cập nhật dữ liệu cho biểu đồ doanh thu
    const dataMonthlyRevenue = monthNames.map((month, index) => {
      return {
        type: month,
        income: monthlyRevenueCount[index] || 0,
      };
    });
    setDataMonthly(dataMonthlyRevenue);
  
    // Xử lý chi tiết đơn hàng
    let totalRevenue = 0;
    const orderList = orderState?.map((order, index) => {
      let adjustedPrice =
        order.paymentInfo.method === "PayPal"
          ? (order.totalPriceAfterDiscount / 0.000039).toFixed(2)
          : order.totalPriceAfterDiscount.toFixed(2);
  
      if (order.orderStatus === "Delivered") {
        totalRevenue += order.totalPriceAfterDiscount;
      }
  
      return {
        key: index + 1,
        name: order.user.name,
        product: order.orderItems?.length,
        price: order.totalPrice.toFixed(2),
        dprice: adjustedPrice,
        staus: order.orderStatus,
      };
    });
  
    setOrderData(orderList || []);
    setTotalRevenue(totalRevenue.toFixed(2));
  }, [orderState]);
  
   

  // Config cho biểu đồ doanh thu
  const configRevenue = {
    data: dataMonthly,
    xField: "type",
    yField: "income",
    color: "#ffd333",
    label: {
      position: "middle",
      style: { fill: "#121111", opacity: 1 },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  // Config cho biểu đồ số đơn hàng
  const configOrders = {
    data: dataMonthlySales,
    xField: "type",
    yField: "income",
    color: "#ffd333",
    label: {
      position: "middle",
      style: { fill: "#121111", opacity: 1 },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Doanh thu</h3>
          <Column {...configRevenue} />
        </div>
        <div className="mt-4 flex-grow-1">
          <h3 className="mb-5 title">Đơn hàng</h3>
          <Column {...configOrders} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-5 title">Chi tiết đơn hàng</h3>
        <Table columns={columns} dataSource={orderData} />
      </div>
    </div>
  );
};

export default Dashboard;
