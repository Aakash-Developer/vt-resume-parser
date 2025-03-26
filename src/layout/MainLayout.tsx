import ResumePreview from "@/pages/dashboard/resume/ResumePreview";
import ResumeEditor from "@/pages/dashboard/resumeEditor/ResumeEditor";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { resetState } from "@/store/features/app";
import { useNavigate, Outlet } from "react-router";
import { Sparkles } from "lucide-react";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = () => {
    dispatch(resetState());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleReset}>
              New Resume
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* Editor Section */}
          <div className="w-1/2 h-full border-r bg-muted/5">
            <ResumeEditor />
          </div>

          {/* Preview Section */}
          <div className="w-1/2 h-full bg-background">
            <ResumePreview />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
