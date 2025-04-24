import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DivingActivity from "./pages/DivingActivity";
import CanoeActivity from "./pages/CanoeActivity";
import HikingActivity from "./pages/HikingActivity";
import JetSkiActivity from "./pages/JetSkiActivity";
import LoisirsActivity from "./pages/LoisirsActivity";
import RestaurantActivity from "./pages/RestaurantActivity";
import CarRentalActivity from "./pages/CarRentalActivity";
import AccommodationActivity from "./pages/AccommodationActivity";
import ConcertActivity from "./pages/ConcertActivity";
import NightlifeActivity from "./pages/NightlifeActivity";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BecomePartner from "./pages/BecomePartner";
import { useEffect } from "react";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdvantageForm } from "@/pages/admin/advantages/AdvantageForm";
import { AdvantagesManagement } from "@/pages/admin/advantages/AdvantagesManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plongee" element={<DivingActivity />} />
          <Route path="/canoe" element={<CanoeActivity />} />
          <Route path="/randonnee" element={<HikingActivity />} />
          <Route path="/jet-ski" element={<JetSkiActivity />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/loisirs" element={<LoisirsActivity />} />
          <Route path="/restauration" element={<RestaurantActivity />} />
          <Route path="/location" element={<CarRentalActivity />} />
          <Route path="/hebergements" element={<AccommodationActivity />} />
          <Route path="/concerts" element={<ConcertActivity />} />
          <Route path="/soiree" element={<NightlifeActivity />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/advantages" element={<AdvantagesManagement />} />
          <Route path="/admin/advantages/new" element={<AdvantageForm />} />
          <Route path="/admin/advantages/:id/edit" element={<AdvantageForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
