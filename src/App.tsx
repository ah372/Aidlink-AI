import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import FrontDesk from "./pages/FrontDesk";
import MedicalAgent from "./pages/MedicalAgent";
import PoliceAgent from "./pages/PoliceAgent";
import ElectricityAgent from "./pages/ElectricityAgent";
import FireAgent from "./pages/FireAgent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/frontdesk" element={<FrontDesk />} />
          <Route path="/medical" element={<MedicalAgent />} />
          <Route path="/police" element={<PoliceAgent />} />
          <Route path="/electricity" element={<ElectricityAgent />} />
          <Route path="/fire" element={<FireAgent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
