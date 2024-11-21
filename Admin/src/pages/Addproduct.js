import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("Vui lòng nhập tên sản phẩm"),
  description: yup.string().required("Vui lòng nhập mô tả"),
  price: yup.number().required("Vui lòng nhập giá"),
  brand: yup.string().required("Vui lòng nhập tên thương hiệu"),
  category: yup.string().required("Vui lòng nhập loại"),
  quantity: yup.number().required("Vui lòng nhập số lượng"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    if (getProductId) {
      dispatch(getAProduct(getProductId)); // Fetch product if editing
    } else {
      dispatch(resetState()); // Reset state if creating new product
    }
  }, [dispatch, getProductId]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);

  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTag,
    productQuantity,
    productImages,
  } = newProduct;

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Thêm sản phẩm thành công!");
      setTimeout(() => {
        navigate("/admin/list-product");  
      }, 1000); 
    }
    if (isSuccess && updatedProduct) {
      toast.success("Sản phẩm cập nhật thành công!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Lỗi!");
    }
  }, [isSuccess, isError, isLoading, createdProduct, updatedProduct, navigate]);
  
  const img = [];
  imgState?.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  const imgshow = [];
  productImages?.forEach((i) => {
    imgshow.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  useEffect(() => {
    if (productImages) {
      formik.setValues({
        ...formik.values,
        images: imgshow, // Update formik's images value
        title: productName || "",
        description: productDesc || "",
        price: productPrice || "",
        brand: productBrand || "",
        category: productCategory || "",
        tags: productTag || "",
        quantity: productQuantity || "",
      });
    }
  }, [productName, productDesc, productPrice, productBrand, productCategory, productTag, productQuantity, productImages]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      quantity: "",
      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("Dữ liệu gửi lên server: ", values);
      const dataToSend = {
        ...values,  // Các thông tin khác của sản phẩm
        images: img,  // Hình ảnh đã upload
      };
    
      if (getProductId) {
        const data = { id: getProductId, productData: dataToSend };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(dataToSend));
        formik.resetForm();
    
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    }
    
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId ? "Chỉnh sửa" : "Thêm"} sản phẩm
      </h3>
      <form onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
        <CustomInput
          type="text"
          label="Tên sản phẩm"
          name="title"
          onChng={formik.handleChange("title")}
          onBlr={formik.handleBlur("title")}
          val={formik.values.title}
        />
        <div className="error">
          {formik.touched.title && formik.errors.title}
        </div>

        <div>
          <ReactQuill
            theme="snow"
            label="Nhập mô tả"
            name="description"
            onChange={formik.handleChange("description")}
            value={formik.values.description}
            modules={{
              clipboard: { matchVisual: false },
            }}
          />
        </div>
        <div className="error">
          {formik.touched.description && formik.errors.description}
        </div>

        <CustomInput
          type="number"
          label="Giá"
          name="price"
          onChng={formik.handleChange("price")}
          onBlr={formik.handleBlur("price")}
          val={formik.values.price}
        />
        <div className="error">
          {formik.touched.price && formik.errors.price}
        </div>

        <select
          name="brand"
          onChange={formik.handleChange("brand")}
          onBlur={formik.handleBlur("brand")}
          value={formik.values.brand}
          className="form-control py-3 mb-3"
        >
          <option value="">Thương hiệu</option>
          {brandState.map((i, j) => {
            return (
              <option key={j} value={i.title}>
                {i.title}
              </option>
            );
          })}
        </select>
        <div className="error">
          {formik.touched.brand && formik.errors.brand}
        </div>

        <select
          name="category"
          onChange={formik.handleChange("category")}
          onBlur={formik.handleBlur("category")}
          value={formik.values.category}
          className="form-control py-3 mb-3"
        >
          <option value="">Phân loại</option>
          {catState.map((i, j) => {
            return (
              <option key={j} value={i.title}>
                {i.title}
              </option>
            );
          })}
        </select>
        <div className="error">
          {formik.touched.category && formik.errors.category}
        </div>

        <select
          name="tags"
          onChange={formik.handleChange("tags")}
          onBlur={formik.handleBlur("tags")}
          value={formik.values.tags}
          className="form-control py-3 mb-3"
        >
          <option value="" disabled>
            Độ phổ biến
          </option>
          <option value="Phổ biến">Phổ biến</option>
          <option value="Được tìm kiếm nhiều nhất">Được tìm kiếm nhiều nhất</option>
          <option value="Bán chạy nhất">Bán chạy nhất</option>
        </select>
        <div className="error">
          {formik.touched.tags && formik.errors.tags}
        </div>

        <CustomInput
          type="number"
          label="Số lượng"
          name="quantity"
          onChng={formik.handleChange("quantity")}
          onBlr={formik.handleBlur("quantity")}
          val={formik.values.quantity}
        />
        <div className="error">
          {formik.touched.quantity && formik.errors.quantity}
        </div>

        <div className="bg-white border-1 p-5 text-center">
          <Dropzone onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Upload hình ảnh</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div className="showimages d-flex flex-wrap gap-3">
          {img.length > 0
            ? img.map((i) => (
                <div key={i.public_id} className="position-relative">
                  <img
                    src={i.url}
                    alt="uploaded"
                    className="img-fluid rounded-3"
                    width={120}
                  />
                </div>
              ))
            : null}
        </div>

        <button className="btn btn-primary border-0 rounded-3 mt-5" type="submit">
          {isLoading ? "Đang xử lý..." : getProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
};

export default Addproduct;
