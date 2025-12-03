import { useState } from "react";
import { Link } from "react-router-dom";
import { pricingData, pricingCategories } from "@/data/pricing";
import {
  Plane,
  ArrowLeft,
  Fuel,
  ParkingCircle,
  Warehouse,
  Wrench,
  Users,
  HardHat,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  "Combustível": Fuel,
  "Estacionamento": ParkingCircle,
  "Hangaragem": Warehouse,
  "Equipamentos": Wrench,
  "Serviços de Rampa": HardHat,
  "Crew e Passageiros": Users,
};

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState<string>(pricingCategories[0]);

  const filteredPricing = pricingData.filter((item) => item.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="h-6 w-px bg-primary-foreground/20" />
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tabela de Preços</h1>
                <p className="text-sm text-primary-foreground/70">
                  Valores padrão para todas as bases
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pricingCategories.map((category) => {
            const Icon = categoryIcons[category] || Wrench;
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                {category}
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Valores de referência</p>
            <p className="text-muted-foreground">
              Os preços listados são valores padrão aplicáveis a todas as bases. Valores podem sofrer
              alterações conforme demanda, disponibilidade e condições especiais. Entre em contato com
              o gerente da base para cotações específicas.
            </p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Serviço
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Unidade
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">
                    Valor
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Observações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPricing.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-foreground">{item.service}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{item.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-primary font-mono">
                        {formatPrice(item.price)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {item.notes ? (
                        <span className="text-sm text-muted-foreground italic">{item.notes}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Formas de Pagamento</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                Faturamento (clientes cadastrados)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                Cartão de crédito
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                PIX
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                Transferência bancária
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Descontos</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                10% - Volume acima de 5.000L/mês
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                15% - Contratos anuais
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                5% - Pagamento antecipado
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contato Comercial</h3>
            <p className="text-sm text-foreground mb-2">
              Para cotações especiais ou contratos:
            </p>
            <p className="text-sm text-muted-foreground">
              comercial@aviacao.com.br
            </p>
            <p className="text-sm text-muted-foreground">
              (11) 3000-0000
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Valores em reais (BRL) — Última atualização: Dezembro 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
