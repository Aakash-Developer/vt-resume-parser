import { ResumeData } from "@/types/resume";
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  parsedResume: ResumeData | null;
  resume: string | null;
  jd: string | null;
}

const initialState: AppState = {
  parsedResume: null,
  resume: null,
  jd: null
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setParsedResume: (state, action) => {
      state.parsedResume = action.payload;
    },
    setResume: (state, action) => {
      state.resume = action.payload;
    },
    setJD: (state, action) => {
      state.jd = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const { setParsedResume, setResume, setJD, resetState } = appSlice.actions;

export default appSlice.reducer;
