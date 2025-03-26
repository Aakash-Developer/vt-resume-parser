import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setParsedResume } from "@/store/features/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResumeData } from "@/types/resume";
import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "@/constants/keys";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const ResumeEditor = () => {
  const dispatch = useDispatch();
  const { parsedResume, jd } = useSelector((state: RootState) => state.app);
  const [activeTab, setActiveTab] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  if (!parsedResume) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">No resume data available. Please go back and upload a resume.</p>
        </div>
      </div>
    );
  }

  const generateWithAI = async (prompt: string) => {
    try {
      setIsGenerating(true);
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Generate content that is specific, measurable, and impactful. Your response must be a valid JSON object with no additional text or explanation. Do not include any markdown formatting or code blocks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content generated");

      // Try to extract JSON from the response
      try {
        // First try to parse the entire response as JSON
        return content;
      } catch {
        // If that fails, try to find JSON within the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return jsonMatch[0];
        }
        throw new Error("No valid JSON found in response");
      }
    } catch (error) {
      toast.error("Failed to generate content with AI");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateExperience = async (index: number) => {
    try {
      setGeneratingIndex(index);
      const jobTitle = parsedResume.personal.title;
      const prompt = `Generate a detailed job experience entry for a ${jobTitle} position. ${jd ? `Based on this job description: ${jd}` : ""} Return ONLY a JSON object with this exact structure:
      {
        "company": "Company name",
        "position": "Job position",
        "location": "Location",
        "startDate": "Start date",
        "endDate": "End date",
        "description": ["Description point 1", "Description point 2"],
        "achievements": ["Achievement 1", "Achievement 2"]
      }`;

      const generatedContent = await generateWithAI(prompt);
      if (!generatedContent) return;

      try {
        const parsedContent = JSON.parse(generatedContent);

        // Validate required fields
        const requiredFields = ["company", "position", "location", "startDate", "endDate", "description", "achievements"];
        const missingFields = requiredFields.filter((field) => !parsedContent[field]);

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }

        // Update experience with generated content
        handleExperienceUpdate(index, "company", parsedContent.company);
        handleExperienceUpdate(index, "position", parsedContent.position);
        handleExperienceUpdate(index, "location", parsedContent.location);
        handleExperienceUpdate(index, "startDate", parsedContent.startDate);
        handleExperienceUpdate(index, "endDate", parsedContent.endDate);
        handleExperienceUpdate(index, "description", parsedContent.description);
        handleExperienceUpdate(index, "achievements", parsedContent.achievements);

        toast.success("Experience generated successfully!");
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast.error("Failed to parse AI response. Please try again.");
      }
    } catch (error) {
      console.error("Error generating experience:", error);
      toast.error("Failed to generate experience. Please try again.");
    } finally {
      setGeneratingIndex(null);
    }
  };

  const handleGenerateSkills = async () => {
    try {
      setIsGenerating(true);
      const jobTitle = parsedResume.personal.title;
      const prompt = `Generate comprehensive skills for a ${jobTitle} position. ${jd ? `Based on this job description: ${jd}` : ""} Return ONLY a JSON object with this exact structure:
      {
        "technical": ["Technical skill 1", "Technical skill 2"],
        "soft": ["Soft skill 1", "Soft skill 2"],
        "tools": ["Tool 1", "Tool 2"],
        "certifications": ["Certification 1", "Certification 2"],
        "coreCompetencies": ["Competency 1", "Competency 2"]
      }`;

      const generatedContent = await generateWithAI(prompt);
      if (!generatedContent) return;

      try {
        const parsedContent = JSON.parse(generatedContent);

        // Validate required fields
        const requiredFields = ["technical", "soft", "tools", "certifications", "coreCompetencies"];
        const missingFields = requiredFields.filter((field) => !parsedContent[field]);

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }

        // Update skills with generated content
        handleSkillsUpdate("technical", parsedContent.technical);
        handleSkillsUpdate("soft", parsedContent.soft);
        handleSkillsUpdate("tools", parsedContent.tools);
        handleSkillsUpdate("certifications", parsedContent.certifications);
        handleSkillsUpdate("coreCompetencies", parsedContent.coreCompetencies);

        toast.success("Skills generated successfully!");
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast.error("Failed to parse AI response. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePersonalUpdate = (field: keyof typeof parsedResume.personal, value: string) => {
    dispatch(
      setParsedResume({
        ...parsedResume,
        personal: {
          ...parsedResume.personal,
          [field]: value,
        },
      })
    );
  };

  const handleExperienceUpdate = (index: number, field: string, value: any) => {
    const newExperience = [...(parsedResume.experience || [])];
    newExperience[index] = {
      ...newExperience[index],
      [field]: field === "description" || field === "achievements" ? value : value,
    };
    dispatch(
      setParsedResume({
        ...parsedResume,
        experience: newExperience,
      })
    );
  };

  const handleEducationUpdate = (index: number, field: string, value: any) => {
    const newEducation = [...(parsedResume.education || [])];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    dispatch(
      setParsedResume({
        ...parsedResume,
        education: newEducation,
      })
    );
  };

  const handleSkillsUpdate = (category: keyof typeof parsedResume.skills, value: string[]) => {
    dispatch(
      setParsedResume({
        ...parsedResume,
        skills: {
          ...parsedResume.skills,
          [category]: value.filter(Boolean),
        },
      })
    );
  };

  const handleAddExperience = () => {
    dispatch(
      setParsedResume({
        ...parsedResume,
        experience: [
          ...(parsedResume.experience || []),
          {
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            description: [""],
            achievements: [""],
            type: "full-time",
          },
        ],
      })
    );
  };

  const handleAddEducation = () => {
    dispatch(
      setParsedResume({
        ...parsedResume,
        education: [
          ...(parsedResume.education || []),
          {
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
          },
        ],
      })
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Personal
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Skills
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input value={parsedResume.personal.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input value={parsedResume.personal.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("title", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={parsedResume.personal.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={parsedResume.personal.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input value={parsedResume.personal.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("location", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input value={parsedResume.personal.linkedin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonalUpdate("linkedin", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Summary</label>
                    <Textarea value={parsedResume.personal.summary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePersonalUpdate("summary", e.target.value)} rows={4} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Experience</CardTitle>
                    <Button onClick={handleAddExperience} size="sm" className="transition-all hover:scale-105">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {(parsedResume.experience || []).map((exp: ResumeData["experience"][0], index: number) => (
                    <div key={index} className="space-y-4 p-6 border rounded-lg bg-card hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">Experience {index + 1}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleGenerateExperience(index)} disabled={generatingIndex === index} className="transition-all hover:scale-105">
                            {generatingIndex === index ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Generate with AI
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newExperience = parsedResume.experience.filter((_, i) => i !== index);
                              dispatch(
                                setParsedResume({
                                  ...parsedResume,
                                  experience: newExperience,
                                })
                              );
                            }}
                            className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Company</label>
                          <Input value={exp.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceUpdate(index, "company", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Position</label>
                          <Input value={exp.position} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceUpdate(index, "position", e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Start Date</label>
                          <Input value={exp.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceUpdate(index, "startDate", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">End Date</label>
                          <Input value={exp.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceUpdate(index, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input value={exp.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceUpdate(index, "location", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={exp.description?.join("\n") || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const lines = e.target.value.split("\n").filter(Boolean);
                            handleExperienceUpdate(index, "description", lines);
                          }}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Achievements</label>
                        <Textarea
                          value={exp.achievements?.join("\n") || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const lines = e.target.value.split("\n").filter(Boolean);
                            handleExperienceUpdate(index, "achievements", lines);
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Education</CardTitle>
                    <Button onClick={handleAddEducation} size="sm" className="transition-all hover:scale-105">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {(parsedResume.education || []).map((edu, index) => (
                    <div key={index} className="space-y-4 p-6 border rounded-lg bg-card hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">Education {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newEducation = parsedResume.education.filter((_, i) => i !== index);
                            dispatch(
                              setParsedResume({
                                ...parsedResume,
                                education: newEducation,
                              })
                            );
                          }}
                          className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Institution</label>
                          <Input value={edu.institution} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "institution", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Degree</label>
                          <Input value={edu.degree} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "degree", e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Field of Study</label>
                          <Input value={edu.field} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "field", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">GPA</label>
                          <Input value={edu.gpa || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "gpa", e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Start Date</label>
                          <Input value={edu.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "startDate", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">End Date</label>
                          <Input value={edu.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input value={edu.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEducationUpdate(index, "location", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Skills</CardTitle>
                    <Button onClick={handleGenerateSkills} size="sm" disabled={isGenerating} className="transition-all hover:scale-105">
                      {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Generate with AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <label className="text-sm font-medium">Technical Skills</label>
                    <Textarea value={(parsedResume.skills?.technical || []).join("\n")} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSkillsUpdate("technical", e.target.value.split("\n").filter(Boolean))} placeholder="Enter technical skills (one per line)" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Soft Skills</label>
                    <Textarea value={(parsedResume.skills?.soft || []).join("\n")} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSkillsUpdate("soft", e.target.value.split("\n").filter(Boolean))} placeholder="Enter soft skills (one per line)" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tools & Technologies</label>
                    <Textarea value={(parsedResume.skills?.tools || []).join("\n")} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSkillsUpdate("tools", e.target.value.split("\n").filter(Boolean))} placeholder="Enter tools and technologies (one per line)" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Certifications</label>
                    <Textarea value={(parsedResume.skills?.certifications || []).join("\n")} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSkillsUpdate("certifications", e.target.value.split("\n").filter(Boolean))} placeholder="Enter certifications (one per line)" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Core Competencies</label>
                    <Textarea value={(parsedResume.skills?.coreCompetencies || []).join("\n")} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSkillsUpdate("coreCompetencies", e.target.value.split("\n").filter(Boolean))} placeholder="Enter core competencies (one per line)" rows={4} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
