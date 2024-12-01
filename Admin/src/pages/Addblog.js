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
  const blogState = useSelector((state) => state.blogs);

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
  } = blogState;

  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
    } else {
      dispatch(resetState());
    }
    dispatch(getCategories());
  }, [getBlogId, dispatch]);

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog-list");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const [images, setImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("onSubmit function called");
      console.log("Title: ", values.title);
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
      } else {
        dispatch(createBlogs(values));
        formik.resetForm();
        setImages([]);
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("images", images);
  }, [images]);

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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
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
            onDrop={(acceptedFiles) => {
              const newImages = acceptedFiles.map((file) => ({
                public_id: file.name,
                url: URL.createObjectURL(file),
              }));
              setImages((prevImages) => [...prevImages, ...newImages]);
              dispatch(uploadImg(acceptedFiles));
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Tải ảnh</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        <br />
        <div className="showimages d-flex flex-wrap gap-3">
          {images.map((i, j) => (
            <div className="position-relative" key={j}>
              <button
                type="button"
                onClick={() => {
                  dispatch(delImg(i.public_id));
                  setImages((prevImages) =>
                    prevImages.filter((img) => img.public_id !== i.public_id)
                  );
                }}
                className="btn-close position-absolute"
                style={{ top: "10px", right: "10px" }}
              ></button>
              <img src={i.url} alt="" width={200} height={200} />
            </div>
          ))}
        </div>

        <button
          className="btn btn-success border-0 rounded-3 my-5"
          type="submit"
        >
          {getBlogId !== undefined ? "Cập nhật" : "Thêm"} Blog
        </button>
      </form>
    </div>
  );
};

export default Addblog;
