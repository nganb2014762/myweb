import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { config } from "../utils/axiosConfig";
import {
  createAnOrder,
  deleteUserCart,
  getUserCart,
  resetState,
} from "../features/user/userSlice";

let shippingSchema = yup.object({
  name: yup.string().required("Vui lòng nhập dữ liệu"),
  address: yup.string().required("Vui lòng nhập dữ liệu"),
  city: yup.string().required("Vui lòng nhập dữ liệu"),
  pincode: yup.number("Vui lòng nhập dữ liệu").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

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
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsPayPalReady(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AUKZzmdy6bbvA0y6Ct1CktKtkXZd-_IFGsdkVCNtW8ot-G66-AWjDmUjknHvBwbd1_ujwWeL8jCzHLwU`;
      script.async = true;
      script.onload = () => {
        console.log("PayPal SDK loaded successfully");
        setIsPayPalReady(true);
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      navigate("/my-orders");
    }
  }, [authState]);

  const [cartProductState, setCartProductState] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      pincode: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      localStorage.setItem("address", JSON.stringify(values));
      setTimeout(() => {
        if (paymentMethod === "COD") {
          handleCODOrder();
        } else {
          checkOutHandler();
        }
      }, 300);
    },
  });

  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      const product = cartState[index].productId; // Đảm bảo lấy thông tin từ productId
      items.push({
        product: product._id, // ID sản phẩm
        title: product.title,
        brand: product.brand,
        category: product.category, // Tiêu đề sản phẩm
        quantity: cartState[index].quantity,
        price: product.price, // Giá từ productId
      });
    }
    setCartProductState(items);
  }, [cartState]);

  const checkOutHandler = async () => {
    // Nếu phương thức thanh toán là PayPal, nhân tổng tiền với 0.000039 và làm tròn đến 2 chữ số thập phân
    let finalAmount = totalAmount + 30000;
    if (paymentMethod === "PayPal") {
      finalAmount = (finalAmount * 0.000039).toFixed(2); // Làm tròn đến 2 chữ số thập phân
    }

    if (!isPayPalReady) {
      console.error("PayPal SDK chưa được tải");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/order/create-paypal-order",
        { amount: finalAmount }, // Gửi số tiền đã được làm tròn
        config
      );

      if (!result.data.success) {
        alert("Something went wrong");
        return;
      }

      const { orderId } = result.data;

      if (document.getElementById("paypal-button-container")) {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: finalAmount, // Gửi số tiền đã làm tròn
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();

              dispatch(
                createAnOrder({
                  totalPrice: finalAmount, // Sử dụng số tiền đã làm tròn
                  totalPriceAfterDiscount: finalAmount,
                  orderItems: cartProductState,
                  paymentInfo: {
                    method: "PayPal",
                    ...details,
                  },
                  shippingInfo: JSON.parse(localStorage.getItem("address")),
                })
              );

              dispatch(deleteUserCart(config2));
              localStorage.removeItem("address");
              dispatch(resetState());
            },
            onError: (err) => {
              console.error("PayPal Checkout onError", err);
            },
          })
          .render("#paypal-button-container");
      } else {
        console.error("Container của nút PayPal không tồn tại");
      }
    } catch (error) {
      console.error("Error creating PayPal order", error);
      alert("Something went wrong");
    }
  };

  const handleCODOrder = () => {
    dispatch(
      createAnOrder({
        totalPrice: totalAmount + 30000,
        totalPriceAfterDiscount: totalAmount + 30000,
        orderItems: cartProductState,
        paymentInfo: {
          method: "COD", // Định nghĩa phương thức thanh toán
        },
        shippingInfo: JSON.parse(localStorage.getItem("address")),
      })
    );

    dispatch(deleteUserCart(config2));
    localStorage.removeItem("address");
    dispatch(resetState());
  };

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7">
            <div className="checkout-left-data">
              <h4 className="mb-3">Địa chỉ giao hàng</h4>
              <form
                onSubmit={formik.handleSubmit}
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Tên"
                    className="form-control"
                    name="name"
                    value={formik.values.tname}
                    onChange={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.name && formik.errors.name}
                  </div>
                </div>

                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường"
                    className="form-control"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.address && formik.errors.address}
                  </div>
                </div>

                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="form-control"
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange("pincode")}
                    onBlur={formik.handleBlur("pincode")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.pincode && formik.errors.pincode}
                  </div>
                </div>

                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    className="form-control"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange("city")}
                    onBlur={formik.handleBlur("city")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.city && formik.errors.city}
                  </div>
                </div>

                <div className="w-100">
                  <label htmlFor="paymentMethod">Phương thức thanh toán</label>
                  <select
                    className="form-control form-select"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="PayPal">PayPal</option>
                    <option value="COD">Thanh toán khi nhận hàng</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Đặt hàng
                </button>
              </form>
            </div>
          </div>
          <div className="col-5">
            <div id="paypal-button-container">
              <div className="border-bottom py-4">
                {cartState &&
                  cartState.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex gap-10 mb-2 align-align-items-center"
                    >
                      <div className="w-75 d-flex gap-10">
                        <div className="w-25 position-relative">
                          <span
                            style={{ top: "-10px", right: "2px" }}
                            className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                          >
                            {item?.quantity}
                          </span>
                          <img
                            src={item?.productId?.images[0]?.url}
                            width={100}
                            height={100}
                            alt={`${item?.productId?.title} - ${item?.productId?.brand} - ${item?.productId?.category}`} 
                          />
                        </div>
                        <div>
                          <h5 className="total-price">
                            {item?.productId?.title}
                          </h5>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="total">
                          {item?.price * item?.quantity}
                        </h5>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="border-bottom py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="total">Tổng phụ</p>
                  <p className="total-price">
                    {totalAmount ? totalAmount : "0"}
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">Phí vận chuyển</p>
                  <p className="mb-0 total-price">30 000</p>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bootom py-4">
                <h4 className="total">Tổng</h4>
                <h5 className="total-price">
                  {paymentMethod === "PayPal"
                    ? (totalAmount + 30000) * 0.000039
                    : totalAmount + 30000}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;
