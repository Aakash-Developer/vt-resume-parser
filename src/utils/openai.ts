import { OPENAI_API_KEY } from '@/constants/keys';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export async function generateAIContent(prompt: string, section: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional resume writer. Generate accurate and relevant content for the ${section} section of a resume. Focus on specific, measurable achievements and use industry-standard terminology.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
}

export async function generateExperienceContent(jd: string | null, company: string, position: string) {
  const prompt = jd 
    ? `Generate professional experience content for a ${position} role at ${company}. 
    Job Description: ${jd}
    Generate 3-4 bullet points for both description and achievements. Focus on specific metrics and outcomes.`
    : `Generate professional experience content for a ${position} role at ${company}.
    Focus on common responsibilities and achievements for this role. Generate 3-4 bullet points for both description and achievements.`;

  const content = await generateAIContent(prompt, 'experience');
  const sections = content?.split('\n\n') || [];
  
  return {
    description: sections[0]?.split('\n').filter(Boolean) || [],
    achievements: sections[1]?.split('\n').filter(Boolean) || []
  };
}

export async function generateProjectContent(jd: string | null, title: string) {
  const prompt = jd
    ? `Generate professional project content for: ${title}
    Job Description: ${jd}
    Generate 2-3 bullet points for description, 4-5 technologies, and 3-4 achievements. Focus on technical impact and measurable results.`
    : `Generate professional project content for: ${title}
    Focus on common technical aspects and achievements for this type of project. Generate 2-3 bullet points for description, 4-5 technologies, and 3-4 achievements.`;

  const content = await generateAIContent(prompt, 'project');
  const sections = content?.split('\n\n') || [];
  
  return {
    description: sections[0]?.split('\n').filter(Boolean) || [],
    technologies: sections[1]?.split('\n').filter(Boolean) || [],
    achievements: sections[2]?.split('\n').filter(Boolean) || []
  };
}

export async function generateEducationContent(jd: string | null, institution: string, degree: string, field: string) {
  const prompt = jd
    ? `Generate professional education content for ${degree} in ${field} from ${institution}.
    Job Description: ${jd}
    Generate 3-4 relevant academic achievements and accomplishments.`
    : `Generate professional education content for ${degree} in ${field} from ${institution}.
    Focus on common academic achievements and accomplishments for this degree and field. Generate 3-4 relevant achievements.`;

  const content = await generateAIContent(prompt, 'education');
  return {
    achievements: content?.split('\n').filter(Boolean) || []
  };
<<<<<<< HEAD
} 


export async function generateSummaryContent(jd: string | null, summary: string) {
  const prompt = jd
    ? `Write a professional summary based on the following job description: ${jd}
    Focus on highlighting relevant skills, experience, and achievements that match the job requirements.
    Write the summary directly without any prefix or header.`
    : `Write a professional summary based on the following content: ${summary}
    Focus on creating a compelling narrative that highlights key strengths and career objectives.
    Write the summary directly without any prefix or header.`;

  const content = await generateAIContent(prompt, 'summary');
  return content?.trim() || '';
}
=======
} 
>>>>>>> 76ee091029fb8a55432c9bbfe6277df6d4447b8e
