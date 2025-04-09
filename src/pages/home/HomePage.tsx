import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { resumeParserAPI } from "@/services/resumeParser";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setJD, setResume, setParsedResume } from "@/store/features/app";
import { useNavigate } from "react-router";
import { Loader2, Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FormSchema = z.object({
  resume: z.string({ message: "Resume details is required." }),
  jobDescription: z.string().optional(),
});

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutateAsync: parseResume, isPending } = useMutation({
    mutationFn: async (resume: string) => resumeParserAPI(resume),
    onSuccess: (data) => {
      dispatch(setParsedResume(data));
      toast.success("Resume parsed successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const extractTextFromPDF = async (file: File): Promise<string> => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast.error("Failed to extract text from PDF. Please try pasting the text directly.");
      return "";
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setUploadedFileName(file.name);
    const extractedText = await extractTextFromPDF(file);
    
    if (extractedText) {
      form.setValue("resume", extractedText);
      toast.success("Text extracted from PDF successfully!");
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.jobDescription) {
      dispatch(setJD(data.jobDescription));
    }
    dispatch(setResume(data.resume));
    parseResume(data.resume);
  }

  return (
    <section className="patternBg h-screen flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto p-10 bg-white rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Details</FormLabel>
                  <div className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        {isExtracting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Extracting text from PDF...</span>
                          </div>
                        ) : isDragActive ? (
                          <p>Drop the PDF here</p>
                        ) : (
                          <p>Drag & drop a PDF resume here, or click to select</p>
                        )}
                        {uploadedFileName && (
                          <p className="text-sm text-primary flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {uploadedFileName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder="Or paste your resume details here..."
                        className="min-h-[150px] max-h-[150px]"
                        {...field}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the job description here..."
                      className="min-h-[150px] max-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              disabled={isPending || isExtracting} 
              type="submit" 
              className="w-full disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Please wait...
                </span>
              ) : (
                "Parse Resume"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
