import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../features/product/productSlice";
import { addStock } from "../features/stock/stockSlice";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const AddStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productId, setProductId] = useState("");
  const [quantityAdded, setQuantityAdded] = useState("");
  const [note, setNote] = useState("");
  const [productList, setProductList] = useState([]); 

  const productState = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  

  const handleAddProduct = () => {
    if (!productId || !quantityAdded) {
      toast.error("Vui lòng chọn sản phẩm và nhập số lượng");
      return;
    }

    const existingProduct = productList.find(
      (item) => item.productId === productId
    );
    if (existingProduct) {
      toast.error("Sản phẩm này đã được thêm vào phiếu");
      return;
    }

    setProductList([
      ...productList,
      { productId, quantityAdded: parseInt(quantityAdded) },
    ]);
    setProductId("");
    setQuantityAdded("");
  };

  const handleRemoveProduct = (id) => {
    setProductList(productList.filter((item) => item.productId !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productList.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }
  
    const data = { products: productList, note };
    dispatch(addStock(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Nhập kho thành công!");
  
        setTimeout(() => {
          navigate("/admin/stock-history");
        }, 1000); 
      } else {
        console.error("Lỗi nhập kho:", res.payload?.message || "Lỗi không xác định");
        toast.error(res.payload?.message || "Lỗi nhập kho");
      }
    });
  };
   

  return (
    <div>
      <h3 className="mb-4 title">Thêm phiếu nhập kho</h3>
      <form onSubmit={handleSubmit} className="d-flex gap-3 flex-column">
        <div className="d-flex gap-3">
          <select
            name="product"
            onChange={(e) => setProductId(e.target.value)}
            className="form-control py-3 mb-3"
            value={productId}
          >
            <option value="">Chọn sản phẩm</option>
            {productState.map((product) => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Số lượng thêm"
            className="form-control py-3 mb-3"
            value={quantityAdded}
            onChange={(e) => setQuantityAdded(e.target.value)}
          />

          <button
            type="button"
            onClick={handleAddProduct}
            style={{
              marginBottom: "15px",
              padding: "10px 15px",
              fontSize: "20px", 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaPlus size={16} /> 
          </button>
        </div>

        <ul className="list-group mb-3">
          {productList.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {productState.find((p) => p._id === item.productId)?.title ||
                  "Không xác định"}{" "}
                - {item.quantityAdded} sản phẩm
              </span>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveProduct(item.productId)}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>

        <textarea
          placeholder="Ghi chú (tùy chọn)"
          className="form-control py-3 mb-3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button
          className="btn btn-primary border-0 rounded-3 mt-5"
          type="submit"
        >
          Tạo phiếu nhập
        </button>
      </form>
    </div>
  );
};

export default AddStock;
