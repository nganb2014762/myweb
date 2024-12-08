import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getUsers = async () => {
  const response = await axios.get(`${base_url}user/all-users`);
  return response.data;
};

// New function to delete a user by ID
const deleteUser = async (id) => {
  const response = await axios.delete(`${base_url}user/${id}`);
  return response.data; // You can return response.data or just an acknowledgment message
};

const customerService = {
  getUsers,
  deleteUser, // Add this line to include deleteUser in the exports
};

export default customerService;
