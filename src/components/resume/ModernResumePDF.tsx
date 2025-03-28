import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        slate: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
        },
        blue: {
          600: '#2563eb',
        },
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        '3xl': '24px',
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

interface ModernResumePDFProps {
  data: ResumeData;
}

export const ModernResumePDF = ({ data }: ModernResumePDFProps) => {
  const { personal, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={tw("flex flex-row bg-white")}>
        {/* Sidebar */}
        <View style={tw("w-1/3 bg-slate-800 p-6 text-white")}>
          {/* Profile Section */}
          <View style={tw("mb-6")}>
            <Text style={tw("text-3xl font-bold mb-2")}>{personal.name}</Text>
            <Text style={tw("text-lg text-blue-400 mb-4")}>{personal.title}</Text>
            <View style={tw("space-y-2")}>
              <Text style={tw("text-sm")}>{personal.email}</Text>
              <Text style={tw("text-sm")}>{personal.phone}</Text>
              <Text style={tw("text-sm")}>{personal.location}</Text>
              {personal.linkedin && <Text style={tw("text-sm")}>{personal.linkedin}</Text>}
            </View>
          </View>

          {/* Skills Section */}
          {skills && (
            <View style={tw("mb-6")}>
              <Text style={tw("text-lg font-bold mb-3 text-blue-400")}>Skills</Text>
              
              {/* Technical Skills */}
              {skills.technical && skills.technical.length > 0 && (
                <View style={tw("mb-4")}>
                  <Text style={tw("text-sm font-bold mb-2")}>Technical</Text>
                  <View style={tw("flex-row flex-wrap gap-1")}>
                    {skills.technical.map((skill, index) => (
                      <Text key={index} style={tw("text-xs bg-slate-700 px-2 py-1 rounded")}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Core Competencies */}
              {skills.coreCompetencies && skills.coreCompetencies.length > 0 && (
                <View style={tw("mb-4")}>
                  <Text style={tw("text-sm font-bold mb-2")}>Core Competencies</Text>
                  <View style={tw("flex-row flex-wrap gap-1")}>
                    {skills.coreCompetencies.map((skill, index) => (
                      <Text key={index} style={tw("text-xs bg-slate-700 px-2 py-1 rounded")}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Tools */}
              {skills.tools && skills.tools.length > 0 && (
                <View style={tw("mb-4")}>
                  <Text style={tw("text-sm font-bold mb-2")}>Tools</Text>
                  <View style={tw("flex-row flex-wrap gap-1")}>
                    {skills.tools.map((skill, index) => (
                      <Text key={index} style={tw("text-xs bg-slate-700 px-2 py-1 rounded")}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <View>
              <Text style={tw("text-lg font-bold mb-3 text-blue-400")}>Education</Text>
              {education.map((edu, index) => (
                <View key={index} style={tw("mb-3")}>
                  <Text style={tw("text-sm font-bold")}>{edu.institution}</Text>
                  <Text style={tw("text-xs text-slate-300")}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={tw("text-xs text-slate-400")}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                  {edu.gpa && <Text style={tw("text-xs text-slate-300")}>GPA: {edu.gpa}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={tw("w-2/3 p-8")}>
          {/* Summary */}
          {personal.summary && (
            <View style={tw("mb-6")}>
              <Text style={tw("text-lg font-bold text-slate-800 mb-3")}>Professional Summary</Text>
              <Text style={tw("text-sm text-slate-700 leading-relaxed")}>{personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View>
              <Text style={tw("text-lg font-bold text-slate-800 mb-4")}>Professional Experience</Text>
              {experience.map((exp, index) => (
                <View key={index} style={tw("mb-6")}>
                  <Text style={tw("text-base font-bold text-slate-800")}>{exp.company}</Text>
                  <Text style={tw("text-sm text-blue-600 font-bold mb-1")}>{exp.position}</Text>
                  <Text style={tw("text-xs text-slate-500 mb-3")}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                  {exp.description &&
                    exp.description.map((desc, i) => (
                      <Text key={i} style={tw("text-sm text-slate-700 mb-1 leading-relaxed")}>
                        • {desc}
                      </Text>
                    ))}
                  {exp.achievements &&
                    exp.achievements.map((achievement, i) => (
                      <Text key={i} style={tw("text-sm text-slate-700 mb-1 leading-relaxed")}>
                        • {achievement}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}; 