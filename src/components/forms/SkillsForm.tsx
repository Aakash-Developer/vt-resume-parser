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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setParsedResume } from "@/store/features/app";
import { useEffect } from "react";

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string().min(2, "Category name must be at least 2 characters"),
      items: z.array(z.string().min(1, "Skill cannot be empty")),
    })
  ),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

export function SkillsForm() {
  const dispatch = useDispatch();
  const parsedResume = useSelector((state: RootState) => state.app.parsedResume);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: parsedResume?.skills ? Object.entries(parsedResume.skills).map(([category, items]) => ({
        category,
        items: items || []
      })) : [{
        category: "Technical Skills",
        items: [""],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  // Update store when form changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData.skills || !parsedResume) return;

      const transformedSkills = formData.skills.reduce((acc, skill) => {
        if (!skill?.category || !skill?.items) return acc;
        return {
          ...acc,
          [skill.category.toLowerCase()]: skill.items.filter(Boolean)
        };
      }, {});
      
      dispatch(setParsedResume({
        ...parsedResume,
        skills: transformedSkills
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, parsedResume, dispatch]);

  // Reset form when parsedResume changes
  useEffect(() => {
    if (!parsedResume?.skills) return;
    
    const transformedSkills = Object.entries(parsedResume.skills).map(([category, items]) => ({
      category: category,
      items: Array.isArray(items) ? items : []
    }));
    
    form.reset({ skills: transformedSkills });
  }, [parsedResume?.skills, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Category {index + 1}</h3>
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

                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technical Skills, Soft Skills" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Skills</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentItems = form.getValues(`skills.${index}.items`) || [];
                        form.setValue(`skills.${index}.items`, [...currentItems, ""], { shouldValidate: true });
                      }}
                    >
                      Add Skill
                    </Button>
                  </div>
                  {(form.watch(`skills.${index}.items`) || []).map((_, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`skills.${index}.items.${itemIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter skill"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {itemIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const currentItems = form.getValues(`skills.${index}.items`) || [];
                            form.setValue(`skills.${index}.items`, currentItems.filter((_, i) => i !== itemIndex), { shouldValidate: true });
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
                  category: "",
                  items: [""],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 