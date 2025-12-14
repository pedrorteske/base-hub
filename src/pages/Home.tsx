import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Building2, DollarSign, FileText, Receipt, CalendarDays } from "lucide-react";
import BrazilMap from "@/components/BrazilMap";
import { mockBases } from "@/data/mockBases";
import { Button } from "@/components/ui/button";

const quickAccessItems = [
  { label: "Bases", icon: Building2, path: "/bases" },
  { label: "Preços", icon: DollarSign, path: "/precos" },
  { label: "Cotação", icon: FileText, path: "/cotacao" },
  { label: "Proforma Invoice", icon: Receipt, path: "/proforma-invoice" },
  { label: "Portal dos Voos", icon: CalendarDays, path: "/portal-voos" },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  
  const selectedBase = selectedBaseId 
    ? mockBases.find(b => b.id === selectedBaseId) 
    : null;

  const totalBases = mockBases.length;
  const operationalBases = mockBases.filter(b => b.status === 'operational').length;
  const regions = [...new Set(mockBases.map(b => b.region))].length;

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <div className="container px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Rede de Bases Operacionais
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visualize nossa cobertura nacional e acesse informações detalhadas
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-6">
          {quickAccessItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
          <div className="text-center p-3 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary">{totalBases}</div>
            <div className="text-xs text-muted-foreground">Bases</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary">{operationalBases}</div>
            <div className="text-xs text-muted-foreground">Operacionais</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary">{regions}</div>
            <div className="text-xs text-muted-foreground">Regiões</div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 container px-4 pb-6">
        <div className="relative h-[calc(100vh-380px)] min-h-[350px] rounded-lg overflow-hidden border border-border">
          <BrazilMap onBaseClick={setSelectedBaseId} />
          
          {/* Selected Base Info Panel */}
          {selectedBase && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-card/95 backdrop-blur border border-border rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedBase.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedBase.city}, {selectedBase.state}</span>
                  </div>
                </div>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  {selectedBase.icaoCode}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Gerente:</span>
                  <p className="font-medium text-foreground truncate">{selectedBase.manager.name}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Horário:</span>
                  <p className="font-medium text-foreground">
                    {selectedBase.airportHours.is24h 
                      ? '24h' 
                      : `${selectedBase.airportHours.open} - ${selectedBase.airportHours.close}`}
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={() => navigate('/bases')}
              >
                Ver Detalhes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
