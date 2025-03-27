import { useDispatch, useSelector } from "react-redux";
import { resetState } from "@/store/features/app";
import { useNavigate } from "react-router";
import { memo, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { RootState } from "@/store/store";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { ClassicResumePDF } from "@/components/resume/ClassicResumePDF";
import { ModernResumePDF } from "@/components/resume/ModernResumePDF";
import { ResumeData } from "@/types/resume";

const MainLayout = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewId, setPreviewId] = useState<number | null>(1);
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

  function getPreview(data: ResumeData) {
    switch (previewId) {
      case 1:
        return <ClassicResumePDF data={data} />;
      case 2:
        return <ModernResumePDF data={data} />;
      case 3:
        return <ATSResumePDF data={data} />;
      default:
        return <ClassicResumePDF data={data} />;
    }
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
            <Button variant="outline" onClick={() => setPreviewId(1)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => setPreviewId(2)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => setPreviewId(3)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <PDFViewer showToolbar={false} className="w-full h-full">
            {getPreview(parsedResume)}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
