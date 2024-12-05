import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import { delImg } from "../features/upload/uploadSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
    width: 50,
  },
  {
    title: "ID",
    dataIndex: "id",
    width: 150,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
    width: 200,
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
    width: 150,
  },
  {
    title: "Loại",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
    width: 150,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    width: 100,
  },
  {
    title: "Giá",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
    width: 100,
  },
  {
    title: "Thêm/Xóa",
    dataIndex: "action",
    width: 150,
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setproductId] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Giá trị nhập trong ô tìm kiếm
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách hiển thị

  const showModal = (e) => {
    setOpen(true);
    setproductId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const productState = useSelector((state) => state?.product?.products);

  useEffect(() => {
    // Cập nhật danh sách mặc định (toàn bộ sản phẩm)
    setFilteredProducts(productState);
  }, [productState]);

  const handleSearch = () => {
    // Lọc sản phẩm khi nhấn nút "Tìm kiếm"
    const filtered = productState.filter(
      (product) =>
        product.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        product._id.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.category.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const data1 = filteredProducts.map((product, index) => ({
    key: index + 1,
    id: product._id,
    title: product.title,
    brand: product.brand,
    category: product.category,
    quantity: product.quantity,
    price: `${product.price}`,
    action: (
      <>
        <Link
          to={`/admin/product/${product._id}`}
          className="fs-3 text-success"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(product._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteProduct = (e) => {
    dispatch(deleteAProduct(e));
    dispatch(delImg(e));

    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Danh sách sản phẩm</h3>
      <div className="mb-3 d-flex gap-2">
        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Tìm kiếm sản phẩm"
          onChange={(e) => setSearchInput(e.target.value)} // Cập nhật giá trị nhập
          value={searchInput}
          size="large"
          allowClear
        />
        <Button type="primary" size="large" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      <div>
        {/* Hiển thị bảng */}
        {filteredProducts.length > 0 ? (
          <Table columns={columns} dataSource={data1} />
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(productId);
        }}
        title="Bạn có chắc chắn muốn xóa sản phẩm này ?"
      />
    </div>
  );
};

export default Productlist;
