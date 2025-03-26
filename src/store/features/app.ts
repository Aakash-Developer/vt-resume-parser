import { createSlice } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/resume";

interface AppState {
  resume: string;
  jd: string;
  parsedResume: ResumeData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  resume: "",
  jd: "",
  parsedResume: null,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setResume: (state, action) => {
      state.resume = action.payload;
    },
    setJD: (state, action) => {
      state.jd = action.payload;
    },
    setParsedResume: (state, action) => {
      state.parsedResume = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      return initialState;
    },
  },
});

export const { setResume, setJD, setParsedResume, setLoading, setError, resetState } = appSlice.actions;

export default appSlice.reducer;
