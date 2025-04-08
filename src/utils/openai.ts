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
    
    IMPORTANT: Generate EXACTLY 5-6 detailed bullet points in the following format:
    
    DESCRIPTION:
    • First bullet point with specific metrics
    • Second bullet point with specific metrics
    • Third bullet point with specific metrics
    • Fourth bullet point with specific metrics
    • Fifth bullet point with specific metrics
    • Sixth bullet point with specific metrics (optional)
    
    ACHIEVEMENTS:
    • First achievement with specific metrics
    • Second achievement with specific metrics
    • Third achievement with specific metrics
    • Fourth achievement with specific metrics
    • Fifth achievement with specific metrics
    • Sixth achievement with specific metrics (optional)
    
    Focus on quantifiable results and align the experience with the job requirements.
    Make each point impactful and specific to the role.`
    : `Generate professional experience content for a ${position} role at ${company}.
    
    IMPORTANT: Generate EXACTLY 5-6 detailed bullet points in the following format:
    
    DESCRIPTION:
    • First bullet point with specific metrics
    • Second bullet point with specific metrics
    • Third bullet point with specific metrics
    • Fourth bullet point with specific metrics
    • Fifth bullet point with specific metrics
    • Sixth bullet point with specific metrics (optional)
    
    ACHIEVEMENTS:
    • First achievement with specific metrics
    • Second achievement with specific metrics
    • Third achievement with specific metrics
    • Fourth achievement with specific metrics
    • Fifth achievement with specific metrics
    • Sixth achievement with specific metrics (optional)
    
    Focus on common responsibilities and achievements for this role. 
    Make each point impactful and specific to the role.`;

  const content = await generateAIContent(prompt, 'experience');
  
  // Improved parsing to ensure we get multiple points
  let description: string[] = [];
  let achievements: string[] = [];
  
  if (content) {
    const sections = content.split('\n\n');
    
    // Find description section
    const descSection = sections.find(s => s.trim().startsWith('DESCRIPTION:'));
    if (descSection) {
      description = descSection
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
    }
    
    // Find achievements section
    const achieveSection = sections.find(s => s.trim().startsWith('ACHIEVEMENTS:'));
    if (achieveSection) {
      achievements = achieveSection
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
    }
    
    // Fallback if sections not found
    if (description.length === 0 && achievements.length === 0) {
      const lines = content.split('\n').filter(Boolean);
      const bulletPoints = lines.filter(line => line.trim().startsWith('•'));
      
      if (bulletPoints.length > 0) {
        // Split evenly between description and achievements
        const midPoint = Math.ceil(bulletPoints.length / 2);
        description = bulletPoints.slice(0, midPoint).map(line => line.trim().substring(1).trim());
        achievements = bulletPoints.slice(midPoint).map(line => line.trim().substring(1).trim());
      }
    }
  }
  
  // Ensure we have at least some content
  if (description.length === 0) {
    description = ["Led key initiatives and managed cross-functional teams to deliver successful projects"];
  }
  
  if (achievements.length === 0) {
    achievements = ["Exceeded performance targets by 25% through strategic planning and execution"];
  }
  
  return {
    description,
    achievements
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
