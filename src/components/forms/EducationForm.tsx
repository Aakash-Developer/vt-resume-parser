import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setParsedResume } from "@/store/features/app";
import { useEffect } from "react";

const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(2, "Institution name must be at least 2 characters"),
      degree: z.string().min(2, "Degree must be at least 2 characters"),
      field: z.string().min(2, "Field of study must be at least 2 characters"),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      gpa: z.string().optional(),
      achievements: z.array(z.string()),
    })
  ),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export function EducationForm() {
  const dispatch = useDispatch();
  const parsedResume = useSelector((state: RootState) => state.app.parsedResume);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: parsedResume?.education || [{
        institution: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
        achievements: [""],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  // Update store when form changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData.education || !parsedResume) return;

      const validEducation = formData.education.filter(Boolean).map(edu => ({
        institution: edu?.institution || "",
        degree: edu?.degree || "",
        field: edu?.field || "",
        startDate: edu?.startDate || "",
        endDate: edu?.endDate || "",
        gpa: edu?.gpa || "",
        location: edu?.location || "",
        achievements: (edu?.achievements || []).filter(Boolean)
      }));

      dispatch(setParsedResume({
        ...parsedResume,
        education: validEducation
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, parsedResume, dispatch]);

  // Reset form when parsedResume changes
  useEffect(() => {
    if (!parsedResume?.education) return;
    
    const validEducation = parsedResume.education.filter(Boolean).map(edu => ({
      ...edu,
      achievements: Array.isArray(edu?.achievements) ? edu.achievements : []
    }));
    
    form.reset({ education: validEducation });
  }, [parsedResume?.education, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="University/College Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bachelor's, Master's" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.field`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`education.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3.8/4.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Achievements</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentAchievements = form.getValues(`education.${index}.achievements`) || [];
                        form.setValue(`education.${index}.achievements`, [...currentAchievements, ""], { shouldValidate: true });
                      }}
                    >
                      Add Achievement
                    </Button>
                  </div>
                  {(form.watch(`education.${index}.achievements`) || []).map((_, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`education.${index}.achievements.${achievementIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Enter achievement"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {achievementIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const currentAchievements = form.getValues(`education.${index}.achievements`) || [];
                            form.setValue(`education.${index}.achievements`, currentAchievements.filter((_, i) => i !== achievementIndex), { shouldValidate: true });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  institution: "",
                  degree: "",
                  field: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  gpa: "",
                  achievements: [""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 