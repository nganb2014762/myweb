import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getProducts = async (data) => {
  console.log(data);
  const response = await axios.get(
    `${base_url}product?${data?.brand ? `brand=${data?.brand}&&` : ""}${
      data?.tag ? `tags=${data?.tag}&&` : ""
    }${data?.category ? `category=${data?.category}&&` : ""}${
      data?.minPrice ? `price[gte]=${data?.minPrice}&&` : ""
    }${data?.maxPrice ? `price[lte]=${data?.maxPrice}&&` : ""}${
      data?.sort ? `sort=${data?.sort}&&` : ""
    }`
  );

  if (response.data) {
    return response.data;
  }
};

const getSingleProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`);
  console.log("Product API response:", response.data);
  if (response.data) {
    return response.data; // Đảm bảo ratings nằm trong response này
  }
};


const addToWishlist = async (prodId) => {
  const response = await axios.put(
    `${base_url}product/Wishlist`,
    { prodId },
    config
  );
  if (response.data) {
    return response.data;
  }
};

const rateProduct = async (data) => {
  const response = await axios.put(`${base_url}product/rating`, data, config);
  if (response.data) {
    return response.data;
  }
};

const updateTopSellingTags = async () => {
  try {
    const response = await axios.post(`${base_url}product/update-top-selling-tags`, {}, config);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating top selling tags:", error);
    throw error;
  }
};


export  const productSevice = {
  getProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
  updateTopSellingTags,
};
