import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ResumeEditor from "@/components/resume/ResumeEditor";
import { ResumePreview } from "../components/ResumePreview";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const MainLayout = memo(() => {
  const parsedResume = useSelector(
    (state: RootState) => state.app.parsedResume
  );

  if (!parsedResume) {
    return null;
  }

  return (
    <div className=" grid grid-rows-[auto_1fr] h-screen p-2">
      <div className=" px-4 flex justify-end">
        <Link to="/preview-download">
          <Button>Preview & Download</Button>
        </Link>
      </div>
      <div className=" p-4 overflow-auto">
        <ResumeEditor />
      </div>
      {/* <div className=" p-4 overflow-auto">
        <div className="w-full h-full">
          <ResumePreview data={parsedResume} format="A4" />
        </div>
      </div> */}
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
