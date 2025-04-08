import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { ResumeData } from "../types/resume";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { ScrollArea } from "@/components/ui/scroll-area";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: "italic",
    },
  ],
});

interface ResumePreviewProps {
  data: ResumeData;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555555",
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 5,
    color: "#555555",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 9,
    color: "#777777",
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 10,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 2,
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
  },
  skillItem: {
    fontSize: 10,
    marginBottom: 2,
  },
  skillTag: {
    fontSize: 9,
    backgroundColor: "#f0f0f0",
    padding: "2 5",
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  projectTech: {
    fontSize: 9,
    backgroundColor: "#e6f7ff",
    color: "#0066cc",
    padding: "2 5",
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
  projectLinks: {
    fontSize: 9,
    color: "#0066cc",
    textDecoration: "underline",
    marginRight: 10,
  },
});

// PDF Document Component
export const ResumePDF = ({ data }: ResumePreviewProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personal.name}</Text>
        <Text style={styles.title}>{data.personal.title}</Text>
        <Text style={styles.contactInfo}>
          {data.personal.email} | {data.personal.phone}
        </Text>
        <Text style={styles.contactInfo}>{data.personal.location}</Text>
        {data.personal.linkedin && (
          <Text style={styles.contactInfo}>{data.personal.linkedin}</Text>
        )}
      </View>

      {/* Summary */}
      {data.personal.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.itemDescription}>{data.personal.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              <Text style={styles.itemDate}>
                {exp.startDate} - {exp.endDate || "Present"} | {exp.location}
              </Text>
              {exp.description?.map((desc, idx) => (
                <Text key={idx} style={styles.bulletPoint}>
                  • {desc}
                </Text>
              ))}
              {exp.achievements?.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {exp.achievements.map((achievement, idx) => (
                    <Text
                      key={idx}
                      style={[styles.bulletPoint, { color: "#2e7d32" }]}
                    >
                      • {achievement}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              <Text style={styles.itemDate}>
                {edu.startDate} - {edu.endDate || "Present"} | {edu.location}
              </Text>
              {edu.gpa && (
                <Text style={styles.itemDescription}>GPA: {edu.gpa}</Text>
              )}
              {edu.achievements?.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {edu.achievements.map((achievement, idx) => (
                    <Text key={idx} style={styles.bulletPoint}>
                      • {achievement}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {data.skills.technical && data.skills.technical.length > 0 && (
            <View style={[styles.skillCategory, { width: "50%" }]}>
              <Text style={styles.skillTitle}>Technical Skills</Text>
              <View style={styles.skillTags}>
                {data.skills.technical.map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
          {data.skills.soft && data.skills.soft.length > 0 && (
            <View style={[styles.skillCategory, { width: "50%" }]}>
              <Text style={styles.skillTitle}>Soft Skills</Text>
              <View style={styles.skillTags}>
                {data.skills.soft.map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
          {data.skills.tools && data.skills.tools.length > 0 && (
            <View style={[styles.skillCategory, { width: "50%" }]}>
              <Text style={styles.skillTitle}>Tools</Text>
              <View style={styles.skillTags}>
                {data.skills.tools.map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
          {data.skills.coreCompetencies &&
            data.skills.coreCompetencies.length > 0 && (
              <View style={[styles.skillCategory, { width: "50%" }]}>
                <Text style={styles.skillTitle}>Core Competencies</Text>
                <View style={styles.skillTags}>
                  {data.skills.coreCompetencies.map((skill, index) => (
                    <Text key={index} style={styles.skillTag}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}
        </View>
      </View>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.itemTitle}>{project.title}</Text>
              <Text style={styles.itemSubtitle}>{project.role}</Text>
              {project.institution && (
                <Text style={styles.itemSubtitle}>
                  {project.institution}
                </Text>
              )}
              <Text style={styles.itemDate}>
                {project.startDate} - {project.endDate || "Present"}
                {project.location && ` | ${project.location}`}
              </Text>
              {project.description?.map((desc, idx) => (
                <Text key={idx} style={styles.bulletPoint}>
                  • {desc}
                </Text>
              ))}
              {project.technologies?.length > 0 && (
                <View style={styles.skillTags}>
                  {project.technologies.map((tech, idx) => (
                    <Text key={idx} style={styles.projectTech}>
                      {tech}
                    </Text>
                  ))}
                </View>
              )}
              {project.links && project.links.length > 0 && (
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  {project.links.map((link, idx) => (
                    <Text key={idx} style={styles.projectLinks}>
                      {link}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col gap-4 w-full h-full">
      <div className="flex justify-end mb-2">
        <PDFDownloadLink
          document={<ResumePDF data={data} />}
          fileName={`${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {({ loading, error: pdfError }) => {
            if (pdfError) {
              console.error('PDF generation error:', pdfError);
              setError('Failed to generate PDF. Please try again.');
            }
            return (
              <Button disabled={loading} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {loading ? 'Preparing PDF...' : 'Download PDF'}
              </Button>
            );
          }}
        </PDFDownloadLink>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
      
      <ScrollArea className="h-full w-full rounded-md border bg-slate-950 p-4">
        <div
          ref={previewRef}
          className="w-full min-h-[297mm] bg-white shadow-lg p-8"
          style={{
            width: "210mm",
            minHeight: "297mm",
          }}
        >
          {/* Resume Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">{data.personal.name}</h1>
              <p className="text-gray-600">{data.personal.title}</p>
              <p className="text-gray-600">{data.personal.email}</p>
              <p className="text-gray-600">{data.personal.phone}</p>
              <p className="text-gray-600">{data.personal.location}</p>
              {data.personal.linkedin && (
                <p className="text-gray-600">{data.personal.linkedin}</p>
              )}
            </div>

            {/* Summary */}
            {data.personal.summary && (
              <div>
                <h2 className="text-xl font-semibold border-b pb-2">Summary</h2>
                <p className="mt-2">{data.personal.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b pb-2">
                  Experience
                </h2>
                <div className="space-y-4 mt-2">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <ul className="list-disc ml-4 mt-2">
                        {exp.description?.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                      {exp.achievements?.length > 0 && (
                        <ul className="list-disc ml-4 mt-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-green-600">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b pb-2">
                  Education
                </h2>
                <div className="space-y-4 mt-2">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                      <p className="text-sm text-gray-500">{edu.location}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                      )}
                      {edu.achievements?.length > 0 && (
                        <ul className="list-disc ml-4 mt-2">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2">Skills</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {data.skills.technical && data.skills.technical.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.soft && data.skills.soft.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.skills.soft.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.tools && data.skills.tools.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Tools</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.skills.tools.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.coreCompetencies &&
                  data.skills.coreCompetencies.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Core Competencies</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.skills.coreCompetencies.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold border-b pb-2">
                  Projects
                </h2>
                <div className="space-y-4 mt-2">
                  {data.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-gray-600">{project.role}</p>
                      {project.institution && (
                        <p className="text-gray-600">{project.institution}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {project.startDate} - {project.endDate || "Present"}
                      </p>
                      {project.location && (
                        <p className="text-sm text-gray-500">
                          {project.location}
                        </p>
                      )}
                      <ul className="list-disc ml-4 mt-2">
                        {project.description?.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies?.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.links && project.links.length > 0 && (
                        <div className="mt-2">
                          {project.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline mr-4"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
