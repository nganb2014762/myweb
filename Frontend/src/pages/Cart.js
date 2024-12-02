import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  updateCartProduct,
} from "../features/user/userSlice";

const Cart = () => {
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

  const dispatch = useDispatch();
  const [updatedQuantity, setUpdatedQuantity] = useState({});
  const [totalAmount, setTotalAmount] = useState(null);
  const userCartState = useSelector((state) => state.auth.cartProducts);
  const isFirstRender = React.useRef(true);
  const productState = useSelector((state) => state?.product?.singleproduct);

  useEffect(() => {
    if (isFirstRender.current) {
      dispatch(getUserCart(config2));
      isFirstRender.current = false;
    }
  }, [dispatch, config2]);

  useEffect(() => {
    let sum = 0;
    userCartState?.forEach((item) => {
      sum += Number(item.quantity) * item.price;
    });
    setTotalAmount(sum);
  }, [userCartState]);

  const handleQuantityChange = (itemId, quantity) => {
    setUpdatedQuantity((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleUpdateQuantity = (cartItemId) => {
    if (updatedQuantity[cartItemId] !== undefined) {
      dispatch(
        updateCartProduct({
          cartItemId: cartItemId,
          quantity: updatedQuantity[cartItemId],
        })
      ).then(() => {
        dispatch(getUserCart(config2));
      });
    }
  };

  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct({ id: id, config2: config2 })).then(() => {
      dispatch(getUserCart(config2));
    });
  };

  // Format currency as VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Sản phẩm</h4>
              <h4 className="cart-col-2">Giá</h4>
              <h4 className="cart-col-3">Số lượng</h4>
              <h4 className="cart-col-4">Tổng</h4>
            </div>
            {userCartState &&
              userCartState?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                  >
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="w-25">
                        {item?.productId?.images?.length > 0 && (
                          <img
                            src={item?.productId?.images[0]?.url}
                            className="img-fluid"
                            alt="product image"
                          />
                        )}
                      </div>
                      <div className="w-75">
                        <p>
                          {item?.productId?.title
                            ? item?.productId?.title
                            : "Unknown Product"}
                        </p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h5 className="price">
                        {formatCurrency(item?.price)} {/* Format individual price */}
                      </h5>
                    </div>
                    <div className="cart-col-3 d-flex align-items-center gap-15">
                      <div>
                        <input
                          className="form-control"
                          type="number"
                          min={1}
                          max={productState?.quantity || 1}
                          value={updatedQuantity[item._id] || item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, e.target.value)
                          }
                          onBlur={() => handleUpdateQuantity(item._id)}
                        />
                      </div>
                      <div>
                        <AiFillDelete
                          onClick={() => deleteACartProduct(item._id)}
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h5 className="price">
                        {formatCurrency(item.quantity * item.price)} {/* Format total price per item */}
                      </h5>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Về trang sản phẩm
              </Link>
              {totalAmount !== null && (
                <div className="d-flex flex-column align-items-end">
                  <h4>Tổng: {formatCurrency(totalAmount || 0)}</h4> {/* Format total amount */}
                  <Link to="/checkout" className="button">
                    Mua hàng
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
