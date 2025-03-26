import { OpenAI } from "openai";
import { ResumeData } from "@/types/resume";
import { OPENAI_API_KEY } from "@/constants/keys";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export async function resumeParserAPI(resumeText: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract information from the resume and return ONLY a valid JSON object matching this interface:
                {
                  personal: {
                    name: string,
                    title: string,
                    email: string,
                    phone: string,
                    location: string,
                    linkedin: string,
                    summary: string
                  },
                  experience: Array<{
                    company: string,
                    position: string,
                    location: string,
                    startDate: string,
                    endDate: string,
                    description: string,
                    achievements: string[],
                    type?: "full-time" | "internship" | "project" | "co-op"
                  }>,
                  education: Array<{
                    institution: string,
                    degree: string,
                    field: string,
                    location: string,
                    startDate: string,
                    endDate: string,
                    gpa?: string
                  }>,
                  skills: {
                    technical: string[],
                    soft: string[],
                    tools: string[],
                    certifications: string[]
                  }
                }
                
                Guidelines for parsing:
                1. Extract all dates in the format "MMM YYYY"
                2. Include location information for each experience and education entry
                3. Separate technical skills, tools, and soft skills
                4. Include all achievements as separate items in the achievements array
                5. Identify experience type (full-time, internship, project, co-op)
                6. Extract LinkedIn URL if available
                7. Include professional title/role
                8. Handle both bullet points and paragraph descriptions
                
                Return ONLY the JSON object, no additional text.`,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    const parsedData = JSON.parse(content) as ResumeData;
    return parsedData
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to parse resume. Please try again.`
    );
  }
}
