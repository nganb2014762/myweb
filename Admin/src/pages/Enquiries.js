import React, { useEffect, useState } from "react";

import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAEnquiry,
  getEnquiries,
  resetState,
  updateAEnquiry,
} from "../features/enquiry/enquirySlice";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "SĐT",
    dataIndex: "mobile",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },

  {
    title: "Thao tác",
    dataIndex: "action",
  },
];

const Enquiries = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [enqId, setenqId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setenqId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(resetState());
    dispatch(getEnquiries());
  }, []);
  const enqState = useSelector((state) => state.enquiry.enquiries);
  const statusMapping = {
    Submitted: "Đã tiếp nhận",
    Contacted: "Đã liên hệ",
    InProgress: "Đang tiến hành",
    Resolved: "Đã giải quyết",
  };
  
  const data1 = enqState.map((enquiry, index) => ({
    key: index + 1,
    name: enquiry.name,
    email: enquiry.email,
    mobile: enquiry.mobile,
    status: statusMapping[enquiry.status] || enquiry.status, // Hiển thị nhãn thân thiện
    action: (
      <>
        <Link
          className="ms-3 fs-3 text-danger"
          to={`/admin/enquiries/${enquiry._id}`}
        >
          <AiOutlineEye />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(enquiry._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));
  
  const setEnquiryStatus = (e, i) => {
    console.log(e, i);
    const data = { id: i, enqData: e };
    dispatch(updateAEnquiry(data));
  };
  const deleteEnq = (e) => {
    dispatch(deleteAEnquiry(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getEnquiries());
    }, 100);
  };
  return (
    <div>
      <h3 className="mb-4 title">Yêu cầu từ khách hàng</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteEnq(enqId);
        }}
        title="Bạn có chắc chắn muốn xóa?"
      />
    </div>
  );
};

export default Enquiries;
