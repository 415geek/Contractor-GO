import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatDetail from "./pages/ChatDetail";
import Discover from "./pages/Discover";
import MaterialSearch from "./pages/MaterialSearch";
import CostEstimate from "./pages/CostEstimate";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Clients from "./pages/Clients";
import Profile from "./pages/Profile";
import Moments from "./pages/Moments";
import Accounting from "./pages/Accounting";
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
          <Route path="/chat/:id" element={<ChatDetail />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/material-search" element={<MaterialSearch />} />
          <Route path="/cost-estimate" element={<CostEstimate />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/accounting" element={<Accounting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;