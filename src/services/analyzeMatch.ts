import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "@/constants/keys";
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeMatch(resumeData: object, jobDescription: string) {
  try {
    if (!resumeData || !jobDescription) {
      return toast("Resume data and job description are required");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a resume analyzer. Analyze how well the resume matches the job description and return a JSON object with:
              {
                matchAccuracy: number (0-100),
                strengths: string[],
                weaknesses: string[],
                suggestions: string[]
              }
              Consider:
              1. Skills match
              2. Experience relevance
              3. Education requirements
              4. Overall fit
              Return ONLY the JSON object, no additional text.`,
        },
        {
          role: "user",
          content: `Resume Data: ${JSON.stringify(
            resumeData
          )}\n\nJob Description: ${jobDescription}`,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const analysis = JSON.parse(content);
    console.log(analysis);
    return analysis;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to analyze resume match. Please try again.`
    );
  }
}
