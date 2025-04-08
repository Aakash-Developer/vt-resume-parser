import { ResumeData } from "@/types/resume";
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  parsedResume: ResumeData | null;
  resume: string | null;
  jd: string | null;
}

const initialState: AppState = {
  parsedResume: {
    "personal": {
        "name": "MONISH",
        "title": "DATA ANALYST | MACHINE LEARNING ENGINEER",
        "email": "email@example.com",
        "phone": "Phone Number",
        "location": "Current Location",
        "linkedin": "LinkedIn Profile",
        "summary": "Innovative and results-driven Data Professional with expertise in data analysis, machine learning, and cloud technologies. Adept at developing predictive models, enhancing system security, and implementing cloud-based solutions. Proven track record in building data pipelines, analyzing genomic data, and delivering actionable insights. Experienced in collaborating with cross-functional teams and driving project success."
    },
    "experience": [
        {
            "company": "Magzter Digital Private Limited",
            "position": "Software Engineer",
            "location": "India",
            "startDate": "Dec 2021",
            "endDate": "Apr 2022",
            "description": [
                "Implemented AWS WAFV2 for HTTP APIs, reducing hacker injections by 60% and enhancing product security in 4 months",
                "Developed a robust Node.js algorithm to block malicious IP addresses, improving system security for IPv4 and IPv6 traffic",
                "Created an AWS CloudFront Distribution (CDN), reducing direct endpoint usage by 80% and protecting Lambda functions",
                "Enforced mandatory headers and integrated AWS KMS to enhance API security while optimizing code with Lambda Layers"
            ],
            "achievements": [],
            "type": "full-time"
        },
        {
            "company": "Genome International Private Limited",
            "position": "Software Engineer Intern",
            "location": "India",
            "startDate": "Feb 2021",
            "endDate": "May 2021",
            "description": [
                "Parsed over 2.7 million unique genes and their locations by developing a web scraping program to download genomic data",
                "Extracted details of 23 chromosomes from genomic databases using web scraping and successfully published data on AWS EC2",
                "Processed metadata from 500+ patients to create structured data records and analyze genomic information, improving data accuracy",
                "Collected information on 1,000+ genes using APIs and SQL, visualizing and storing data in nested structures to enhance accessibility"
            ],
            "achievements": [],
            "type": "internship"
        }
    ],
    "education": [
        {
            "institution": "Stevens Institute of Technology",
            "degree": "Masters in Artificial Intelligence",
            "field": "",
            "location": "Hoboken, New Jersey",
            "startDate": "May 2024",
            "endDate": "",
            "gpa": "3.97/4.0"
        },
        {
            "institution": "Anna University",
            "degree": "Bachelors in Information Technology",
            "field": "",
            "location": "India",
            "startDate": "May 2021",
            "endDate": "",
            "gpa": "7.7/10.0"
        }
    ],
    "skills": {
        "technical": [
            "Python",
            "Java",
            "C",
            "C#",
            "HTML",
            "CSS",
            "Node.js",
            "React.js",
            "SQL",
            "MySQL",
            "MongoDB",
            "AWS RDS",
            "Oracle",
            "TensorFlow",
            "PyTorch",
            "Keras",
            "Scikit-learn",
            "OpenCV",
            "Pandas",
            "NumPy"
        ],
        "soft": [
            "Data Analysis & Visualization",
            "Machine Learning Model Development",
            "Regression & Predictive Analysis",
            "Big Data Analysis & MapReduce",
            "Cloud Infrastructure (AWS, Azure)",
            "API Security & Optimization",
            "Web Scraping & Data Mining",
            "Data Pipeline Development",
            "Project Management",
            "Agile & Scrum Methodologies",
            "Database Design & Management",
            "Code Optimization & Efficiency",
            "Secure Cloud Architecture",
            "Time Management"
        ],
        "tools": [
            "Tableau",
            "Power BI",
            "Seaborn",
            "Matplotlib",
            "Amazon Web Services (AWS)",
            "Azure",
            "Google Cloud",
            "Android Studio",
            "Microsoft Office Suite (Word, Excel, PowerPoint)",
            "Visual Studio",
            "Jupyter Notebook"
        ],
        "certifications": [
            "A-Z Machine Learning - Udemy",
            "A-Z Artificial Intelligence - Udemy",
            "Neural Networks and Deep Learning - DeepLearning.ai",
            "Python for Data Science and AI - IBM",
            "Python Data Structures - University of Michigan",
            "Angular 8 - VSkills",
            "Introduction to Machine Learning - Duke University",
            "Machine Learning - Stanford University"
        ],
        "coreCompetencies": [
            "Data Analysis & Visualization",
            "Machine Learning Model Development",
            "Regression & Predictive Analysis",
            "Big Data Analysis & MapReduce",
            "Cloud Infrastructure (AWS, Azure)",
            "API Security & Optimization",
            "Web Scraping & Data Mining",
            "Data Pipeline Development",
            "Project Management",
            "Agile & Scrum Methodologies",
            "Database Design & Management",
            "Code Optimization & Efficiency",
            "Secure Cloud Architecture",
            "Time Management"
        ]
    },
    "projects": [
        {
            "title": "Facial Key Points Detection",
            "description": [
                "Developed a high-accuracy deep learning model for facial key points detection, enhancing facial recognition and augmented reality",
                "Implemented a CNN with Python, PyTorch, and OpenCV to detect 15 facial key points in a 96×96 grayscale portrait dataset"
            ],
            "technologies": [
                "Python",
                "PyTorch",
                "OpenCV"
            ],
            "startDate": "Jan 2023",
            "endDate": "May 2023",
            "role": ""
        },
        {
            "title": "Android Health Check",
            "description": [
                "Led a 3-member team to investigate malware presence in the Android operating system using a dataset, providing key insights",
                "Cleaned and reduced data dimensionality, using classification algorithms to build predictive models and improve malware detection"
            ],
            "technologies": [
                "Classification Algorithms"
            ],
            "startDate": "Sep 2023",
            "endDate": "Dec 2023",
            "role": ""
        },
        {
            "title": "Drowsiness Detection",
            "description": [
                "Led a team of three in developing a real-time system to reduce car accidents by monitoring driver’s eye movements and issuing alerts",
                "Processed images and evaluated machine learning algorithms like KNN, CNN, SVM, Random Forest, and Decision Trees to detect drowsiness"
            ],
            "technologies": [
                "KNN",
                "CNN",
                "SVM",
                "Random Forest",
                "Decision Trees"
            ],
            "startDate": "Sep 2022",
            "endDate": "Dec 2022",
            "role": ""
        },
        {
            "title": "Emotion-Based Music Recommender",
            "description": [
                "Designed a deep learning model to provide highly personalized music recommendations using real-time emotion analysis",
                "Analyzed images and developed 3-layer neural networks to classify facial expressions into seven categories for music recommendations"
            ],
            "technologies": [
                "Deep Learning",
                "Neural Networks"
            ],
            "startDate": "Sep 2022",
            "endDate": "Dec 2022",
            "role": ""
        }
    ]
},
  resume: null,
  jd: null
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setParsedResume: (state, action) => {
      state.parsedResume = action.payload;
    },
    setResume: (state, action) => {
      state.resume = action.payload;
    },
    setJD: (state, action) => {
      state.jd = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const { setParsedResume, setResume, setJD, resetState } = appSlice.actions;

export default appSlice.reducer;
