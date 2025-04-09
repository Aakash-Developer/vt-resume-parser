import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ResumeEditor from "@/components/resume/ResumeEditor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { setParsedResume } from "@/store/features/app";
import { setResume } from "@/store/features/app";

const MainLayout = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const parsedResume = useSelector(
    (state: RootState) => state.app.parsedResume
  );

  if (!parsedResume) {
    return null;
  }

  const createNewResume = () => {
    dispatch(setResume(null));
    dispatch(setParsedResume(null));
    navigate("/");
  };

  return (
    <div className=" grid grid-rows-[auto_1fr] h-screen p-2">
      <div className=" px-4 flex  justify-between gap-2">
        <Button onClick={createNewResume}>
          Create New Resume
        </Button>
        <Button onClick={() => navigate("/preview-download")}>
          Preview & Download
        </Button>
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
