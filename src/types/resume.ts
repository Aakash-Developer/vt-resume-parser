export interface ResumeData { 
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
    achievements: string[];
    type: "full-time" | "internship" | "project" | "co-op";
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    certifications?: string[];
    coreCompetencies?:string[]
  };
  // Optional Projects Section
  projects?: Array<{
    title: string;
    description: string[];
    technologies: string[]; // The tools/technologies used in the project
    startDate: string;
    endDate: string;
    role: string; // What was the person's role in the project (e.g., developer, lead, etc.)
    institution?:string;
    location?:string;
    links?: string[]; // Optional links to the project (e.g., GitHub, project website)
  }>;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}
