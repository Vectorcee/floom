import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "@/components/providers/WagmiProvider";
import Index from "./pages/Index";
import LiveSpace from "./pages/LiveSpace";
import CreateSpace from "./pages/CreateSpace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";



const App = () => (
  <Providers>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/space/:id" element={<LiveSpace />} />
          <Route path="/create" element={<CreateSpace />} />
          <Route path="/profile/:handle" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Providers>
);

export default App;
