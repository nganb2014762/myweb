import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thêm phiếu nhập kho
export const addStock = createAsyncThunk("stock/addStock", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/stock/add-stock", data);
    return response.data; // Đảm bảo rằng bạn trả về dữ liệu sau khi phiếu nhập kho được tạo thành công
  } catch (error) {
    return rejectWithValue(error.response.data); // Trả về lỗi nếu có
  }
});

// Lấy danh sách phiếu nhập kho
export const getStockHistory = createAsyncThunk("stock/getStockHistory", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/api/stock/stock-history");
    return response.data; // Trả về dữ liệu danh sách phiếu nhập kho
  } catch (error) {
    return rejectWithValue(error.response.data); // Trả về lỗi nếu có
  }
});

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    stocks: [], // Danh sách phiếu nhập kho
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Thêm phiếu nhập kho
      .addCase(addStock.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset lỗi khi bắt đầu tải dữ liệu
      })
      .addCase(addStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks.push(action.payload); // Thêm phiếu nhập kho mới vào mảng stocks
      })
      .addCase(addStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu thông báo lỗi
      })

      // Lấy danh sách phiếu nhập kho
      .addCase(getStockHistory.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset lỗi khi bắt đầu tải dữ liệu
      })
      .addCase(getStockHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload; // Cập nhật danh sách phiếu nhập kho
      })
      .addCase(getStockHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu thông báo lỗi khi lấy dữ liệu thất bại
      });
  },
});

export default stockSlice.reducer;
