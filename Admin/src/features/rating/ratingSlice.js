import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getRatings = createAsyncThunk("rating/getRatings", async () => {
  const response = await axios.get("http://localhost:5000/api/ratings");
  return response.data;
});

export const deleteRating = createAsyncThunk("rating/deleteRating", async (ratingId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`);
      return ratingId; // Trả về ID rating đã xóa để Redux cập nhật state
    } catch (error) {
      console.error("Error deleting rating:", error.response ? error.response.data : error.message);
      throw error; // Gây lỗi nếu có lỗi xảy ra
    }
  });

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        // Khi xóa thành công, ta lọc ra rating bị xóa khỏi mảng ratings
        state.ratings = state.ratings.filter(
          (rating) => rating._id !== action.payload
        );
      })
      .addCase(deleteRating.rejected, (state, action) => {
        console.error("Delete rating failed:", action.error);
      });
  },
});

export default ratingSlice.reducer;
