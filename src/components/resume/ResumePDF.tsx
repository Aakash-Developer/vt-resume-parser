import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [{ src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2" }, { src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7.woff2", fontWeight: 600 }],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: "#6b7280",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#111827",
  },
  experienceItem: {
    marginBottom: 12,
  },
  company: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
  },
  position: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    marginBottom: 4,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skill: {
    fontSize: 10,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

interface ResumePDFProps {
  data: ResumeData;
  template: string;
}

export const ResumePDF = ({ data, template }: ResumePDFProps) => {
  const { personal, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.name}</Text>
          <Text style={styles.title}>{personal.title}</Text>
          <View style={styles.contact}>
            <Text>{personal.email}</Text>
            <Text>{personal.phone}</Text>
            <Text>{personal.location}</Text>
            {personal.linkedin && <Text>{personal.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.description}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.position}>{exp.position}</Text>
                <Text style={styles.date}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description &&
                  exp.description.map((desc, i) => (
                    <Text key={i} style={styles.description}>
                      • {desc}
                    </Text>
                  ))}
                {exp.achievements &&
                  exp.achievements.map((achievement, i) => (
                    <Text key={i} style={styles.description}>
                      • {achievement}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.company}>{edu.institution}</Text>
                <Text style={styles.position}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.date}>
                  {edu.startDate} - {edu.endDate}
                </Text>
                {edu.gpa && <Text style={styles.description}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {skills.technical?.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
              {skills.soft?.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
              {skills.tools?.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
              {skills.certifications?.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
              {skills.coreCompetencies?.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
