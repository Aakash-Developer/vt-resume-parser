import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, PencilLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";
import { resetState } from "@/store/features/app";
import ResumeAnalyze from "./home/ResumeAnalyze";
import { ResumeColorPicker } from "@/components/resume/ResumeColorPicker";

export default function DownloadPage() {
  const { parsedResume } = useSelector((state: RootState) => state.app);
  const [primaryColor, setPrimaryColor] = useState("#ab2034");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateNewResume = () => {
    dispatch(resetState());
    navigate("/");
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <div className="relative">
      {parsedResume ? (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr] md:h-screen gap-4 bg-[#282828]">
          <div className="flex flex-col gap-2 p-3 sm:p-4 h-full md:overflow-y-auto order-2 lg:order-1">
            <Button
              onClick={handleCreateNewResume}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-600 text-white hover:bg-slate-700 h-10 px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="text-xs sm:text-sm">New resume</span>
            </Button>

            <Button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
            >
              <PencilLine className="w-4 h-4 mr-1" />
              <span className="text-xs sm:text-sm">Edit Resume</span>
            </Button>
            
            
            <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium">Customize Resume Color</h3>
              <ResumeColorPicker 
                onColorChange={handleColorChange} 
                initialColor={primaryColor} 
              />
            </div>
            
            
            <ResumeAnalyze useDialog={false} showSuggestions={false} />
            
            <PDFDownloadLink
              document={<ATSResumePDF data={parsedResume} primaryColor={primaryColor} />}
              fileName={`${parsedResume.personal.name.replace(
                /\s+/g,
                "_"
              )}_Resume.pdf`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {({ loading }) => (
                <Button
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">
                    {loading ? "Preparing PDF..." : "Download PDF"}
                  </span>
                </Button>
              )}
            </PDFDownloadLink>
          </div>
          
          <div className="h-[50vh] lg:h-screen w-full order-1 lg:order-2">
            <PDFViewer showToolbar={false} className="h-full w-full">
              <ATSResumePDF data={parsedResume} primaryColor={primaryColor} />
            </PDFViewer>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-sm sm:text-base text-center px-4">
            No resume data available. Please create or upload a resume first.
          </p>
        </div>
      )}
    </div>
  );
}
