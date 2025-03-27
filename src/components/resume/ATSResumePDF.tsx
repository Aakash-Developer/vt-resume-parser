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
  const { personal, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white")}>
        {/* Header */}
        <View style={tw("mb-6")}>
          <Text style={tw("text-2xl font-bold text-slate-800 mb-2")}>{personal.name}</Text>
          <Text style={tw("text-base font-bold text-slate-800 mb-2")}>{personal.title}</Text>
          <View style={tw("flex-row flex-wrap gap-4")}>
            <Text style={tw("text-sm text-slate-700")}>{personal.email}</Text>
            <Text style={tw("text-sm text-slate-700")}>{personal.phone}</Text>
            <Text style={tw("text-sm text-slate-700")}>{personal.location}</Text>
            {personal.linkedin && <Text style={tw("text-sm text-slate-700")}>{personal.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-2")}>PROFESSIONAL SUMMARY</Text>
            <Text style={tw("text-sm text-slate-700 leading-relaxed")}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-base font-bold text-slate-800 mb-3")}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View key={index} style={tw("mb-4")}>
                <Text style={tw("text-base font-bold text-slate-800")}>{exp.company}</Text>
                <Text style={tw("text-sm font-bold text-slate-800")}>{exp.position}</Text>
                <Text style={tw("text-sm text-slate-700 mb-2")}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description &&
                  exp.description.map((desc, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {desc}
                    </Text>
                  ))}
                {exp.achievements &&
                  exp.achievements.map((achievement, i) => (
                    <Text key={i} style={tw("text-sm text-slate-700 mb-1")}>
                      • {achievement}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
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
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
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
      </Page>
    </Document>
  );
}; 