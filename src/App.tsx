import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AttendanceModule from "./pages/modules/AttendanceModule";
import FocusAnalytics from "./pages/modules/FocusAnalytics";
import QuizzesModule from "./pages/modules/QuizzesModule";
import AssignmentsModule from "./pages/modules/AssignmentsModule";
import MarksModule from "./pages/modules/MarksModule";
import AIAssistantModule from "./pages/modules/AIAssistantModule";
import MentoringModule from "./pages/modules/MentoringModule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modules/attendance" element={<AttendanceModule />} />
          <Route path="/modules/focus-analytics" element={<FocusAnalytics />} />
          <Route path="/modules/quizzes" element={<QuizzesModule />} />
          <Route path="/modules/assignments" element={<AssignmentsModule />} />
          <Route path="/modules/marks" element={<MarksModule />} />
          <Route path="/modules/ai-assistant" element={<AIAssistantModule />} />
          <Route path="/modules/mentoring" element={<MentoringModule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;