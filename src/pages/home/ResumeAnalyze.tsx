import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, CheckCircle2, AlertCircle, Info, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { analyzeMatch } from "@/services/analyzeMatch";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ResumeData } from "@/types/resume";
import { ScrollArea } from "@/components/ui/scroll-area";

// Add animation keyframes
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes subtlePulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  /* Prevent flickering during scroll */
  .scroll-smooth {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Hardware acceleration for smoother animations */
  .hardware-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform, opacity;
  }
`;

// Cache for analysis results
const analysisCache = new Map<string, {
  matchAccuracy: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}>();

// Analysis content component that can be used both in dialog and directly
const AnalysisContent = ({ 
  score, 
  isAnalyzing, 
  analysisResult, 
  hasJobDescription, 
  onReAnalyze,
  showSuggestions
}: { 
  score: number;
  isAnalyzing: boolean;
  analysisResult: {
    matchAccuracy: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } | null;
  hasJobDescription: boolean;
  onReAnalyze: () => void;
  showSuggestions: boolean;
}) => {
  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score <= 25) return "#ef4444"; // Red
    if (score <= 50) return "#f97316"; // Orange
    if (score <= 75) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  // Function to get feedback based on score and whether JD is provided
  const getFeedback = (score: number, hasJD: boolean) => {
    if (hasJD) {
      if (score <= 25) return "Your resume needs significant improvements to match the job requirements.";
      if (score <= 50) return "Your resume partially matches the job requirements. Consider some improvements.";
      if (score <= 75) return "Your resume is a good match for the job requirements.";
      return "Excellent! Your resume is a strong match for the job requirements.";
    } else {
      if (score <= 25) return "Your resume needs significant improvements to be ATS-friendly and effective.";
      if (score <= 50) return "Your resume is somewhat ATS-friendly but could use improvements.";
      if (score <= 75) return "Your resume is well-structured and ATS-friendly.";
      return "Excellent! Your resume is highly ATS-friendly and well-optimized.";
    }
  };

  // Function to get icon based on score
  const getScoreIcon = (score: number) => {
    if (score <= 25) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (score <= 50) return <Info className="w-5 h-5 text-orange-500" />;
    if (score <= 75) return <CheckCircle2 className="w-5 h-5 text-yellow-500" />;
    return <Sparkles className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 sm:py-4 hardware-accelerated">
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-500">Analyzing your resume with AI...</p>
        </div>
      ) : (
        <>
          <div className="relative w-36 h-18 sm:w-48 sm:h-24 mb-3 sm:mb-5 hardware-accelerated">
            {/* Half circle background */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-t-full"></div>
            
            {/* Half circle progress indicator */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-2 -2 104 54" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M0,50 A50,50 0 1,1 100,50"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeDasharray={`${score * 1.57}, 157`}
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>
            
            {/* Score text */}
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white px-2 rounded-full shadow-sm">
              <span className="text-xl sm:text-2xl font-bold" style={{ color: getScoreColor(score) }}>{score}%</span>
            </div>
          </div>
          
          <div className="w-full bg-white rounded-lg shadow-md p-2 mb-3 sm:mb-4 border border-gray-100 relative overflow-hidden hardware-accelerated">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-bl-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-tr-full -ml-16 -mb-16"></div>
            </div>
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center relative z-10">
              <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100 relative">
                <div className="relative z-10">
                  {getScoreIcon(score)}
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-800 mb-0.5 text-base sm:text-lg">
                  {hasJobDescription ? "Match Score" : "ATS-Friendly Score"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {getFeedback(score, hasJobDescription)}
                </p>
              </div>
            </div>
          </div>
          
          {showSuggestions && <ScrollArea className="h-[250px] sm:h-[300px] p-2 border rounded-lg border-dashed w-full pe-3 scroll-smooth">
          {analysisResult && (
            <div className="w-full space-y-3 sm:space-y-4 mb-3 sm:mb-4 hardware-accelerated">
              {analysisResult.strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-2 sm:p-3 border border-green-100">
                  <h4 className="font-medium text-green-800 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
                    {hasJobDescription ? "Strengths" : "Resume Strengths"}
                  </h4>
                  <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span> {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysisResult.weaknesses.length > 0 && (
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 border border-red-100">
                  <h4 className="font-medium text-red-800 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500" />
                    {hasJobDescription ? "Areas for Improvement" : "ATS Issues"}
                  </h4>
                  <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                    {analysisResult.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span> {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysisResult.suggestions.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" />
                    {hasJobDescription ? "Suggestions" : "ATS Optimization Tips"}
                  </h4>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span> {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          </ScrollArea>}
          
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-300 shadow-sm flex items-center gap-1"
              onClick={onReAnalyze}
            >
              <Sparkles className="w-3 h-3" />
              Re-analyze
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// Main component with dialog
export default function ResumeAnalyze({ useDialog = true,showSuggestions = true }: { useDialog?: boolean,showSuggestions?: boolean }) {
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    matchAccuracy: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } | null>(null);
  const [showSuggestionsUpdated, setShowSuggestionsUpdated] = useState(showSuggestions);
  // Get data from Redux store
  const parsedResume = useSelector((state: RootState) => state.app.parsedResume);
  const jobDescription = useSelector((state: RootState) => state.app.jd);
  
  // Generate a cache key based on resume and job description
  const getCacheKey = useCallback((resume: ResumeData | null, jd: string | null) => {
    const resumeStr = JSON.stringify(resume);
    const jdStr = jd || "no_jd";
    return `${resumeStr}_${jdStr}`;
  }, []);

  // Check if we have a cached result when resume or job description changes
  useEffect(() => {
    if (parsedResume) {
      const cacheKey = getCacheKey(parsedResume, jobDescription);
      const cachedResult = analysisCache.get(cacheKey);
      
      if (cachedResult) {
        setAnalysisResult(cachedResult);
        setScore(cachedResult.matchAccuracy);
      }
    }
  }, [parsedResume, jobDescription, getCacheKey]);

  // Auto-analyze when component mounts in non-dialog mode
  useEffect(() => {
    if (!useDialog && parsedResume && !analysisResult) {
      handleAnalyze();
    }
  }, [useDialog, parsedResume, analysisResult]);

  const handleAnalyze = async (forceRefresh = false) => {
    try {
      setIsAnalyzing(true);
      setScore(0);
      setAnalysisResult(null);
      
      if (!parsedResume) {
        toast.error("Please upload a resume first");
        setIsAnalyzing(false);
        return;
      }
      
      // Check cache first (unless force refresh is requested)
      if (!forceRefresh) {
        const cacheKey = getCacheKey(parsedResume, jobDescription);
        const cachedResult = analysisCache.get(cacheKey);
        
        if (cachedResult) {
          setAnalysisResult(cachedResult);
          setScore(cachedResult.matchAccuracy);
          setIsAnalyzing(false);
          return;
        }
      }
      
      // Use a default job description if none is provided
      const jdToUse = jobDescription || "General position requiring skills and experience matching the resume";
      
      const result = await analyzeMatch(parsedResume, jdToUse);
      
      // Cache the result
      const cacheKey = getCacheKey(parsedResume, jobDescription);
      analysisCache.set(cacheKey, result);
      
      setAnalysisResult(result);
      setScore(result.matchAccuracy);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReAnalyze = useCallback(() => {
    // Force a refresh of the analysis
    handleAnalyze(true);
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      // When dialog opens, run the analysis if we don't have results yet
      if (!analysisResult) {
        handleAnalyze();
      }
    }
  };

  const hasJobDescription = !!jobDescription;

  // If not using dialog, render the content directly
  if (!useDialog) {
    return (
      <div className="w-full mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6 hardware-accelerated">
        <style>{animationStyles}</style>
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <div className="flex items-center justify-between gap-2 w-full" >
            <h2 className="text-base sm:text-xl font-semibold">
            {hasJobDescription ? "Resume Match Analysis" : "Resume Quality Analysis"}
          </h2>
          <Button className=" bg-gradient-to-r from-blue-500 to-purple-600  p-1.5 text-white hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300 text-xs sm:text-sm" size="sm" onClick={() => setShowSuggestionsUpdated(!showSuggestionsUpdated)}>
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {showSuggestionsUpdated ? "Hide Suggestions" : "Show Suggestions"}
          </Button>
          </div>
          
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          {hasJobDescription 
            ? "AI-powered analysis of your resume against the job requirements" 
            : "AI-powered analysis of your resume's ATS-friendliness and overall quality"}
        </p>
        
        <AnalysisContent 
          score={score}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          hasJobDescription={hasJobDescription}
          onReAnalyze={handleReAnalyze}
          showSuggestions={showSuggestionsUpdated   }
        />
      </div>
    );
  }

  // If using dialog, render with dialog wrapper
  return (
    <div className="hardware-accelerated">
      <style>{animationStyles}</style>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 w-full p-1.5 text-white hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300 text-xs sm:text-sm"
            onClick={() => handleAnalyze()}
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {hasJobDescription ? "Analyze Resume Match" : "Analyze Resume Quality"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-gray-50 max-h-[90vh] overflow-hidden p-3 sm:p-6">
          <DialogHeader className="mb-2 sm:mb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              {hasJobDescription ? "Resume Match Analysis" : "Resume Quality Analysis"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {hasJobDescription 
                ? "AI-powered analysis of your resume against the job requirements" 
                : "AI-powered analysis of your resume's ATS-friendliness and overall quality"}
            </DialogDescription>
          </DialogHeader>
          
          <AnalysisContent 
            score={score}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            hasJobDescription={hasJobDescription}
            onReAnalyze={handleReAnalyze}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
