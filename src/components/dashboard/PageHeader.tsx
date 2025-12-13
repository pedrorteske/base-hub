import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle && <p className="text-primary-foreground/80 text-sm">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
