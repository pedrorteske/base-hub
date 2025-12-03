import { Base } from "@/types/base";
import { Plane, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface StatsOverviewProps {
  bases: Base[];
}

export function StatsOverview({ bases }: StatsOverviewProps) {
  const operational = bases.filter((b) => b.status === "operational").length;
  const restricted = bases.filter((b) => b.status === "restricted").length;
  const closed = bases.filter((b) => b.status === "closed").length;

  const stats = [
    {
      label: "Total de Bases",
      value: bases.length,
      icon: Plane,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Operacionais",
      value: operational,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Restritos",
      value: restricted,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Fechados",
      value: closed,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-lg p-4 flex items-center gap-3 animate-fade-in"
        >
          <div className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
