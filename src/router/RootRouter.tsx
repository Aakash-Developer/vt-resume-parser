import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/home/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";
import DownloadPage from "@/pages/DownloadPage";

const RootRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<MainLayout />} />
        <Route path="/preview-download" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
