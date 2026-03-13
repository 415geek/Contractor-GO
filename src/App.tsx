import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "./providers/ClerkProvider";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Messages from "./pages/Messages";
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
import Login from "./pages/Login";
import Tools from "./pages/Tools";
import VirtualNumbers from "./pages/VirtualNumbers";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/messages" element={<Messages />} />
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
        <Route path="/tools" element={<Tools />} />
        <Route path="/virtual-numbers" element={<VirtualNumbers />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ClerkProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;