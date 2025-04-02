import { useDispatch, useSelector } from "react-redux";
import { resetState } from "@/store/features/app";
import { useNavigate } from "react-router";
import { memo, Suspense } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { RootState } from "@/store/store";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ResumeEditor from "@/components/resume/ResumeEditor";

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
    <div className="h-screen bg-background p-2">
      <div className="grid grid-cols-2 h-full gap-4">
        <div className="grid gap-4 h-full grid-rows-[auto_1fr] overflow-y-auto ">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleReset}>
              Back to Upload
            </Button>
          </div>
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
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
