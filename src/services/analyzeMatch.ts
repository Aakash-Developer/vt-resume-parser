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
          content: `You are an expert resume analyzer and career coach with years of experience in HR and recruitment. Your task is to provide a detailed, accurate, and consistent analysis of how well a resume matches a job description.

          Analyze the resume against the job description and return a JSON object with the following structure:
          {
            "matchAccuracy": number (0-100),
            "strengths": string[],
            "weaknesses": string[],
            "suggestions": string[]
          }

          Evaluation criteria:
          1. Skills match: How well do the candidate's skills align with the required skills in the job description?
          2. Experience relevance: Does the candidate's work experience match the required experience in the job description?
          3. Education requirements: Does the candidate's education meet the requirements specified in the job description?
          4. Industry knowledge: Does the candidate demonstrate knowledge of the industry or field mentioned in the job description?
          5. Quantifiable achievements: Does the resume include specific, measurable achievements that demonstrate the candidate's capabilities?
          6. ATS-friendliness: Is the resume formatted in a way that Applicant Tracking Systems can easily parse?
          7. Keywords: Does the resume include relevant keywords from the job description?
          8. Overall presentation: Is the resume well-structured, clear, and professional?

          Scoring guidelines:
          - 90-100: Exceptional match with all or nearly all requirements met
          - 75-89: Strong match with most requirements met
          - 60-74: Good match with many requirements met
          - 40-59: Partial match with some requirements met
          - 0-39: Poor match with few requirements met

          For strengths, weaknesses, and suggestions:
          - Provide 3-5 specific, actionable points for each category
          - Focus on concrete, measurable aspects rather than vague statements
          - Prioritize the most important points first
          - Make suggestions specific and implementable

          Return ONLY the JSON object, no additional text or explanation.`,
        },
        {
          role: "user",
          content: `Resume Data: ${JSON.stringify(
            resumeData
          )}\n\nJob Description: ${jobDescription}`,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 1000,
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
