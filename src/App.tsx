import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Cotacao from "./pages/Cotacao";
import ProformaInvoice from "./pages/ProformaInvoice";
import PortalVoos from "./pages/PortalVoos";
import Clientes from "./pages/Clientes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bases" element={<Index />} />
            <Route path="/precos" element={<Pricing />} />
            <Route path="/cotacao" element={<Cotacao />} />
            <Route path="/proforma-invoice" element={<ProformaInvoice />} />
            <Route path="/portal-voos" element={<PortalVoos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
