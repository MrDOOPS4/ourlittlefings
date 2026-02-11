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

import Auth from "./pages/Auth";
import CoupleSetup from "./pages/CoupleSetup";

import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Keep session in sync (magic-link login will land back here)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Load coupleId from localStorage (this is OK — only the ID is stored locally; data is in Supabase)
  useEffect(() => {
    const saved = localStorage.getItem("olf.couple_id");
    if (saved) setCoupleId(saved);
  }, []);

  // 1) Must be logged in (RLS depends on auth)
  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Auth />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // 2) Must have a couple space (shared between you and partner)
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

  // 3) Normal app
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Pass coupleId to pages that need shared storage */}
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
