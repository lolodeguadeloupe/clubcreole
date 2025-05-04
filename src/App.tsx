import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/plongee",
    element: <DivingActivity />,
  },
  {
    path: "/canoe",
    element: <CanoeActivity />,
  },
  {
    path: "/randonnee",
    element: <HikingActivity />,
  },
  {
    path: "/jet-ski",
    element: <JetSkiActivity />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/become-partner",
    element: <BecomePartner />,
  },
  {
    path: "/loisirs",
    element: <LoisirsActivity />,
  },
  {
    path: "/restauration",
    element: <RestaurantActivity />,
  },
  {
    path: "/location",
    element: <CarRentalActivity />,
  },
  {
    path: "/hebergements",
    element: <AccommodationActivity />,
  },
  {
    path: "/concerts",
    element: <ConcertActivity />,
  },
  {
    path: "/soiree",
    element: <NightlifeActivity />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/advantages",
    element: <AdvantagesManagement />,
  },
  {
    path: "/admin/advantages/new",
    element: <AdvantageForm />,
  },
  {
    path: "/admin/advantages/:id/edit",
    element: <AdvantageForm />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_normalizeFormMethod: true,
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
