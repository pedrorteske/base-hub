import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, ArrowRight } from "lucide-react";
import BrazilMap from "@/components/BrazilMap";
import { NavigationMenu } from "@/components/dashboard/NavigationMenu";
import { mockBases } from "@/data/mockBases";
import { Button } from "@/components/ui/button";

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
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/bases')}
            className="gap-2"
          >
            Ver Todas as Bases
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="container px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Rede de Bases Operacionais
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visualize nossa cobertura nacional e acesse informações detalhadas de cada base
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
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
