import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "@/components/resume/ResumePDF";
import { ResumeTemplate } from "@/types/resume";

const templates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design with emphasis on readability",
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description: "Timeless layout with traditional formatting",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Simple and elegant design with plenty of white space",
  },
];

const ResumePreview = () => {
  const { parsedResume } = useSelector((state: RootState) => state.app);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");

  if (!parsedResume) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No resume data available. Please go back and upload a resume.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Resume Preview</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <PDFDownloadLink document={<ResumePDF data={parsedResume} template={selectedTemplate} />} fileName={`${parsedResume.personal.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`}>
              {({ loading }) => (
                <Button disabled={loading} className="transition-all hover:scale-105">
                  {loading ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="h-full w-full">
            <PDFViewer width="100%" height="100%" className="border-0">
              <ResumePDF data={parsedResume} template={selectedTemplate} />
            </PDFViewer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
