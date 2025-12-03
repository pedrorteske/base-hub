import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
  states: string[];
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  regions: string[];
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stateFilter,
  onStateFilterChange,
  states,
  regionFilter,
  onRegionFilterChange,
  regions,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, código ICAO ou cidade..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={regionFilter} onValueChange={onRegionFilterChange}>
          <SelectTrigger className="w-[130px] bg-card">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px] bg-card">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="operational">Operacional</SelectItem>
            <SelectItem value="restricted">Restrito</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={onStateFilterChange}>
          <SelectTrigger className="w-[100px] bg-card">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
