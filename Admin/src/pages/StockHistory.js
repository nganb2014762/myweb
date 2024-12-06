import React, { useEffect } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getStockHistory } from "../features/stock/stockSlice"; // API lấy lịch sử nhập kho

const StockHistory = () => {
  const dispatch = useDispatch();
  const stockState = useSelector((state) => state?.stock?.stocks || []); // Đảm bảo luôn có giá trị mảng rỗng nếu không có dữ liệu
  const loading = useSelector((state) => state?.stock?.loading); // Kiểm tra trạng thái loading

  useEffect(() => {
    dispatch(getStockHistory()); // Lấy lịch sử phiếu nhập kho
  }, [dispatch]);

  // Log dữ liệu để kiểm tra
  useEffect(() => {
    console.log("Stock State:", stockState); // Log dữ liệu stockState
  }, [stockState]);

  // Hiển thị trạng thái loading khi dữ liệu chưa tải
  if (loading) {
    return (
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="text-center">
          <p>Đang tải dữ liệu...</p>
        </div>
      </Container>
    );
  }

  // Kiểm tra nếu stockState là mảng hợp lệ
  if (stockState.length === 0) {
    return (
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="text-center">
          <p>Không có dữ liệu nhập kho</p>
        </div>
      </Container>
    );
  }

  return (
    <Container class1="cart-wrapper home-wrapper-2 py-5">
      <div className="row">
        {stockState.map((stock, index) => (
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
                        ID Phiếu: {stock._id}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ fontWeight: "bold" }}>
                        Ngày nhập kho:{" "}
                        {new Date(stock.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          width: "50%",
                          borderBottom: "none",
                        }}
                      >
                        Tên sản phẩm
                      </th>
                      <th
                        style={{
                          width: "30%",
                          borderBottom: "none",
                        }}
                      >
                        Số lượng
                      </th>
                      <th
                        style={{
                          width: "20%",
                          borderBottom: "none",
                        }}
                      >
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(stock.products) && stock.products.length > 0 ? (
                      stock.products.map((product, idx) => (
                        <tr key={idx}>
                          <td>{product.product?.title || "Sản phẩm đã bị xóa"}</td>
                          <td>{product.quantityAdded } </td>
                          <td>{product.note || "Không có"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Không có sản phẩm nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default StockHistory;
