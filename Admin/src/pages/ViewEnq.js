import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAEnquiry,
  resetState,
  updateAEnquiry,
} from "../features/enquiry/enquirySlice";
import { BiArrowBack } from "react-icons/bi";

const ViewEnq = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getEnqId = location.pathname.split("/")[3];
  const enqState = useSelector((state) => state.enquiry);
  const { enqName, enqMobile, enqEmail, enqComment, enqStatus } = enqState;

  useEffect(() => {
    dispatch(getAEnquiry(getEnqId));
  }, [getEnqId]);
  const goBack = () => {
    navigate(-1);
  };
  const setEnquiryStatus = (e, i) => {
    console.log(e, i);
    const data = { id: i, enqData: e };
    dispatch(updateAEnquiry(data));
    dispatch(resetState());
    setTimeout(() => {
      dispatch(getAEnquiry(getEnqId));
    }, 100);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">Yêu cầu</h3>
        <button
          className="bg-transpatent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Trở về
        </button>
      </div>
      <div className="mt-5 bg-white p-4 d-flex gap-3 flex-column rounded-3">
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Tên:</h6>
          <p className="mb-0">{enqName}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">SĐT:</h6>
          <p className="mb-0">
            <a href={`tel:+91${enqMobile}`}>{enqMobile}</a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Email:</h6>
          <p className="mb-0">
            <a href={`mailto:{enqEmail}`}>{enqEmail}</a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Nội dung:</h6>
          <p className="mb-0">{enqComment}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Trạng thái:</h6>
          <p className="mb-0">{enqStatus}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Cập nhật:</h6>
          <div>
            <select
              name=""
              defaultValue={enqStatus ? enqStatus : "Submitted"}
              className="form-control form-select"
              id=""
              onChange={(e) => setEnquiryStatus(e.target.value, getEnqId)}
            >
              <option value="Submitted">Đã tiếp nhận</option>
              <option value="Contacted">Đã liên hệ</option>
              <option value="In Progress">Đang tiến hành</option>
              <option value="Resolved">Đã giải quyết</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnq;
