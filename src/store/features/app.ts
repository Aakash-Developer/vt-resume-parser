import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "todos",
  initialState: {
    resume: "",
    jd: "",
    loading: false,
    error: null,
  },
  reducers: {
    setResume: (state, action) => {
      state.resume = action.payload;
    },
    setJD: (state, action) => {
      state.jd = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setResume, setJD, setLoading, setError } = appSlice.actions;
export default appSlice.reducer;
