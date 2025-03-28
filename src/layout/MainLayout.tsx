import { useDispatch, useSelector } from "react-redux";
import { resetState } from "@/store/features/app";
import { useNavigate } from "react-router";
import { memo, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { RootState } from "@/store/store";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { ModernResumePDF } from "@/components/resume/ModernResumePDF";
import { ResumeData } from "@/types/resume";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumePDF } from "@/components/resume/ResumePDF";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeViewer } from "@/components/resume/ResumeViewer";
const MainLayout = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parsedResume = useSelector(
    (state: RootState) => state.app.parsedResume
  );

  const handleReset = () => {
    dispatch(resetState());
    navigate("/");
  };

  if (!parsedResume) {
    return <div>No resume data available</div>;
  }

  return (
    <div className="h-screen bg-background">
      <div className="grid grid-cols-2 h-full">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleReset}>
              Back to Upload
            </Button>
          </div>
          {/* <ResumeEditor /> */}
        </div>
        <div className=" grid grid-rows-[auto_1fr] gap-4  ">
          <div>
            <PDFDownloadLink
              document={<ATSResumePDF data={parsedResume} />}
              fileName={`${parsedResume.personal.name.replace(
                /\s+/g,
                "_"
              )}_Resume.pdf`}
              className="flex items-center gap-2"
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  {loading ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
          <PDFViewer   showToolbar={false} className="w-full h-full">
            {/* <ModernResumePDF data={parsedResume} /> */}
            <ATSResumePDF data={parsedResume} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
