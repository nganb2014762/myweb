import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { FiEdit } from "react-icons/fi";

let profileSchema = yup.object({
  name: yup.string().required("Vui lòng nhập dữ liệu!"),
  email: yup
    .string()
    .required("Vui lòng nhập dữ liệu!")
    .email("Vui lòng nhập dữ liệu!"),
  mobile: yup.number().required().positive().integer("Vui lòng nhập dữ liệu!"),
});

const Profile = () => {
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
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const formik = useFormik({
    initialValues: {
      name: userState?.name,
      email: userState?.email,
      mobile: userState?.mobile,
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      dispatch(updateProfile({ data: values, config2: config2 }));
      setEdit(true);
    },
  });

  return (
    <>
      <BreadCrumb title="My Profile" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3">Thông tin cá nhân</h3>

              <FiEdit className="fs-3" onClick={() => setEdit(false)} />
            </div>
          </div>
          <div className="col-12">
            <form action="" onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                
                <div className="mb-3">
                  <label htmlFor="example2" className="form-label">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="example2"
                    disabled={edit}
                    value={formik.values.name}
                    onChange={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                  />
                  <div className="error">
                    {formik.touched.name && formik.errors.name}
                  </div>
                </div>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email 
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  disabled={edit}
                  aria-describedby="emailHelp"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <div className="error">
                  {formik.touched.email && formik.errors.email}
                </div>
                <div className="mb-3">
                  <label htmlFor="example3" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="number"
                    name="mobile"
                    className="form-control"
                    id="example3"
                    disabled={edit}
                    value={formik.values.mobile}
                    onChange={formik.handleChange("mobile")}
                    onBlur={formik.handleBlur("mobile")}
                  />
                  <div className="error">
                    {formik.touched.mobile && formik.errors.mobile}
                  </div>
                </div>
              </div>

              {edit === false && (
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              )}
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
