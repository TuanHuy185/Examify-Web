import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TestResult, StudentTestState } from '@/types/slices';

export const fetchPastTestResults = createAsyncThunk(
  'tests/fetchPastTestResults',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/students/${studentId}/results`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tests');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const initialState: StudentTestState = {
  pastResults: [],
  loading: false,
  error: null,
};

const studentTestSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastTestResults.fulfilled, (state, action: PayloadAction<TestResult[]>) => {
        state.loading = false;
        state.pastResults = action.payload;
      })
      .addCase(fetchPastTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectStudentTests = (state: { studentTests: StudentTestState }) => state.studentTests;
export default studentTestSlice.reducer;
