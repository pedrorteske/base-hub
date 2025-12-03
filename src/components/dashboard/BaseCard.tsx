import { Base } from "@/types/base";
import { StatusBadge } from "./StatusBadge";
import {
  User,
  Phone,
  Mail,
  Clock,
  Shield,
  Building2,
  Plane,
  Wrench,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BaseCardProps {
  base: Base;
}

export function BaseCard({ base }: BaseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatHours = (hours?: { open: string; close: string; is24h?: boolean }) => {
    if (!hours) return "—";
    if (hours.is24h) return "24 horas";
    return `${hours.open} - ${hours.close}`;
  };

  const availableServices = base.services.filter((s) => s.available);
  const unavailableServices = base.services.filter((s) => !s.available);

  return (
    <article className="glass-card rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <header className="bg-navy p-4 text-primary-foreground">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-primary/80">{base.icaoCode}</span>
              <StatusBadge status={base.status} />
            </div>
            <h2 className="text-lg font-semibold truncate">{base.name}</h2>
            <div className="flex items-center gap-1 text-sm text-primary-foreground/70 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{base.city}, {base.state}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-navy-light/50 px-3 py-1.5 rounded-md">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatHours(base.airportHours)}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Alert if restricted */}
        {base.status === "restricted" && base.notes && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md text-sm">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <span className="text-warning-foreground">{base.notes}</span>
          </div>
        )}

        {/* Manager */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Gerente Responsável
          </h3>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="font-medium">{base.manager.name}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
              <a href={`tel:${base.manager.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {base.manager.phone}
              </a>
              {base.manager.email && (
                <a href={`mailto:${base.manager.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {base.manager.email}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* PF and RF Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Polícia Federal */}
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Polícia Federal
            </h3>
            <div className={cn(
              "rounded-md p-3 text-sm",
              base.federalPolice.present ? "bg-secondary/50" : "bg-muted/30"
            )}>
              {base.federalPolice.present ? (
                <>
                  <div className="flex items-center gap-1.5 text-success text-xs font-medium mb-2">
                    <span className="w-1.5 h-1.5 bg-success rounded-full" />
                    Presente
                  </div>
                  {base.federalPolice.contact && (
                    <a href={`tel:${base.federalPolice.contact.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="w-3 h-3" />
                      {base.federalPolice.contact.phone}
                    </a>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {formatHours(base.federalPolice.hours)}
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">Não disponível</span>
              )}
            </div>
          </section>

          {/* Receita Federal */}
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Receita Federal
            </h3>
            <div className={cn(
              "rounded-md p-3 text-sm",
              base.federalRevenue.present ? "bg-secondary/50" : "bg-muted/30"
            )}>
              {base.federalRevenue.present ? (
                <>
                  <div className="flex items-center gap-1.5 text-success text-xs font-medium mb-2">
                    <span className="w-1.5 h-1.5 bg-success rounded-full" />
                    Presente
                  </div>
                  {base.federalRevenue.contact && (
                    <a href={`tel:${base.federalRevenue.contact.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="w-3 h-3" />
                      {base.federalRevenue.contact.phone}
                    </a>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {formatHours(base.federalRevenue.hours)}
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">Não disponível</span>
              )}
            </div>
          </section>
        </div>

        {/* Capacity */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5" />
            Capacidade da Base
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-secondary/50 rounded-md p-2.5 text-center">
              <p className="text-lg font-semibold text-foreground">{base.capacity.maxAircraftLength}m</p>
              <p className="text-xs text-muted-foreground">Comprimento máx.</p>
            </div>
            <div className="bg-secondary/50 rounded-md p-2.5 text-center">
              <p className="text-lg font-semibold text-foreground">{base.capacity.maxAircraftWingspan}m</p>
              <p className="text-xs text-muted-foreground">Envergadura máx.</p>
            </div>
            <div className="bg-secondary/50 rounded-md p-2.5 text-center">
              <p className="text-lg font-semibold text-foreground">{base.capacity.maxAircraftWeight}t</p>
              <p className="text-xs text-muted-foreground">Peso máx.</p>
            </div>
            <div className="bg-secondary/50 rounded-md p-2.5 text-center">
              <p className="text-lg font-semibold text-foreground">{base.capacity.parkingSpots}</p>
              <p className="text-xs text-muted-foreground">Posições</p>
            </div>
          </div>
        </section>

        {/* Expandable Section */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 border-t border-border"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Menos detalhes
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Mais detalhes
            </>
          )}
        </button>

        {expanded && (
          <div className="space-y-4 animate-fade-in">
            {/* Services */}
            <section className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Serviços Disponíveis
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {availableServices.map((service) => (
                  <span
                    key={service.name}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-success/10 text-success border border-success/20"
                    title={service.notes}
                  >
                    {service.name}
                    {service.notes && <span className="ml-1 text-success/60">*</span>}
                  </span>
                ))}
                {unavailableServices.map((service) => (
                  <span
                    key={service.name}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground line-through"
                    title={service.notes}
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Equipment */}
            <section className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Equipamentos
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {base.equipment.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* Hangar Info */}
            <div className="bg-secondary/50 rounded-md p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacidade do hangar</span>
                <span className="font-medium">
                  {base.capacity.hangarCapacity > 0 
                    ? `${base.capacity.hangarCapacity} aeronaves` 
                    : "Sem hangar disponível"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
