import ResumePreview from "@/pages/dashboard/resume/ResumePreview";
import ResumeEditor from "@/pages/dashboard/resumeEditor/ResumeEditor";

const MainLayout = () => {
  return (
    <section className=" grid grid-cols-[600px_1fr]">
      <div className="bg-white h-screen overflow-y-auto">
        <ResumeEditor />
      </div>
      <div className="bg-slate-500 h-screen overflow-y-auto">
        <ResumePreview />
      </div>
    </section>
  );
};

export default MainLayout;
