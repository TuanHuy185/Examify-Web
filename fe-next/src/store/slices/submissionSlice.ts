import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TestResult, SubmissionState } from "@/types/slices";

interface SubmissionParams {
  testId: string;
  studentId: string;
}

export const fetchSubmissionDetails = createAsyncThunk(
  "submissions/fetchSubmissionDetails",
  async ({ testId, studentId }: SubmissionParams, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests/${testId}/students/${studentId}/results`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submission details");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch submission details");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: SubmissionState = {
  submission: null,
  loading: false,
  error: null,
};

const submissionSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionDetails.fulfilled, (state, action: PayloadAction<TestResult>) => {
        state.loading = false;
        state.submission = action.payload;
      })
      .addCase(fetchSubmissionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSubmissions = (state: { submissions: SubmissionState }) => state.submissions;
export default submissionSlice.reducer; 