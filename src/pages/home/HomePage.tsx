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
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  resume: z.string({ message: "Resume details is required." }),
  jobDescription: z.string().optional(),
});

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.jobDescription) {
      dispatch(setJD(data.jobDescription));
    }
    dispatch(setResume(data.resume));
    parseResume(data.resume);
  }

  return (
    <section className="patternBg h-screen flex items-center justify-center">
      <div className=" w-full max-w-xl mx-auto p-10 bg-white rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your resume details here..."
                      className="min-h-[150px] max-h-[150px]"
                      {...field}
                    />
                  </FormControl>
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
            <Button disabled={isPending}  type="submit" className="w-full disabled:opacity-50">
              {isPending ? <span className="flex items-center justify-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Please wait...</span> : "Parse Resume"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
