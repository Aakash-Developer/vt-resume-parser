import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        slate: {
          700: '#334155',
          800: '#1e293b',
        },
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        '2xl': '20px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
      },
    },
  },
});

interface ATSResumePDFProps {
  data: ResumeData;
}

export const ATSResumePDF = ({ data }: ATSResumePDFProps) => {
<<<<<<< HEAD
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
    experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
      company: exp.company || "",
      position: exp.position || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: Array.isArray(exp.description) ? exp.description : [],
      achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
      type: exp.type || "full-time",
    })) : [],
    education: Array.isArray(data.education) ? data.education.map(edu => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      gpa: edu.gpa || "",
      achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
    })) : [],
    skills: {
      technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
      soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
      tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
      certifications: Array.isArray(data.skills?.certifications) ? data.skills.certifications : [],
      coreCompetencies: Array.isArray(data.skills?.coreCompetencies) ? data.skills.coreCompetencies : [],
    },
    projects: Array.isArray(data.projects) ? data.projects.map(proj => ({
      title: proj.title || "",
      role: proj.role || "",
      startDate: proj.startDate || "",
      endDate: proj.endDate || "",
      description: Array.isArray(proj.description) ? proj.description : [],
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      institution: proj.institution || "",
      location: proj.location || "",
    })) : [],
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
=======
  const { personal, experience, education, skills } = data;
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white")}>
        {/* Header */}
        <View style={tw("mb-6")}>
          <Text style={tw("text-2xl font-bold text-slate-800 mb-2 text-[#ab2034]")}>{personal.name}</Text>
          <Text style={tw("text-base font-bold text-slate-800 mb-2")}>{personal.title}</Text>
          <View style={tw("flex-row flex-wrap gap-4")}>
            <Text style={tw("text-sm text-slate-700")}>{personal.email}</Text> 
<<<<<<< HEAD
=======

>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
            <Text style={tw("text-sm text-slate-700")}>{personal.phone}</Text>
            <Text style={tw("text-sm text-slate-700")}>{personal.location}</Text>
            {personal.linkedin && <Text style={tw("text-sm text-slate-700")}>{personal.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-4")}>PROFESSIONAL SUMMARY</Text>
            <Text style={tw("text-sm text-slate-700 leading-relaxed")}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
<<<<<<< HEAD
        {experience.length > 0 && (
=======
        {experience && experience.length > 0 && (
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 pb-4")}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View key={index} style={tw("mb-4")}>
                <Text style={tw("text-base font-bold text-slate-800")}>{exp.company}</Text>
                <Text style={tw("text-sm font-bold text-slate-800")}>{exp.position}</Text>
                <Text style={tw("text-sm text-slate-700 mb-2")}>
                  {exp.startDate} - {exp.endDate}
                </Text>
<<<<<<< HEAD
                {exp.description.length > 0 &&
=======
                {exp.description &&
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
                  exp.description.map((desc, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {desc}
                    </Text>
                  ))}
<<<<<<< HEAD
                {exp.achievements.length > 0 &&
=======
                {exp.achievements &&
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
                  exp.achievements.map((achievement, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {achievement}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

<<<<<<< HEAD
        {/* Projects */}
        {projects.length > 0 && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 pb-4")}>PROJECTS</Text>
            {projects.map((proj, index) => (
              <View key={index} style={tw("mb-4")}>
                <Text style={tw("text-base font-bold text-slate-800")}>{proj.title}</Text>
                {proj.role && (
                  <Text style={tw("text-sm font-bold text-slate-800")}>{proj.role}</Text>
                )}
                <Text style={tw("text-sm text-slate-700 mb-2")}>
                  {proj.startDate} - {proj.endDate}
                </Text>
                {proj.description.length > 0 &&
                  proj.description.map((desc, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {desc}
                    </Text>
                  ))}
                {proj.technologies.length > 0 && (
                  <Text style={tw("text-sm text-slate-700 mt-2")}>
                    Technologies: {proj.technologies.join(", ")}
                  </Text>
                )}
                {proj.institution && (
                  <Text style={tw("text-sm text-slate-700")}>
                    Institution: {proj.institution}
                  </Text>
                )}
                {proj.location && (
                  <Text style={tw("text-sm text-slate-700")}>
                    Location: {proj.location}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
=======
        {/* Education */}
        {education && education.length > 0 && (
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-3")}>EDUCATION</Text>
            {education.map((edu, index) => (
              <View key={index} style={tw("mb-4")}>
                <Text style={tw("text-base font-bold text-slate-800")}>{edu.institution}</Text>
                <Text style={tw("text-sm font-bold text-slate-800")}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {edu.startDate} - {edu.endDate}
                </Text>
                {edu.gpa && <Text style={tw("text-sm text-slate-700")}>GPA: {edu.gpa}</Text>}
<<<<<<< HEAD
                {edu.achievements.length > 0 &&
                  edu.achievements.map((achievement, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {achievement}
                    </Text>
                  ))}
=======
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
<<<<<<< HEAD
        <View>
          <Text style={tw("text-base font-bold text-slate-800 mb-3")}>SKILLS</Text>
          
          {/* Technical Skills */}
          {safeSkills.technical.length > 0 && (
            <View style={tw("mb-3")}>
              <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Technical Skills:</Text>
              <Text style={tw("text-sm text-slate-700")}>
                {safeSkills.technical.join(" • ")}
              </Text>
            </View>
          )}

          {/* Core Competencies */}
          {safeSkills.coreCompetencies.length > 0 && (
            <View style={tw("mb-3")}>
              <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Core Competencies:</Text>
              <Text style={tw("text-sm text-slate-700")}>
                {safeSkills.coreCompetencies.join(" | ")}
              </Text>
            </View>
          )}

          {/* Tools */}
          {safeSkills.tools.length > 0 && (
            <View style={tw("mb-3")}>
              <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Tools & Technologies:</Text>
              <Text style={tw("text-sm text-slate-700")}>
                {safeSkills.tools.join(" • ")}
              </Text>
            </View>
          )}

          {/* Soft Skills */}
          {safeSkills.soft.length > 0 && (
            <View style={tw("mb-3")}>
              <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Soft Skills:</Text>
              <Text style={tw("text-sm text-slate-700")}>
                {safeSkills.soft.join(" • ")}
              </Text>
            </View>
          )}

          {/* Certifications */}
          {safeSkills.certifications.length > 0 && (
            <View>
              <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Certifications:</Text>
              <Text style={tw("text-sm text-slate-700")}>
                {safeSkills.certifications.join(" • ")}
              </Text>
            </View>
          )}
        </View>
=======
        {skills && (
          <View>
            <Text style={tw("text-base font-bold text-slate-800 mb-3")}>SKILLS</Text>
            
            {/* Technical Skills */}
            {skills.technical && skills.technical.length > 0 && (
              <View style={tw("mb-3")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Technical Skills:</Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {skills.technical.join(" • ")}
                </Text>
              </View>
            )}

            {/* Core Competencies */}
            {skills.coreCompetencies && skills.coreCompetencies.length > 0 && (
              <View style={tw("mb-3")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Core Competencies:</Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {skills.coreCompetencies.join(" | ")}
                </Text>
              </View>
            )}

            {/* Tools */}
            {skills.tools && skills.tools.length > 0 && (
              <View style={tw("mb-3")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Tools & Technologies:</Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {skills.tools.join(" • ")}
                </Text>
              </View>
            )}

            {/* Soft Skills */}
            {skills.soft && skills.soft.length > 0 && (
              <View style={tw("mb-3")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Soft Skills:</Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {skills.soft.join(" • ")}
                </Text>
              </View>
            )}

            {/* Certifications */}
            {skills.certifications && skills.certifications.length > 0 && (
              <View>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Certifications:</Text>
                <Text style={tw("text-sm text-slate-700")}>
                  {skills.certifications.join(" • ")}
                </Text>
              </View>
            )}
          </View>
        )}
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
      </Page>
    </Document>
  );
}; 