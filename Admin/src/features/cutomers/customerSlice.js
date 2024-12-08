import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";

export const getUsers = createAsyncThunk(
  "customer/get-customers",
  async (thunkAPI) => {
    try {
      return await customerService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "customer/delete-user",
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteUser(id); // Assume this is a method in your service that deletes the user
      return id; // Return the id of the deleted user to remove from the state
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const initialState = {
  customers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const customerSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.customers = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.error;
      });
  },
});
export default customerSlice.reducer;
