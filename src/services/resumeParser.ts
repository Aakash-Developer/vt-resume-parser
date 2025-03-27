import { OpenAI } from "openai";
import { ResumeData } from "@/types/resume";
import { OPENAI_API_KEY } from "@/constants/keys";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

// Cache for parsed resumes
const resumeCache = new Map<string, ResumeData>();

export async function resumeParserAPI(resumeText: string) {
  try {
    // Check cache first
    const cacheKey = resumeText.trim();
    if (resumeCache.has(cacheKey)) {
      return resumeCache.get(cacheKey);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using faster model
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
                    description: string[],
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
                    certifications: string[],
                    coreCompetencies: string[]
                  },
                  projects?: Array<{
                    title: string,
                    description: string[],
                    technologies: string[],
                    startDate: string,
                    endDate: string,
                    role: string,
                    institution?:string;
                    location?:string;
                    links?: string[]
                  }>
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
                9. For Core Competencies:
                   - Look for sections titled "CORE COMPETENCIES", "Core Competencies", or similar
                   - Split competencies by common separators (|, •, -, etc.)
                   - Clean up any HTML entities (e.g., &amp; to &)
                   - Remove any extra whitespace
                   - Include all competencies as separate items in the array
                10. **The Projects section is optional. If available, parse it like experience or education.**
                
                Return ONLY the JSON object, no additional text.`,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
      temperature: 0.1, // Lower temperature for more consistent results
      max_tokens: 2000, // Limit response size
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    const parsedData = JSON.parse(content) as ResumeData;
    
    // Ensure coreCompetencies is always an array
    if (!parsedData.skills.coreCompetencies) {
      parsedData.skills.coreCompetencies = [];
    }
    
    // Cache the result
    resumeCache.set(cacheKey, parsedData);
    return parsedData;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to parse resume. Please try again.`
    );
  }
}
