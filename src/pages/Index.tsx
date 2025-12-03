import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mockBases, regions } from "@/data/mockBases";
import { BaseCard } from "@/components/dashboard/BaseCard";
import { SearchFilter } from "@/components/dashboard/SearchFilter";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { Plane, DollarSign, MapPin } from "lucide-react";
import { Region } from "@/types/base";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const states = useMemo(() => {
    const uniqueStates = [...new Set(mockBases.map((b) => b.state))];
    return uniqueStates.sort();
  }, []);

  const filteredBases = useMemo(() => {
    return mockBases.filter((base) => {
      const matchesSearch =
        searchQuery === "" ||
        base.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        base.icaoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        base.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || base.status === statusFilter;
      const matchesState = stateFilter === "all" || base.state === stateFilter;
      const matchesRegion = regionFilter === "all" || base.region === regionFilter;

      return matchesSearch && matchesStatus && matchesState && matchesRegion;
    });
  }, [searchQuery, statusFilter, stateFilter, regionFilter]);

  const basesByRegion = useMemo(() => {
    const grouped: Record<string, typeof filteredBases> = {};
    filteredBases.forEach((base) => {
      if (!grouped[base.region]) {
        grouped[base.region] = [];
      }
      grouped[base.region].push(base);
    });
    return grouped;
  }, [filteredBases]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Central de Bases</h1>
                <p className="text-sm text-primary-foreground/70">
                  Dashboard de Operações Aéreas
                </p>
              </div>
            </div>
            <Link
              to="/precos"
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
            >
              <DollarSign className="w-4 h-4" />
              Tabela de Preços
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Stats */}
        <StatsOverview bases={mockBases} />

        {/* Search and Filters */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          states={states}
          regionFilter={regionFilter}
          onRegionFilterChange={setRegionFilter}
          regions={regions.map(r => r.name)}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredBases.length} {filteredBases.length === 1 ? "base encontrada" : "bases encontradas"}
          </p>
        </div>

        {/* Base Cards by Region */}
        {filteredBases.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(basesByRegion).map(([region, bases]) => (
              <section key={region} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Região {region}</h2>
                  <span className="text-sm text-muted-foreground">({bases.length} {bases.length === 1 ? "base" : "bases"})</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {bases.map((base, index) => (
                    <div
                      key={base.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BaseCard base={base} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              Nenhuma base encontrada
            </h3>
            <p className="text-sm text-muted-foreground/70">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Central de Bases — Dashboard de Operações Aéreas</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
