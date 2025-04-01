import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "@/types/slices";

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (userId: string, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/users/${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch user information");
      }
      console.log(data.data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer; 