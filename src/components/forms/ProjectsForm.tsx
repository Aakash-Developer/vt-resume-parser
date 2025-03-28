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

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string().min(2, "Project title must be at least 2 characters"),
      description: z.array(z.string()),
      technologies: z.array(z.string()),
      startDate: z.string(),
      endDate: z.string(),
      role: z.string().min(2, "Role must be at least 2 characters"),
      institution: z.string().optional(),
      location: z.string().optional(),
      links: z.array(z.string()),
    })
  ),
});

type ProjectsFormValues = z.infer<typeof projectsSchema>;

export function ProjectsForm() {
  const dispatch = useDispatch();
  const parsedResume = useSelector((state: RootState) => state.app.parsedResume);

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: parsedResume?.projects || [{
        title: "",
        description: [""],
        technologies: [""],
        startDate: "",
        endDate: "",
        role: "",
        institution: "",
        location: "",
        links: [""],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Update store when form changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData.projects || !parsedResume) return;

      const validProjects = formData.projects.filter(Boolean).map(proj => ({
        title: proj?.title || "",
        role: proj?.role || "",
        institution: proj?.institution || "",
        location: proj?.location || "",
        startDate: proj?.startDate || "",
        endDate: proj?.endDate || "",
        description: (proj?.description || []).filter(Boolean),
        technologies: (proj?.technologies || []).filter(Boolean),
        links: (proj?.links || []).filter(Boolean)
      }));

      dispatch(setParsedResume({
        ...parsedResume,
        projects: validProjects
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, parsedResume, dispatch]);

  // Reset form when parsedResume changes
  useEffect(() => {
    if (!parsedResume?.projects) return;
    
    const validProjects = parsedResume.projects.filter(Boolean).map(proj => ({
      ...proj,
      description: Array.isArray(proj?.description) ? proj.description : [],
      technologies: Array.isArray(proj?.technologies) ? proj.technologies : [],
      links: Array.isArray(proj?.links) ? proj.links : []
    }));
    
    form.reset({ projects: validProjects });
  }, [parsedResume?.projects, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Project {index + 1}</h3>
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
                    name={`projects.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Lead Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution/Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Company/University Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.location`}
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
                    name={`projects.${index}.startDate`}
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
                    name={`projects.${index}.endDate`}
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Description</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentDescriptions = form.getValues(`projects.${index}.description`) || [];
                        form.setValue(`projects.${index}.description`, [...currentDescriptions, ""], { shouldValidate: true });
                      }}
                    >
                      Add Description
                    </Button>
                  </div>
                  {(form.watch(`projects.${index}.description`) || []).map((_, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.description.${descIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Enter project description"
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
                            const currentDescriptions = form.getValues(`projects.${index}.description`) || [];
                            form.setValue(`projects.${index}.description`, currentDescriptions.filter((_, i) => i !== descIndex), { shouldValidate: true });
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
                    <h4 className="font-medium">Technologies Used</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentTechnologies = form.getValues(`projects.${index}.technologies`) || [];
                        form.setValue(`projects.${index}.technologies`, [...currentTechnologies, ""], { shouldValidate: true });
                      }}
                    >
                      Add Technology
                    </Button>
                  </div>
                  {(form.watch(`projects.${index}.technologies`) || []).map((_, techIndex) => (
                    <div key={techIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.technologies.${techIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter technology"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {techIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const currentTechnologies = form.getValues(`projects.${index}.technologies`) || [];
                            form.setValue(`projects.${index}.technologies`, currentTechnologies.filter((_, i) => i !== techIndex), { shouldValidate: true });
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
                    <h4 className="font-medium">Project Links</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentLinks = form.getValues(`projects.${index}.links`) || [];
                        form.setValue(`projects.${index}.links`, [...currentLinks, ""], { shouldValidate: true });
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                  {(form.watch(`projects.${index}.links`) || []).map((_, linkIndex) => (
                    <div key={linkIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.links.${linkIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter project link"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {linkIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const currentLinks = form.getValues(`projects.${index}.links`) || [];
                            form.setValue(`projects.${index}.links`, currentLinks.filter((_, i) => i !== linkIndex), { shouldValidate: true });
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
                  title: "",
                  description: [""],
                  technologies: [""],
                  startDate: "",
                  endDate: "",
                  role: "",
                  institution: "",
                  location: "",
                  links: [""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 