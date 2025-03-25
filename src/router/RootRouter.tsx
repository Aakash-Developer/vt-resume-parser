import MainLayout from "@/layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router";

const RootRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
