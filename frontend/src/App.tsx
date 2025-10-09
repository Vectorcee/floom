import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "@/components/providers/WagmiProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Index from "./pages/Index";
import LiveSpace from "./pages/LiveSpace";
import CreateSpace from "./pages/CreateSpace";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";



const App = () => (
  <Providers>
    <ProfileProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/space/:id" element={<LiveSpace />} />
            <Route path="/create" element={<CreateSpace />} />
            <Route path="/profile/:handle" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/store" element={<Store />} />
            <Route path="/wallet" element={<Wallet />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProfileProvider>
  </Providers>
);

export default App;
