import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../features/cutomers/customerSlice";

const Customers = () => {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const dispatch = useDispatch();
  const customerstate = useSelector((state) => state.customer.customers);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Hàm xử lý xóa người dùng
  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(selectedId)); // Gọi action xóa
      message.success("Xóa người dùng thành công!");
      dispatch(getUsers()); // Lấy lại danh sách sau khi xóa
      setVisible(false); // Đóng modal sau khi xóa thành công
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa người dùng!");
      setVisible(false); // Đóng modal nếu xảy ra lỗi
    }
  };

  const showDeleteModal = (id) => {
    setSelectedId(id);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const data1 = [];
  for (let i = 0; i < customerstate.length; i++) {
    if (customerstate[i].role !== "admin") {
      data1.push({
        key: customerstate[i]._id,
        name: customerstate[i].name,
        email: customerstate[i].email,
        mobile: customerstate[i].mobile,
        id: customerstate[i]._id,
      });
    }
  }

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
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
      title: "Hành động",
      dataIndex: "id",
      render: (id) => (
        <Button
          danger
          onClick={() => showDeleteModal(id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h3 className="mb-4 title">Danh sách khách hàng</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>

      <Modal
        title="Xác nhận xóa"
        visible={visible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
      </Modal>
    </div>
  );
};

export default Customers;
