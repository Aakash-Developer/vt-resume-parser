import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./features/app"

export const store = configureStore({
  reducer: {
    app: appSlice,
  },
});
