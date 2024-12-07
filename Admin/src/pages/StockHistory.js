import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getStockHistory } from "../features/stock/stockSlice"; // API lấy lịch sử nhập kho

const StockHistory = () => {
  const dispatch = useDispatch();
  const stockState = useSelector((state) => state?.stock?.stocks || []); // Đảm bảo luôn có giá trị mảng rỗng nếu không có dữ liệu
  const loading = useSelector((state) => state?.stock?.loading); // Kiểm tra trạng thái loading
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái để quản lý ô tìm kiếm
  const [filteredStockState, setFilteredStockState] = useState(stockState);

  useEffect(() => {
    dispatch(getStockHistory()); // Lấy lịch sử phiếu nhập kho
  }, [dispatch]);

  // Log dữ liệu để kiểm tra
  useEffect(() => {
    console.log("Stock State:", stockState); // Log dữ liệu stockState
    setFilteredStockState(stockState); // Cập nhật lại filteredStockState khi dữ liệu stockState thay đổi
  }, [stockState]);

  // Tạo hàm để xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Tạo hàm để xử lý khi nút tìm kiếm được bấm
  const handleSearchClick = () => {
    const result = stockState.filter((stock) =>
      stock._id.toLowerCase().includes(searchQuery) || // Tìm kiếm theo ID phiếu
      new Date(stock.createdAt).toLocaleString("vi-VN").includes(searchQuery) || // Tìm kiếm theo ngày nhập kho
      stock.products.some((product) => // Tìm kiếm theo thông tin sản phẩm
        product.title.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.brand.toLowerCase().includes(searchQuery)
      )
    );
    setFilteredStockState(result);
  };

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
  if (filteredStockState.length === 0) {
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
      <div className="mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm đơn nhập kho..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control d-inline-block"
          style={{ width: "80%" }}
        />
        <button
          onClick={handleSearchClick}
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="row">
        {filteredStockState.map((stock, index) => (
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
                      <td colSpan="3" style={{ fontWeight: "bold" }}>
                        Tổng cộng: {stock.total}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          width: "30%",
                          borderBottom: "none",
                        }}
                      >
                        Tên sản phẩm
                      </th>
                      <th
                        style={{
                          width: "20%",
                          borderBottom: "none",
                        }}
                      >
                        Phân loại
                      </th>
                      <th
                        style={{
                          width: "20%",
                          borderBottom: "none",
                        }}
                      >
                        Thương hiệu
                      </th>
                      <th
                        style={{
                          width: "20%",
                          borderBottom: "none",
                        }}
                      >
                        Giá
                      </th>
                      <th
                        style={{
                          width: "20%",
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
                        Tổng
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
                    {Array.isArray(stock.products) &&
                    stock.products.length > 0 ? (
                      stock.products.map((product, idx) => (
                        <tr key={idx}>
                          <td>{product.title}</td>
                          <td>{product.category}</td>
                          <td>{product.brand}</td>
                          <td>{product.price}</td>
                          <td>{product.quantityAdded} </td>
                          <td>{product.sum} </td>
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
