import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  createBlogs,
  getABlog,
  resetState,
  updateABlog,
} from "../features/blogs/blogSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
});

const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  const imgState = useSelector((state) => state?.upload?.images);
  const bCatState = useSelector((state) => state.bCategory.bCategories);
  const newblog = useSelector((state) => state.blogs);

  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = newblog;

  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
    } else {
      dispatch(resetState());
    }
    dispatch(getCategories());
  }, [getBlogId, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      if (createdBlog) {
        toast.success("Thêm blog thành công!");
        setTimeout(() => navigate("/admin/blog-list"), 1000);
      }
      if (updatedBlog) {
        toast.success("Cập nhật blog thành công!");
        setTimeout(() => navigate("/admin/blog-list"), 1000);
      }
    }
  
    if (isError) {
      toast.error("Lỗi!");
    }
  }, [isSuccess, isError, createdBlog, updatedBlog, navigate]);
  

  const img = [];
  imgState?.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  const imgshow = [];
  blogImages?.forEach((i) => {
    imgshow.push({
      public_id: i.public_id,
      url: i.url,
    });
  });

  useEffect(() => {
    if (blogImages) {
      formik.setValues({
        ...formik.values,
        images: imgshow, // Update formik's images value
        title: blogName || "",
        description: blogDesc || "",
        category: blogCategory || "",
      });
    }
  }, [blogName, blogDesc, blogCategory]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("Dữ liệu gửi lên server: ", values);
      const dataToSend = {
        ...values, // Các thông tin khác của sản phẩm
        images: img, // Hình ảnh đã upload
      };

      if (getBlogId) {
        const data = { id: getBlogId, blogData: dataToSend };
        dispatch(updateABlog(data));
      } else {
        dispatch(createBlogs(dataToSend));
        formik.resetForm();

        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getBlogId !== undefined ? "Chỉnh sửa" : "Thêm"} Blog
      </h3>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-4">
          <CustomInput
            type="text"
            label="Tiêu đề"
            name="title"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
        </div>
        <div className="mt-4">
          <ReactQuill
            theme="snow"
            label="Mô tả"
            name="description"
            onChange={(content) => formik.setFieldValue("description", content)}
            value={formik.values.description}
            modules={{ clipboard: { matchVisual: false } }}
          />
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
        </div>
        <select
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className="form-control py-3 mb-3"
        >
          <option value="">Chọn thể loại</option>
          {bCatState.map((i, j) => (
            <option key={j} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>
        <div className="error">
          {formik.touched.category && formik.errors.category}
        </div>

        <div className="bg-white border-1 p-5 text-center">
          <Dropzone
            onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
          >
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
        <br />
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

        <button
          className="btn btn-primary border-0 rounded-3 mt-5"
          type="submit"
        >
          {isLoading
            ? "Đang xử lý..."
            : getBlogId
            ? "Cập nhật blog"
            : "Thêm blog"}
        </button>
      </form>
    </div>
  );
};

export default Addblog;
