import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, ArrowRight, Building2, DollarSign, FileText, Receipt, CalendarDays } from "lucide-react";
import BrazilMap from "@/components/BrazilMap";
import { NavigationMenu } from "@/components/dashboard/NavigationMenu";
import { mockBases } from "@/data/mockBases";
import { Button } from "@/components/ui/button";

const quickAccessItems = [
  { label: "Bases", icon: Building2, path: "/bases", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Preços", icon: DollarSign, path: "/precos", color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Cotação", icon: FileText, path: "/cotacao", color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Proforma Invoice", icon: Receipt, path: "/proforma-invoice", color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Portal dos Voos", icon: CalendarDays, path: "/portal-voos", color: "text-rose-500", bg: "bg-rose-500/10" },
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <NavigationMenu />
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plane className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-none">Aviation Ops</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="container px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Rede de Bases Operacionais
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visualize nossa cobertura nacional e acesse informações detalhadas de cada base
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-8">
            {quickAccessItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-center">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-6">
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary">{totalBases}</div>
              <div className="text-sm text-muted-foreground">Bases</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-green-500">{operationalBases}</div>
              <div className="text-sm text-muted-foreground">Operacionais</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-blue-500">{regions}</div>
              <div className="text-sm text-muted-foreground">Regiões</div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="flex-1 container px-4 pb-8">
          <div className="relative h-[calc(100vh-380px)] min-h-[400px] rounded-2xl overflow-hidden border border-border shadow-xl">
            <BrazilMap onBaseClick={setSelectedBaseId} />
            
            {/* Selected Base Info Panel */}
            {selectedBase && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card/95 backdrop-blur border border-border rounded-xl p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBase.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedBase.city}, {selectedBase.state}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {selectedBase.icaoCode}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Gerente:</span>
                    <p className="font-medium truncate">{selectedBase.manager.name}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Horário:</span>
                    <p className="font-medium">
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
                  Ver Detalhes Completos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
