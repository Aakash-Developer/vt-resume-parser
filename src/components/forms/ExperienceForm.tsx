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

const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(2, "Company name must be at least 2 characters"),
      position: z.string().min(2, "Position must be at least 2 characters"),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.array(z.string()),
      achievements: z.array(z.string()),
    })
  ),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
  const dispatch = useDispatch();
  const parsedResume = useSelector((state: RootState) => state.app.parsedResume);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: parsedResume?.experience || [{
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        description: [""],
        achievements: [""],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // Update store when form changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData.experiences || !parsedResume) return;

      const validExperiences = formData.experiences.filter(Boolean).map(exp => ({
        company: exp?.company || "",
        position: exp?.position || "",
        location: exp?.location || "",
        startDate: exp?.startDate || "",
        endDate: exp?.endDate || "",
        description: (exp?.description || []).filter(Boolean),
        achievements: (exp?.achievements || []).filter(Boolean)
      }));

      dispatch(setParsedResume({
        ...parsedResume,
        experience: validExperiences
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, parsedResume, dispatch]);

  // Reset form when parsedResume changes
  useEffect(() => {
    if (!parsedResume?.experience) return;
    
    const validExperience = parsedResume.experience.filter(Boolean).map(exp => ({
      ...exp,
      description: Array.isArray(exp?.description) ? exp.description : [],
      achievements: Array.isArray(exp?.achievements) ? exp.achievements : []
    }));
    
    form.reset({ experiences: validExperience });
  }, [parsedResume?.experience, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
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
                    name={`experiences.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Job Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.location`}
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
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
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
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.endDate`}
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Job Description</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentDescriptions = form.getValues(`experiences.${index}.description`) || [];
                        form.setValue(`experiences.${index}.description`, [...currentDescriptions, ""], { shouldValidate: true });
                      }}
                    >
                      Add Description
                    </Button>
                  </div>
                  {(form.watch(`experiences.${index}.description`) || []).map((_, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.description.${descIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Enter job description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {descIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const currentDescriptions = form.getValues(`experiences.${index}.description`) || [];
                            form.setValue(`experiences.${index}.description`, currentDescriptions.filter((_, i) => i !== descIndex), { shouldValidate: true });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Key Achievements</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentAchievements = form.getValues(`experiences.${index}.achievements`) || [];
                        form.setValue(`experiences.${index}.achievements`, [...currentAchievements, ""], { shouldValidate: true });
                      }}
                    >
                      Add Achievement
                    </Button>
                  </div>
                  {(form.watch(`experiences.${index}.achievements`) || []).map((_, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.achievements.${achievementIndex}`}
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
                            const currentAchievements = form.getValues(`experiences.${index}.achievements`) || [];
                            form.setValue(`experiences.${index}.achievements`, currentAchievements.filter((_, i) => i !== achievementIndex), { shouldValidate: true });
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
                  company: "",
                  position: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  description: [""],
                  achievements: [""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 