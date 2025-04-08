import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ResumePDF } from "@/components/ResumePreview";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ATSResumePDF } from "@/components/resume/ATSResumePDF";

export default function DownloadPage() {
  const { parsedResume } = useSelector((state: RootState) => state.app);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className=" relative">
      {parsedResume ? (
        <>
          <div className=" absolute top-4 right-6  flex gap-2">
            <Button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <PencilLine />
              Edit Resume
            </Button>
            <PDFDownloadLink
              document={<ResumePDF data={parsedResume} />}
              fileName={`${parsedResume.personal.name.replace(
                /\s+/g,
                "_"
              )}_Resume.pdf`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {({ loading, error: pdfError }) => {
                if (pdfError) {
                  console.error("PDF generation error:", pdfError);
                  setError("Failed to generate PDF. Please try again.");
                }
                return (
                  <Button
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {loading ? "Preparing PDF..." : "Download PDF"}
                  </Button>
                );
              }}
            </PDFDownloadLink>
          </div>
          <PDFViewer showToolbar={false} className="h-screen w-screen">
            <ATSResumePDF data={parsedResume} />
          </PDFViewer>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>
            No resume data available. Please create or upload a resume first.
          </p>
        </div>
      )}
    </div>
  );
}
