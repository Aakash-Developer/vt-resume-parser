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
    
    IMPORTANT: Generate EXACTLY 6-7 detailed bullet points with 80-90% match to the job description in the following format:
    
    DESCRIPTION:
    • First bullet point with specific metrics that directly match job requirements
    • Second bullet point with specific metrics that directly match job requirements
    • Third bullet point with specific metrics that directly match job requirements
    • Fourth bullet point with specific metrics that directly match job requirements
    • Fifth bullet point with specific metrics that directly match job requirements
    • Sixth bullet point with specific metrics that directly match job requirements
    • Seventh bullet point with specific metrics that directly match job requirements (optional)
    
    ACHIEVEMENTS:
    • First achievement with specific metrics that directly match job requirements
    • Second achievement with specific metrics that directly match job requirements
    • Third achievement with specific metrics that directly match job requirements
    • Fourth achievement with specific metrics that directly match job requirements
    • Fifth achievement with specific metrics that directly match job requirements
    • Sixth achievement with specific metrics that directly match job requirements
    • Seventh achievement with specific metrics that directly match job requirements (optional)
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include industry-specific experience that matches the job description (e.g., e-commerce, healthcare, finance, etc.)
    2. ALWAYS include specific, measurable achievements with numbers, percentages, or other quantifiable metrics
    3. ALWAYS incorporate relevant keywords from the job description (e.g., 'analyst', 'e-commerce', 'remote work', etc.)
    4. ALWAYS align the experience with the specific role requirements mentioned in the job description
    5. ALWAYS highlight transferable skills that are relevant to the position
    6. ALWAYS address location alignment - if the job is in a specific country/region, ensure experience is relevant to that market
    7. ALWAYS include at least 3 bullet points with specific metrics (e.g., "increased revenue by 25%", "reduced costs by $50,000", "improved efficiency by 40%")
    8. ALWAYS bridge any skill gaps - if the candidate's background is in a different field (e.g., software engineering), highlight how those skills transfer to the target role (e.g., analyst)
    9. ALWAYS emphasize relevant tools and technologies mentioned in the job description, even if the candidate's experience with them is limited
    10. ALWAYS focus on the most recent and relevant experience that aligns with the job requirements
    11. ALWAYS extract and use specific skills, tools, and technologies mentioned in the job description
    12. ALWAYS ensure each bullet point directly addresses at least one requirement from the job description
    13. ALWAYS prioritize matching the most important requirements from the job description
    14. ALWAYS use the exact terminology and phrasing found in the job description when possible
    
    Focus on quantifiable results and align the experience with the job requirements.
    Make each point impactful and specific to the role.
    Ensure 80-90% match with the job description requirements.`
    : `Generate professional experience content for a ${position} role at ${company}.
    
    IMPORTANT: Generate EXACTLY 6-7 detailed bullet points in the following format:
    
    DESCRIPTION:
    • First bullet point with specific metrics
    • Second bullet point with specific metrics
    • Third bullet point with specific metrics
    • Fourth bullet point with specific metrics
    • Fifth bullet point with specific metrics
    • Sixth bullet point with specific metrics
    • Seventh bullet point with specific metrics (optional)
    
    ACHIEVEMENTS:
    • First achievement with specific metrics
    • Second achievement with specific metrics
    • Third achievement with specific metrics
    • Fourth achievement with specific metrics
    • Fifth achievement with specific metrics
    • Sixth achievement with specific metrics
    • Seventh achievement with specific metrics (optional)
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include industry-specific experience relevant to the position
    2. ALWAYS include specific, measurable achievements with numbers, percentages, or other quantifiable metrics
    3. ALWAYS highlight transferable skills that are relevant to the position
    4. ALWAYS make each point impactful and specific to the role
    5. ALWAYS include at least 3 bullet points with specific metrics (e.g., "increased revenue by 25%", "reduced costs by $50,000", "improved efficiency by 40%")
    6. ALWAYS bridge any skill gaps - if the candidate's background is in a different field, highlight how those skills transfer to the target role
    7. ALWAYS emphasize relevant tools and technologies for the position, even if the candidate's experience with them is limited
    8. ALWAYS focus on the most recent and relevant experience that aligns with the position requirements
    9. ALWAYS ensure each bullet point directly addresses common requirements for this position
    10. ALWAYS use industry-standard terminology for this role
    
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
    
    Generate 2-3 bullet points for description, 4-5 technologies, and 3-4 achievements. 
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include specific, measurable achievements with numbers, percentages, or other quantifiable metrics
    2. ALWAYS incorporate relevant keywords from the job description
    3. ALWAYS include at least 2 bullet points with specific metrics (e.g., "reduced processing time by 30%", "increased user engagement by 45%")
    4. ALWAYS address location alignment - if the job is in a specific country/region, ensure project experience is relevant to that market
    
    Focus on technical impact and measurable results.`
    : `Generate professional project content for: ${title}
    
    Generate 2-3 bullet points for description, 4-5 technologies, and 3-4 achievements. 
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include specific, measurable achievements with numbers, percentages, or other quantifiable metrics
    2. ALWAYS include at least 2 bullet points with specific metrics (e.g., "reduced processing time by 30%", "increased user engagement by 45%")
    
    Focus on common technical aspects and achievements for this type of project.`;

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
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include specific, measurable academic achievements (e.g., GPA, honors, awards)
    2. ALWAYS incorporate relevant keywords from the job description
    3. ALWAYS highlight coursework or projects that align with the job requirements
    4. ALWAYS address location alignment - if the job is in a specific country/region, ensure education is relevant to that market
    
    Generate 3-4 relevant academic achievements and accomplishments.`
    : `Generate professional education content for ${degree} in ${field} from ${institution}.
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS include specific, measurable academic achievements (e.g., GPA, honors, awards)
    2. ALWAYS highlight coursework or projects that align with the field of study
    
    Focus on common academic achievements and accomplishments for this degree and field. Generate 3-4 relevant achievements.`;

  const content = await generateAIContent(prompt, 'education');
  return {
    achievements: content?.split('\n').filter(Boolean) || []
  };
} 


export async function generateSummaryContent(jd: string | null, summary: string) {
  const prompt = jd
    ? `Write a professional summary based on the following job description: ${jd}
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS highlight specific, measurable achievements that match the job requirements
    2. ALWAYS incorporate relevant keywords from the job description
    3. ALWAYS address location alignment - if the job is in a specific country/region, ensure experience is relevant to that market
    4. ALWAYS keep the summary concise (3-4 sentences) and focused on the most relevant qualifications
    
    Focus on highlighting relevant skills, experience, and achievements that match the job requirements.
    Write the summary directly without any prefix or header.`
    : `Write a professional summary based on the following content: ${summary}
    
    CRITICAL REQUIREMENTS:
    1. ALWAYS highlight specific, measurable achievements
    2. ALWAYS keep the summary concise (3-4 sentences) and focused on the most relevant qualifications
    
    Focus on creating a compelling narrative that highlights key strengths and career objectives.
    Write the summary directly without any prefix or header.`;

  const content = await generateAIContent(prompt, 'summary');
  return content?.trim() || '';
}
