import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Cotacao from "./pages/Cotacao";
import ProformaInvoice from "./pages/ProformaInvoice";
import PortalVoos from "./pages/PortalVoos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bases" element={<Index />} />
          <Route path="/precos" element={<Pricing />} />
          <Route path="/cotacao" element={<Cotacao />} />
          <Route path="/proforma" element={<ProformaInvoice />} />
          <Route path="/voos" element={<PortalVoos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
