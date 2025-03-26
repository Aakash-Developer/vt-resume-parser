import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/home/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";

const RootRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
