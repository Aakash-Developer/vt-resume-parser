import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { resumeParserAPI } from "@/services/resumeParser";
import { useMutation } from "@tanstack/react-query";
import ScreenLoader from "@/components/ScreenLoader";
import { useDispatch } from "react-redux";
import { setResume, setJD, setParsedResume } from "@/store/features/app";
import { useNavigate } from "react-router";

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
    // Store the raw resume and JD text
    dispatch(setResume(data.resume));
    if (data.jobDescription) {
      dispatch(setJD(data.jobDescription));
    }
    // Parse the resume
    parseResume(data.resume);
  }

  if (isPending) {
    return <ScreenLoader />;
  }

  return (
    <section className="h-screen flex items-center justify-center patternBg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl px-10 py-16 shadow-xl rounded-xl bg-white">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste resume details here..." className="min-h-32 max-h-52" rows={25} {...field} />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste Job Description" className="min-h-32 max-h-52" {...field} rows={25} />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? "Please wait..." : "Submit"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
