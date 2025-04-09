import { Document, Page, Text, View, Font } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
import { createTw } from "react-pdf-tailwind";

// Register Roboto fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: "light",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: "medium",
    },
  ],
});

interface ATSResumePDFProps {
  data: ResumeData;
  primaryColor?: string;
}

export const ATSResumePDF = ({ data, primaryColor = "#ab2034" }: ATSResumePDFProps) => {
  // Create a dynamic theme with the provided primary color
  const tw = createTw({
    theme: {
      extend: {
        colors: {
          slate: {
            700: "#334155",
            800: "#1e293b",
          },
          primary: {
            500: primaryColor,
          },
        },
        fontSize: {
          xs: "10px",
          sm: "12px",
          base: "14px",
          lg: "16px",
          "2xl": "20px",
        },
        spacing: {
          "1": "4px",
          "2": "8px",
          "3": "12px",
          "4": "16px",
          "5": "20px",
          "6": "24px",
        },
        fontFamily: {
          sans: ["Roboto"],
        },
        textColor: {
          DEFAULT: "#000000",
        },
      },
    },
  });

  // Ensure all data is properly initialized with default values
  const sanitizedData: ResumeData = {
    personal: {
      name: data.personal?.name || "",
      title: data.personal?.title || "",
      email: data.personal?.email || "",
      phone: data.personal?.phone || "",
      location: data.personal?.location || "",
      linkedin: data.personal?.linkedin || "",
      summary: data.personal?.summary || "",
    },
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp) => ({
          company: exp.company || "",
          position: exp.position || "",
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: Array.isArray(exp.description) ? exp.description : [],
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
          type: exp.type || "full-time",
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((edu) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          location: edu.location || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          gpa: edu.gpa || "",
          achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
        }))
      : [],
    skills: {
      technical: Array.isArray(data.skills?.technical)
        ? data.skills.technical
        : [],
      soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
      tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
      certifications: Array.isArray(data.skills?.certifications)
        ? data.skills.certifications
        : [],
      coreCompetencies: Array.isArray(data.skills?.coreCompetencies)
        ? data.skills.coreCompetencies
        : [],
    },
    projects: Array.isArray(data.projects)
      ? data.projects.map((proj) => ({
          title: proj.title || "",
          role: proj.role || "",
          startDate: proj.startDate || "",
          endDate: proj.endDate || "",
          description: Array.isArray(proj.description) ? proj.description : [],
          technologies: Array.isArray(proj.technologies)
            ? proj.technologies
            : [],
          institution: proj.institution || "",
          location: proj.location || "",
          links: Array.isArray(proj.links) ? proj.links : [],
        }))
      : [],
  };

  const { personal, experience, education, skills, projects } = sanitizedData;

  // Ensure skills object properties are always arrays
  const safeSkills = {
    technical: skills.technical || [],
    soft: skills.soft || [],
    tools: skills.tools || [],
    certifications: skills.certifications || [],
    coreCompetencies: skills.coreCompetencies || [],
  };

  // Create contact info array with only non-empty values
  const contactInfo = [
    personal.location && `${personal.location}`,
    personal.phone && `${personal.phone}`,
    personal.email && `${personal.email}`,
    personal.linkedin && `${personal.linkedin}`,
  ].filter(Boolean);

  const hasSkills =
    safeSkills.technical.length > 0 ||
    safeSkills.tools.length > 0 ||
    safeSkills.soft.length > 0;

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white font-sans")}>
        {/* Header */}
        <View style={tw("mb-3")}>
          <Text
            style={tw("text-2xl font-bold text-black mb-2 text-primary-500")}
          >
            {personal.name}
          </Text>
          <Text style={tw("text-base font-bold text-black")}>
            {personal.title}
          </Text>

          {/* Contact info in horizontal format with separators */}
          <View style={tw("flex-row flex-wrap mb-0.5")}>
            {contactInfo.map((info, index) => (
              <View key={index} style={tw("flex-row items-center")}>
                <Text style={tw("text-sm text-black")}>{info}</Text>
                {index < contactInfo.length - 1 && (
                  <Text style={tw("text-sm text-black mx-2")}>|</Text>
                )}
              </View>
            ))}
          </View>

          <View style={tw("block h-1 w-10 bg-primary-500")}></View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={tw("mb-3")}>
            <View style={tw("mb-0.5")}>
              <Text style={tw("text-sm font-bold text-black mb-0.5")}>
                PROFILE SUMMARY
              </Text>
              <Text style={tw("text-xs text-black leading-relaxed")}>
                {personal.summary}
              </Text>
            </View>
            <View style={tw("block h-1 w-10 bg-primary-500 ")}></View>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={tw("mb-3")}>
            <View style={tw("mb-0.5")}>
              <Text style={tw("text-sm font-bold text-black mb-0.5")}>
                EDUCATION
              </Text>
              {education.map((edu, index) => (
                <View key={index} style={tw("mb-0.5")}>
                  <View style={tw("flex-row flex-wrap justify-between")}>
                    {/* Education details in horizontal format with separators */}
                    <View style={tw("flex-row flex-wrap")}>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        {edu.institution}
                      </Text>
                      <Text style={tw("text-xs text-black mx-0.5")}>|</Text>

                      <Text style={tw("text-xs text-black")}>
                        {edu.degree} in {edu.field}
                      </Text>

                      <Text style={tw("text-xs text-black")}>
                        {edu.location}
                      </Text>

                      {edu.gpa && (
                        <>
                          <Text style={tw("text-xs text-black mx-0.5")}>|</Text>
                          <Text style={tw("text-xs text-black")}>
                            GPA: {edu.gpa}
                          </Text>
                        </>
                      )}
                    </View>

                    <Text style={tw("text-xs text-primary-500 font-bold")}>
                      {`${edu.startDate} ${
                        edu.endDate ? `- ${edu.endDate}` : ""
                      }`}
                    </Text>
                  </View>

                  {edu.achievements.length > 0 && (
                    <View style={tw("ml-2")}>
                      {edu.achievements.map((achievement, i) => (
                        <Text key={i} style={tw("text-xs text-black")}>
                          • {achievement}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View style={tw("block h-1 w-10 bg-primary-500 ")}></View>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={tw("mb-3")}>
            <View style={tw("mb-0.5")}>
              <Text style={tw("text-sm font-bold text-black pb-1")}>
                EXPERIENCE
              </Text>
              {experience.map((exp, index) => (
                <View key={index} style={tw("mb-2")}>
                  <View style={tw("flex-row flex-wrap justify-between mb-1")}>
                    <View style={tw("flex-row flex-wrap")}>
                      <Text style={tw("text-xs font-bold text-primary-500 ")}>
                        {exp.company}
                      </Text>
                      <Text style={tw("text-xs text-black mx-0.5")}>|</Text>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        {exp.position}
                      </Text>
                    </View>
                    <Text style={tw("text-xs text-primary-500 font-bold")}>
                      {`${exp.startDate} ${
                        exp.endDate ? `- ${exp.endDate}` : ""
                      }`}
                    </Text>
                  </View>
                  {exp.description.length > 0 && (
                    <View style={tw("")}>
                      {exp.description.map((desc, i) => (
                        <View key={i} style={tw("flex-row mb-1.5")}>
                          <Text style={tw("text-base text-black mr-2")}>•</Text>
                          <Text style={tw("text-xs text-black flex-1")}>
                            {desc}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {exp.achievements.length > 0 && (
                    <View style={tw("ml-3")}>
                      {exp.achievements.map((achievement, i) => (
                        <View key={i} style={tw("flex-row mb-1")}>
                          <Text style={tw("text-base text-black mr-2")}>•</Text>
                          <Text style={tw("text-xs text-black flex-1")}>
                            {achievement}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View style={tw("block h-1 w-10 bg-primary-500")}></View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={tw("mb-3")}>
            <View style={tw("mb-0.5")}>
              <Text style={tw("text-sm font-bold text-black pb-1")}>
                PROJECTS EXPERIENCE
              </Text>
              {projects.map((proj, index) => (
                <View key={index} style={tw("mb-2")}>
                  <View style={tw("flex-row flex-wrap justify-between mb-1")}>
                    <View style={tw("flex-row flex-wrap ")}>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        {proj.title}
                      </Text>
                      <Text style={tw("text-xs text-black mx-0.5")}>|</Text>
                      {proj.role && (
                        <Text style={tw("text-xs font-bold text-primary-500")}>
                          {proj.role}
                        </Text>
                      )}
                      <Text style={tw("text-xs text-black mx-0.5")}>|</Text>
                      {proj.institution && (
                        <Text style={tw("text-xs font-bold text-primary-500")}>
                          {proj.institution}
                        </Text>
                      )}
                      ,
                      {proj.location && (
                        <Text style={tw("text-xs font-bold text-primary-500")}>
                          {proj.location}
                        </Text>
                      )}
                    </View>
                    <Text style={tw("text-xs font-bold text-primary-500")}>
                      {proj.startDate} - {proj.endDate}
                    </Text>
                  </View>
                  {proj.description.length > 0 &&
                    proj.description.map((desc, i) => (
                      <View key={i} style={tw("flex-row mb-1.5")}>
                        <Text style={tw("text-base text-black mr-2")}>•</Text>
                        <Text style={tw("text-xs text-black flex-1")}>
                          {desc}
                        </Text>
                      </View>
                    ))}
                  {proj.technologies.length > 0 && (
                    <Text style={tw("text-xs text-black mt-0.5")}>
                      Technologies: {proj.technologies.join(", ")}
                    </Text>
                  )}

                  {proj.links && proj.links.length > 0 && (
                    <Text style={tw("text-xs text-black")}>
                      Links: {proj.links.join(" | ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <View style={tw("block h-1 w-10 bg-primary-500")}></View>
          </View>
        )}

        {/* Certifications */}
        {safeSkills.certifications.length > 0 && (
          <View style={tw("mb-3")}>
            <View style={tw("mb-0.5")}>
              <Text
                style={tw("text-sm font-bold text-black mb-1 leading-relaxed")}
              >
                CERTIFICATIONS
              </Text>
              <Text style={tw("text-xs text-black leading-relaxed")}>
                {safeSkills.certifications.join("  |  ")}
              </Text>
            </View>
            <View style={tw("block h-1 w-10 bg-primary-500")}></View>
          </View>
        )}

        {hasSkills && (
            <View style={tw("mb-3")}>
              <View style={tw("mb-0.5")}>
                <Text style={tw("text-sm font-bold text-black mb-1")}>
                  TECHNICAL SKILLS
                </Text>
                {/* Technical Skills */}
                {safeSkills.technical.length > 0 && (
                  <View style={tw("mb-1")}>
                    <Text style={tw("text-xs text-black leading-relaxed")}>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        Skills:
                      </Text>{" "}
                      {safeSkills.technical.join(",  ")}
                    </Text>
                  </View>
                )}

                {/* Tools */}
                {safeSkills.tools.length > 0 && (
                  <View style={tw("mb-1")}>
                    <Text style={tw("text-xs text-black leading-relaxed")}>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        Tools & Technologies:
                      </Text>{" "}
                      {safeSkills.tools.join(",  ")}
                    </Text>
                  </View>
                )}

                {/* Soft Skills */}
                {safeSkills.soft.length > 0 && (
                  <View style={tw("mb-2")}>
                    <Text style={tw("text-xs text-black leading-relaxed")}>
                      <Text style={tw("text-xs font-bold text-primary-500")}>
                        Soft Skills:
                      </Text>{" "}
                      {safeSkills.soft.join(",  ")}
                    </Text>
                  </View>
                )}
              </View>
              <View style={tw("block h-1 w-10 bg-primary-500 ")}></View>
            </View>
          )}

        {/* Core Competencies */}
        {safeSkills.coreCompetencies.length > 0 && (
          <View style={tw("mb-2")}>
            <Text style={tw("text-sm font-bold text-black mb-1")}>
              Core Competencies
            </Text>
            <Text style={tw("text-xs text-black leading-relaxed")}>
              {safeSkills.coreCompetencies.join("  |  ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
