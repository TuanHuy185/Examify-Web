import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Test, TestResult, TeacherTestState } from "@/types/slices";

// Async thunks
export const createTest = createAsyncThunk(
  "tests/createTest",
  async (testData: Omit<Test, 'id'>, { rejectWithValue }) => {
    try {
      console.log("Sending test data:", testData);
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests`;
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to create test");
      }

      return data; // Return the actual test data instead of the whole response
    } catch (error) {
      console.error("Error creating test:", error instanceof Error ? error.message : 'Unknown error');
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchTeacherTests = createAsyncThunk(
  "tests/fetchTests",
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests?teacherId=${teacherId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchTestDetails = createAsyncThunk(
  "tests/fetchTestDetails",
  async (testId: string, { rejectWithValue }) => {
    try {
      const teacherId = localStorage.getItem("userId");
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests/${testId}?teacherId=${teacherId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch test details");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateTest = createAsyncThunk(
  "tests/updateTest",
  async (testData: Test, { rejectWithValue }) => {
    console.log('Updating test:', testData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_API_URL}/tests`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(testData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update test: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status !== "OK") {
        throw new Error(result.message || "Failed to update test");
      }
      
      return {
        ...result,
        testId: testData.id
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchTestResults = createAsyncThunk(
  "tests/fetchTestResults",
  async (testId: string, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests/${testId}/results`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch test results");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteTest = createAsyncThunk(
  "tests/deleteTest",
  async (testId: string, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BE_API_URL}/tests/${testId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== "OK" && !data.success) {
        throw new Error(data.message || "Failed to delete test");
      }
      
      return { testId, message: data.message || "Test deleted successfully" };
    } catch (error) {
      console.error("Error deleting test:", error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: TeacherTestState = {
  tests: [],
  currentTest: null,
  allTestResults: [],
  loading: false,
  error: null,
};

const teacherTestSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all tests
      .addCase(fetchTeacherTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTests.fulfilled, (state, action: PayloadAction<Test[]>) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTeacherTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch test details
      .addCase(fetchTestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload.data;
      })
      .addCase(fetchTestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update test
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.currentTest = action.payload.data;
        }
        
        if (state.tests.length > 0 && action.payload.testId) {
          const index = state.tests.findIndex(t => t.id === action.payload.testId);
          if (index !== -1 && action.payload.data) {
            state.tests[index] = action.payload.data;
          }
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch test results
      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action: PayloadAction<TestResult[]>) => {
        state.loading = false;
        state.allTestResults = action.payload;
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete test
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = state.tests.filter(test => test.id !== action.payload.testId);
        if (state.currentTest?.id === action.payload.testId) {
          state.currentTest = null;
        }
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectTeacherTests = (state: { teacherTests: TeacherTestState }) => state.teacherTests;
export default teacherTestSlice.reducer; 