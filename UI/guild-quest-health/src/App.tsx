import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import CardioExercises from "./pages/CardioExercises";
import StrengthExercises from "./pages/StrengthExercises";
import YogaExercises from "./pages/YogaExercises";
import SitupsExercise from "./pages/SitupsExercise";
import GenericExercise from "./pages/GenericExercise";
import Leagues from "./pages/Leagues";
import Trophies from "./pages/Trophies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="w-full">
            <Routes>
              {/* All routes now require authentication */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/training" element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              } />
              <Route path="/training/cardio" element={
                <ProtectedRoute>
                  <CardioExercises />
                </ProtectedRoute>
              } />
              <Route path="/training/strength" element={
                <ProtectedRoute>
                  <StrengthExercises />
                </ProtectedRoute>
              } />
              <Route path="/training/yoga" element={
                <ProtectedRoute>
                  <YogaExercises />
                </ProtectedRoute>
              } />
              <Route path="/exercise/situps" element={
                <ProtectedRoute>
                  <SitupsExercise />
                </ProtectedRoute>
              } />
              <Route path="/exercise/:exerciseId" element={
                <ProtectedRoute>
                  <GenericExercise />
                </ProtectedRoute>
              } />
              <Route path="/leagues" element={
                <ProtectedRoute>
                  <Leagues />
                </ProtectedRoute>
              } />
              <Route path="/trophies" element={
                <ProtectedRoute>
                  <Trophies />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
