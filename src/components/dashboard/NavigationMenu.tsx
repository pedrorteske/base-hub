import { Link, useLocation } from "react-router-dom";
import { Menu, DollarSign, Home, Calculator, FileText, Plane } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Bases", path: "/", icon: Home },
  { name: "Preços", path: "/precos", icon: DollarSign },
  { name: "Cotação", path: "/cotacao", icon: Calculator },
  { name: "Proforma Invoice", path: "/proforma", icon: FileText },
  { name: "Portal dos Voos", path: "/voos", icon: Plane },
];

export function NavigationMenu() {
  const location = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-lg transition-colors text-sm font-medium">
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {navigationItems.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-2 w-full cursor-pointer",
                location.pathname === item.path && "bg-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
