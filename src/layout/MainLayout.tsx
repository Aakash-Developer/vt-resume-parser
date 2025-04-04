import { useDispatch, useSelector } from "react-redux";
import { resetState } from "@/store/features/app";
import { useNavigate } from "react-router";
<<<<<<< HEAD
import { memo, Suspense } from "react";
=======
import { memo, useState } from "react";
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { RootState } from "@/store/store";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Download } from "lucide-react";
import ResumeEditor from "@/components/resume/ResumeEditor";

=======
import { Download, Eye } from "lucide-react";
import { ModernResumePDF } from "@/components/resume/ModernResumePDF";
import { ResumeData } from "@/types/resume";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumePDF } from "@/components/resume/ResumePDF";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeViewer } from "@/components/resume/ResumeViewer";
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
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
<<<<<<< HEAD
    <div className="h-screen bg-background p-2">
      <div className="grid grid-cols-2 h-full gap-4">
        <div className="grid gap-4 h-full grid-rows-[auto_1fr] overflow-y-auto ">
=======
    <div className="h-screen bg-background">
      <div className="grid grid-cols-2 h-full">
        <div className="p-4 flex flex-col gap-4">
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleReset}>
              Back to Upload
            </Button>
          </div>
<<<<<<< HEAD
          <div className=" h-full ">
            <ResumeEditor />
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex justify-end items-center">
            <Suspense fallback={<Button disabled>Generating PDF...</Button>}>
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
            </Suspense>
          </div>
          <div className="w-full h-full border rounded-lg overflow-hidden">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading PDF...</div>}>
              <PDFViewer showToolbar={false} className="w-full h-full">
                <ATSResumePDF data={parsedResume} />
              </PDFViewer>
            </Suspense>
          </div>
=======
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
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
