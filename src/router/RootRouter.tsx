import MainLayout from "@/layout/MainLayout";
import ResumePreview from "@/pages/dashboard/resume/ResumePreview";
import HomePage from "@/pages/home/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";

const RootRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<MainLayout/>} >
        <Route index element={<ResumePreview/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
