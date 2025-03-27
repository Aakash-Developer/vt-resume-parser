import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        slate: {
          100: '#f1f5f9',
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

interface ClassicResumePDFProps {
  data: ResumeData;
}

export const ClassicResumePDF = ({ data }: ClassicResumePDFProps) => {
  const { personal, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white")}>
        {/* Header */}
        <View style={tw("text-center mb-8")}>
          <Text style={tw("text-3xl font-bold text-slate-800 mb-2")}>{personal.name}</Text>
          <Text style={tw("text-lg text-blue-600 font-bold mb-3")}>{personal.title}</Text>
          <View style={tw("flex-row justify-center gap-4")}>
            <Text style={tw("text-sm text-slate-500")}>{personal.email}</Text>
            <Text style={tw("text-sm text-slate-500")}>{personal.phone}</Text>
            <Text style={tw("text-sm text-slate-500")}>{personal.location}</Text>
            {personal.linkedin && <Text style={tw("text-sm text-slate-500")}>{personal.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={tw("mb-8")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-2 border-b-2 border-slate-800 pb-1")}>
              Professional Summary
            </Text>
            <Text style={tw("text-sm text-slate-700 leading-relaxed")}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={tw("mb-8")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-4 border-b-2 border-slate-800 pb-1")}>
              Professional Experience
            </Text>
            {experience.map((exp, index) => (
              <View key={index} style={tw("mb-6")}>
                <View style={tw("flex-row justify-between items-start mb-2")}>
                  <View>
                    <Text style={tw("text-base font-bold text-slate-800")}>{exp.company}</Text>
                    <Text style={tw("text-sm text-blue-600 font-bold")}>{exp.position}</Text>
                  </View>
                  <Text style={tw("text-sm text-slate-500")}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
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

        {/* Education */}
        {education && education.length > 0 && (
          <View style={tw("mb-8")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-4 border-b-2 border-slate-800 pb-1")}>
              Education
            </Text>
            {education.map((edu, index) => (
              <View key={index} style={tw("mb-4")}>
                <View style={tw("flex-row justify-between items-start mb-2")}>
                  <View>
                    <Text style={tw("text-base font-bold text-slate-800")}>{edu.institution}</Text>
                    <Text style={tw("text-sm text-blue-600 font-bold")}>
                      {edu.degree} in {edu.field}
                    </Text>
                  </View>
                  <Text style={tw("text-sm text-slate-500")}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                {edu.gpa && <Text style={tw("text-sm text-slate-700")}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View>
            <Text style={tw("text-base font-bold text-slate-800 mb-4 border-b-2 border-slate-800 pb-1")}>
              Skills
            </Text>
            
            {/* Technical Skills */}
            {skills.technical && skills.technical.length > 0 && (
              <View style={tw("mb-4")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Technical Skills</Text>
                <View style={tw("flex-row flex-wrap gap-2")}>
                  {skills.technical.map((skill, index) => (
                    <Text key={index} style={tw("text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold")}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Core Competencies */}
            {skills.coreCompetencies && skills.coreCompetencies.length > 0 && (
              <View style={tw("mb-4")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Core Competencies</Text>
                <View style={tw("flex-row flex-wrap gap-2")}>
                  {skills.coreCompetencies.map((skill, index) => (
                    <Text key={index} style={tw("text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold")}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Tools */}
            {skills.tools && skills.tools.length > 0 && (
              <View style={tw("mb-4")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Tools & Technologies</Text>
                <View style={tw("flex-row flex-wrap gap-2")}>
                  {skills.tools.map((skill, index) => (
                    <Text key={index} style={tw("text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold")}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Soft Skills */}
            {skills.soft && skills.soft.length > 0 && (
              <View style={tw("mb-4")}>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Soft Skills</Text>
                <View style={tw("flex-row flex-wrap gap-2")}>
                  {skills.soft.map((skill, index) => (
                    <Text key={index} style={tw("text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold")}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {skills.certifications && skills.certifications.length > 0 && (
              <View>
                <Text style={tw("text-sm font-bold text-slate-800 mb-2")}>Certifications</Text>
                <View style={tw("flex-row flex-wrap gap-2")}>
                  {skills.certifications.map((skill, index) => (
                    <Text key={index} style={tw("text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-bold")}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}; 