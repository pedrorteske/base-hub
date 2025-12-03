import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "operational" | "restricted" | "closed";
  className?: string;
}

const statusConfig = {
  operational: {
    label: "Operacional",
    className: "status-operational",
  },
  restricted: {
    label: "Restrito",
    className: "status-restricted",
  },
  closed: {
    label: "Fechado",
    className: "status-closed",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.className, className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === "operational" && "bg-success",
        status === "restricted" && "bg-warning",
        status === "closed" && "bg-destructive"
      )} />
      {config.label}
    </span>
  );
}
