import React, { useEffect, useState } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyData,
  getOrders,
  getYearlyData,
} from "../features/auth/authSlice";

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
    title: "Số lượng",
    dataIndex: "product",
  },
  {
    title: "Giá gốc",
    dataIndex: "price",
  },
  {
    title: "Giá sau khuyến mãi",
    dataIndex: "dprice",
  },
  {
    title: "Trạng thái",
    dataIndex: "staus",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const yearlyDataState = useSelector((state) => state?.auth?.yearlyData);
  const orderState = useSelector((state) => state?.auth?.orders?.orders);
  console.log(orderState);

  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  const [orderData, setOrderData] = useState([]);

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
    dispatch(getYearlyData(config3));
    dispatch(getOrders(config3));
  }, []);

  useEffect(() => {
    let monthNames = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    let data = [];
    let monthlyOrderCount = [];

    // Dữ liệu doanh thu theo tháng
    for (let index = 0; index < monthlyDataState?.length; index++) {
      const element = monthlyDataState[index];
      data.push({
        type: monthNames[element?._id?.month],
        income: element?.amount,
      });
      monthlyOrderCount.push({
        type: monthNames[element?._id?.month],
        income: element?.count,
      });
    }

    setDataMonthly(data);
    setDataMonthlySales(monthlyOrderCount);

    // Dữ liệu đơn hàng, bao gồm thông tin về phương thức thanh toán PayPal
    const data1 = [];

    for (let i = 0; i < orderState?.length; i++) {
      const order = orderState[i];

      // Kiểm tra nếu phương thức thanh toán là PayPal
      const adjustedPrice =
        order.paymentInfo.method === "PayPal"
          ? (order.totalPriceAfterDiscount / 0.000039).toFixed(2) // Làm tròn đến 2 chữ số thập phân
          : order.totalPriceAfterDiscount.toFixed(2); // Làm tròn đến 2 chữ số thập phân nếu không phải PayPal

      data1.push({
        key: i + 1,
        name: order.user.name,
        product: order.orderItems?.length,
        price: order.totalPrice.toFixed(2), // Làm tròn giá gốc đến 2 chữ số thập phân
        dprice: adjustedPrice, // Hiển thị giá đã điều chỉnh nếu thanh toán bằng PayPal
        staus: order.orderStatus,
      });
    }

    setOrderData(data1);
  }, [monthlyDataState, yearlyDataState, orderState]);

  const config = {
    data: dataMonthly,
    xField: "type",
    yField: "income",
    color: ({ type }) => {
      return "#ffd333";
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };

  const config2 = {
    data: dataMonthlySales,
    xField: "type",
    yField: "income",
    color: ({ type }) => {
      return "#ffd333";
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };

  return (
    <div>
      <h3 className="mb-4 title">Doanh thu</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Tổng doanh thu</p>
            <h4 className="mb-0 sub-title">
              {yearlyDataState && yearlyDataState[0]?.amount
                ? yearlyDataState[0]?.amount.toFixed(2) // Làm tròn đến 2 chữ số thập phân
                : 0}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Tổng đơn hàng</p>
            <h4 className="mb-0 sub-title">
              {yearlyDataState && yearlyDataState[0]?.count}
            </h4>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Biểu đồ doanh thu </h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        <div className="mt-4 flex-grow-1 ">
          <h3 className="mb-5 title">Biểu đồ đơn hàng </h3>
          <div>
            <Column {...config2} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Đơn hàng</h3>
        <div>
          <Table columns={columns} dataSource={orderData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
