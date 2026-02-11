import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Memories from "./pages/Memories";
import Valentine from "./pages/Valentine";
import DateBuilder from "./pages/DateBuilder";
import NotFound from "./pages/NotFound";

import CoupleSetup from "./pages/CoupleSetup";

const queryClient = new QueryClient();

const App = () => {
  const [coupleId, setCoupleId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("olf.couple_id");
    if (saved) setCoupleId(saved);
  }, []);

  // Require couple link before using the app
  if (!coupleId) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CoupleSetup
            onReady={(id) => {
              localStorage.setItem("olf.couple_id", id);
              setCoupleId(id);
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/memories" element={<Memories coupleId={coupleId} />} />
            <Route path="/valentine" element={<Valentine />} />
            <Route path="/dates" element={<DateBuilder coupleId={coupleId} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
