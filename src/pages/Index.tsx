import { useState, useMemo } from "react";
import { mockBases } from "@/data/mockBases";
import { BaseCard } from "@/components/dashboard/BaseCard";
import { SearchFilter } from "@/components/dashboard/SearchFilter";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { Plane } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

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

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [searchQuery, statusFilter, stateFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
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
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredBases.length} {filteredBases.length === 1 ? "base encontrada" : "bases encontradas"}
          </p>
        </div>

        {/* Base Cards Grid */}
        {filteredBases.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBases.map((base, index) => (
              <div
                key={base.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BaseCard base={base} />
              </div>
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
