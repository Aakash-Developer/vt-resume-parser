import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setParsedResume } from "@/store/features/app";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  generateExperienceContent,
  generateSummaryContent,
} from "@/utils/openai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ResumeEditor = () => {
  const dispatch = useDispatch();
  const parsedResume = useSelector(
    (state: RootState) => state.app.parsedResume
  );
  const jd = useSelector((state: RootState) => state.app.jd);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingExperience, setIsGeneratingExperience] = useState<
    number | null
  >(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Initialize resumeData when parsedResume changes
  useEffect(() => {
    if (parsedResume) {
      setResumeData(parsedResume);
    }
  }, [parsedResume]);

  // Sanitize data before updating Redux store
  const sanitizeData = useCallback((data: ResumeData): ResumeData => {
    return {
      ...data,
      personal: {
        name: data.personal.name || "",
        title: data.personal.title || "",
        email: data.personal.email || "",
        phone: data.personal.phone || "",
        location: data.personal.location || "",
        linkedin: data.personal.linkedin || "",
        summary: data.personal.summary || "",
      },
      experience: data.experience.map((exp) => ({
        company: exp.company || "",
        position: exp.position || "",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description?.length ? exp.description : [""],
        achievements: exp.achievements?.length ? exp.achievements : [],
        type: exp.type || "full-time",
      })),
      education: data.education.map((edu) => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        location: edu.location || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: edu.gpa || "",
        achievements: edu.achievements?.length ? edu.achievements : [],
      })),
      skills: {
        technical: data.skills.technical?.length ? data.skills.technical : [],
        soft: data.skills.soft?.length ? data.skills.soft : [],
        tools: data.skills.tools?.length ? data.skills.tools : [],
        certifications: data.skills.certifications?.length
          ? data.skills.certifications
          : [],
        coreCompetencies: data.skills.coreCompetencies?.length
          ? data.skills.coreCompetencies
          : [],
      },
      projects: data.projects?.map((proj) => ({
        title: proj.title || "",
        description: proj.description?.length ? proj.description : [""],
        technologies: proj.technologies?.length ? proj.technologies : [],
        startDate: proj.startDate || "",
        endDate: proj.endDate || "",
        role: proj.role || "",
        institution: proj.institution || "",
        location: proj.location || "",
        links: proj.links?.length ? proj.links : [],
      })),
    };
  }, []);

  // Update Redux store with debounce
  useEffect(() => {
    if (resumeData) {
      const sanitizedData = sanitizeData(resumeData);
      // Only update if the data has actually changed
      if (JSON.stringify(sanitizedData) !== JSON.stringify(parsedResume)) {
        dispatch(setParsedResume(sanitizedData));
      }
    }
  }, [resumeData, dispatch, parsedResume, sanitizeData]);

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const handlePersonalChange = (
    field: keyof ResumeData["personal"],
    value: string
  ) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        personal: {
          ...prev.personal,
          [field]: value || "",
        },
      };
    });
  };

  const handleExperienceChange = (
    index: number,
    field: keyof ResumeData["experience"][0],
    value: string | string[]
  ) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === index
            ? { ...exp, [field]: value || (Array.isArray(value) ? [""] : "") }
            : exp
        ),
      };
    });
  };

  const handleEducationChange = (
    index: number,
    field: keyof ResumeData["education"][0],
    value: string
  ) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        education: prev.education.map((edu, i) =>
          i === index ? { ...edu, [field]: value || "" } : edu
        ),
      };
    });
  };

  const handleSkillsChange = (
    category: keyof ResumeData["skills"],
    value: string[]
  ) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: value?.length ? value : [],
        },
      };
    });
  };

  const handleProjectChange = (
    index: number,
    field: keyof ResumeData["projects"][0],
    value: string | string[]
  ) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        projects: prev.projects.map((proj, i) =>
          i === index
            ? { ...proj, [field]: value || (Array.isArray(value) ? [] : "") }
            : proj
        ),
      };
    });
  };

  const addExperience = () => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        experience: [
          ...prev.experience,
          {
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            description: [""],
            achievements: [],
            type: "full-time",
          },
        ],
      };
    });
  };

  const addEducation = () => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        education: [
          ...prev.education,
          {
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            achievements: [],
          },
        ],
      };
    });
  };

  const addProject = () => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        projects: [
          ...prev.projects,
          {
            title: "",
            description: [""],
            technologies: [],
            startDate: "",
            endDate: "",
            role: "",
            institution: "",
            location: "",
            links: [],
          },
        ],
      };
    });
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index),
      };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      };
    });
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => {
      if (!prev) return null;
      const newProjects = prev.projects.filter((_, i) => i !== index);
      return {
        ...prev,
        projects:
          newProjects.length === 0
            ? [
                {
                  title: "",
                  description: [""],
                  technologies: [],
                  startDate: "",
                  endDate: "",
                  role: "",
                  institution: "",
                  location: "",
                  links: [],
                },
              ]
            : newProjects,
      };
    });
  };

  const handleGenerateSummary = async () => {
    if (!resumeData) return;

    try {
      setIsGeneratingSummary(true);
      const generatedSummary = await generateSummaryContent(
        jd,
        resumeData.personal.summary
      );
      if (generatedSummary) {
        setResumeData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            personal: {
              ...prev.personal,
              summary: generatedSummary,
            },
          };
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please check your input and try again.";
      toast.error("Failed to generate summary", {
        description: errorMessage,
        duration: 5000,
        descriptionClassName: "bg-black text-white p-2 rounded-md",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateExperience = async (index: number) => {
    if (!resumeData) return;

    try {
      setIsGeneratingExperience(index);
      const generatedDescription = await generateExperienceContent(
        jd,
        resumeData.experience[index].company,
        resumeData.experience[index].position
      );
      if (generatedDescription) {
        setResumeData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            experience: prev.experience.map((exp, i) =>
              i === index
                ? { ...exp, description: generatedDescription.description }
                : exp
            ),
          };
        });
        toast.success("Experience content generated successfully!", {
          description: "The AI has updated your experience description.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please check your input and try again.";
      toast.error("Failed to generate experience content", {
        description: errorMessage,
        duration: 5000,
        descriptionClassName: "bg-black text-white p-2 rounded-md",
      });
    } finally {
      setIsGeneratingExperience(null);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 bg-white z-10">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Information */}
        <TabsContent
          value="personal"
          className="space-y-4 p-4 border rounded-lg"
        >
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={resumeData.personal.name}
              onChange={(e) => handlePersonalChange("name", e.target.value)}
            />
            <Input
              placeholder="Title"
              value={resumeData.personal.title}
              onChange={(e) => handlePersonalChange("title", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={resumeData.personal.email}
              onChange={(e) => handlePersonalChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={resumeData.personal.phone}
              onChange={(e) => handlePersonalChange("phone", e.target.value)}
            />
            <Input
              placeholder="Location"
              value={resumeData.personal.location}
              onChange={(e) => handlePersonalChange("location", e.target.value)}
            />
            <Input
              placeholder="LinkedIn"
              value={resumeData.personal.linkedin}
              onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
            />
            <div className="flex flex-col justify-end">
              <Textarea
                placeholder="Summary"
                className="rounded-b-none"
                value={resumeData.personal.summary}
                onChange={(e) =>
                  handlePersonalChange("summary", e.target.value)
                }
              />
              <Button
                onClick={handleGenerateSummary}
                variant="outline"
                disabled={isGeneratingSummary}
                className="flex items-center gap-2 rounded-t-none bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" /> write with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="space-y-4 p-4  rounded-lg">
          {/* <h3 className="text-lg font-medium mb-4">Experience</h3> */}
          <div className=" grid grid-cols-2 gap-4 ">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2 p-4 shadow-md rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(index, "company", e.target.value)
                  }
                />
                <Input
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) =>
                    handleExperienceChange(index, "position", e.target.value)
                  }
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) =>
                    handleExperienceChange(index, "location", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "startDate", e.target.value)
                    }
                  />
                  <Input
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "endDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description"
                    value={exp.description.join("\n")}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "description",
                        e.target.value.split("\n")
                      )
                    }
                  />
                  <Button
                    onClick={() => handleGenerateExperience(index)}
                    variant="outline"
                    disabled={isGeneratingExperience === index}
                    className="flex items-center gap-2 rounded-t-none bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  >
                    {isGeneratingExperience === index ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" /> write with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={addExperience} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="space-y-4 p-4  rounded-lg">
          {/* <h3 className="text-lg font-medium mb-4">Education</h3> */}
          <div className=" grid grid-cols-2 gap-4 ">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-2 p-4 shadow-md rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                />
                <Input
                  placeholder="Field"
                  value={edu.field}
                  onChange={(e) =>
                    handleEducationChange(index, "field", e.target.value)
                  }
                />
                <Input
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) =>
                    handleEducationChange(index, "location", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={(e) =>
                      handleEducationChange(index, "startDate", e.target.value)
                    }
                  />
                  <Input
                    placeholder="End Date"
                    value={edu.endDate}
                    onChange={(e) =>
                      handleEducationChange(index, "endDate", e.target.value)
                    }
                  />
                </div>
                <Input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) =>
                    handleEducationChange(index, "gpa", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          <Button onClick={addEducation} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium capitalize">{category}</h4>
              <Textarea
                value={skills.join("\n")}
                onChange={(e) =>
                  handleSkillsChange(
                    category as keyof ResumeData["skills"],
                    e.target.value.split("\n")
                  )
                }
              />
            </div>
          ))}
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="space-y-4 p-4 rounded-lg">
          {/* <h3 className="text-lg font-medium mb-4">Projects</h3> */}

          <div className=" grid grid-cols-2 gap-4 ">
            {resumeData.projects?.map((proj, index) => (
              <div key={index} className="space-y-2 p-4 shadow-md rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Title"
                  value={proj.title}
                  onChange={(e) =>
                    handleProjectChange(index, "title", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={proj.description.join("\n")}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      "description",
                      e.target.value.split("\n")
                    )
                  }
                />
                <Input
                  placeholder="Technologies (comma-separated)"
                  value={proj.technologies.join(", ")}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      "technologies",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Date"
                    value={proj.startDate}
                    onChange={(e) =>
                      handleProjectChange(index, "startDate", e.target.value)
                    }
                  />
                  <Input
                    placeholder="End Date"
                    value={proj.endDate}
                    onChange={(e) =>
                      handleProjectChange(index, "endDate", e.target.value)
                    }
                  />
                </div>
                <Input
                  placeholder="Role"
                  value={proj.role}
                  onChange={(e) =>
                    handleProjectChange(index, "role", e.target.value)
                  }
                />
                <Input
                  placeholder="Institution"
                  value={proj.institution}
                  onChange={(e) =>
                    handleProjectChange(index, "institution", e.target.value)
                  }
                />
                <Input
                  placeholder="Location"
                  value={proj.location}
                  onChange={(e) =>
                    handleProjectChange(index, "location", e.target.value)
                  }
                />
                <Input
                  placeholder="Links (comma-separated)"
                  value={proj.links?.join(", ") || ""}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      "links",
                      e.target.value.split(",").map((link) => link.trim())
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Button onClick={addProject} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeEditor;
