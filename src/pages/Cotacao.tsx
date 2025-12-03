import { useState, useMemo } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plane, 
  Menu, 
  FileText, 
  Copy, 
  Check,
  Plus,
  Minus,
  Calculator
} from "lucide-react";
import { pricingData, pricingCategories, PricingItem } from "@/data/pricing";
import { useToast } from "@/hooks/use-toast";

interface SelectedItem {
  item: PricingItem;
  quantity: number;
}

interface ClientInfo {
  name: string;
  company: string;
  aircraft: string;
  registration: string;
  date: string;
}

const SERVICE_FEE_RATE = 0.15; // 15%
const FEDERAL_TAX_RATE = 0.1662; // 16.62%

export default function Cotacao() {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Combustível");
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    company: "",
    aircraft: "",
    registration: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [copied, setCopied] = useState(false);

  const filteredPricing = useMemo(() => {
    return pricingData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const toggleItem = (item: PricingItem) => {
    const existingIndex = selectedItems.findIndex(si => si.item.id === item.id);
    if (existingIndex >= 0) {
      setSelectedItems(prev => prev.filter(si => si.item.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, { item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(prev => 
      prev.map(si => {
        if (si.item.id === itemId) {
          const newQty = Math.max(1, si.quantity + delta);
          return { ...si, quantity: newQty };
        }
        return si;
      })
    );
  };

  const isSelected = (itemId: string) => selectedItems.some(si => si.item.id === itemId);

  const calculations = useMemo(() => {
    let subtotal = 0;
    let parkingSubtotal = 0;
    let otherSubtotal = 0;

    selectedItems.forEach(({ item, quantity }) => {
      const lineTotal = item.price * quantity;
      subtotal += lineTotal;
      if (item.category === "Estacionamento") {
        parkingSubtotal += lineTotal;
      } else {
        otherSubtotal += lineTotal;
      }
    });

    // Taxas aplicam apenas ao estacionamento
    const serviceFee = parkingSubtotal * SERVICE_FEE_RATE;
    const federalTax = parkingSubtotal * FEDERAL_TAX_RATE;
    const parkingWithTaxes = parkingSubtotal + serviceFee + federalTax;
    const total = otherSubtotal + parkingWithTaxes;

    return {
      subtotal,
      parkingSubtotal,
      otherSubtotal,
      serviceFee,
      federalTax,
      parkingWithTaxes,
      total,
    };
  }, [selectedItems]);

  const generateQuoteText = () => {
    const formatCurrency = (value: number) => 
      value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

    const dateFormatted = new Date(clientInfo.date).toLocaleDateString('pt-BR');
    
    let text = `═══════════════════════════════════════
        COTAÇÃO DE SERVIÇOS AEROPORTUÁRIOS
═══════════════════════════════════════

📅 Data: ${dateFormatted}
📋 Cotação Nº: COT-${Date.now().toString().slice(-6)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (clientInfo.name) text += `👤 Cliente: ${clientInfo.name}\n`;
    if (clientInfo.company) text += `🏢 Empresa: ${clientInfo.company}\n`;
    if (clientInfo.aircraft) text += `✈️ Aeronave: ${clientInfo.aircraft}\n`;
    if (clientInfo.registration) text += `🔖 Matrícula: ${clientInfo.registration}\n`;

    text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVIÇOS COTADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Agrupar por categoria
    const groupedItems: Record<string, SelectedItem[]> = {};
    selectedItems.forEach(si => {
      if (!groupedItems[si.item.category]) {
        groupedItems[si.item.category] = [];
      }
      groupedItems[si.item.category].push(si);
    });

    Object.entries(groupedItems).forEach(([category, items]) => {
      text += `\n📂 ${category.toUpperCase()}\n`;
      text += `─────────────────────────────────────\n`;
      
      items.forEach(({ item, quantity }) => {
        const lineTotal = item.price * quantity;
        text += `• ${item.service}\n`;
        text += `  ${quantity}x ${item.unit} @ ${formatCurrency(item.price)} = ${formatCurrency(lineTotal)}\n`;
        if (item.notes) {
          text += `  📝 ${item.notes}\n`;
        }
      });
    });

    text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMO FINANCEIRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    if (calculations.otherSubtotal > 0) {
      text += `Outros Serviços: ${formatCurrency(calculations.otherSubtotal)}\n`;
    }

    if (calculations.parkingSubtotal > 0) {
      text += `Estacionamento (base): ${formatCurrency(calculations.parkingSubtotal)}\n`;
      text += `  + Taxa de Serviço (15%): ${formatCurrency(calculations.serviceFee)}\n`;
      text += `  + Impostos Federais (16,62%): ${formatCurrency(calculations.federalTax)}\n`;
      text += `Estacionamento (total): ${formatCurrency(calculations.parkingWithTaxes)}\n`;
    }

    text += `
═══════════════════════════════════════
💰 VALOR TOTAL: ${formatCurrency(calculations.total)}
═══════════════════════════════════════

⚠️ OBSERVAÇÕES:
• Valores em USD (Dólar Americano)
• Cotação válida por 7 dias
• Taxas de estacionamento incluem:
  - 15% Taxa de Serviço
  - 16,62% Impostos Federais
• Sujeito à disponibilidade

📞 Para confirmar, entre em contato conosco.
═══════════════════════════════════════
`;

    return text;
  };

  const copyToClipboard = async () => {
    const text = generateQuoteText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Cotação copiada!",
      description: "O texto da cotação foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <NavLink to="/" className="w-full cursor-pointer">
                      <Plane className="mr-2 h-4 w-4" />
                      Bases
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/precos" className="w-full cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Preços
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/cotacao" className="w-full cursor-pointer">
                      <Calculator className="mr-2 h-4 w-4" />
                      Cotação
                    </NavLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Cotação de Serviços</h1>
                  <p className="text-sm text-muted-foreground">Gere cotações com valores finais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna 1: Dados do Cliente */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  value={clientInfo.name}
                  onChange={e => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={clientInfo.company}
                  onChange={e => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aircraft">Aeronave</Label>
                <Input
                  id="aircraft"
                  value={clientInfo.aircraft}
                  onChange={e => setClientInfo(prev => ({ ...prev, aircraft: e.target.value }))}
                  placeholder="Ex: Gulfstream G550"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration">Matrícula</Label>
                <Input
                  id="registration"
                  value={clientInfo.registration}
                  onChange={e => setClientInfo(prev => ({ ...prev, registration: e.target.value }))}
                  placeholder="Ex: PR-ABC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={clientInfo.date}
                  onChange={e => setClientInfo(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coluna 2: Seleção de Serviços */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Selecionar Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {pricingCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredPricing.map(item => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected(item.id) 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleItem(item)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={isSelected(item.id)} 
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{item.service}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                        {item.subcategory && (
                          <span className="text-xs px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">
                            {item.subcategory}
                          </span>
                        )}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-primary whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coluna 3: Itens Selecionados e Total */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Cotação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItems.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Selecione serviços para criar a cotação
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {selectedItems.map(({ item, quantity }) => (
                      <div key={item.id} className="p-2 bg-secondary/50 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.service}</p>
                            <p className="text-xs text-muted-foreground">{item.unit}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-right text-sm font-semibold text-primary">
                          {formatCurrency(item.price * quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    {calculations.otherSubtotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Outros Serviços</span>
                        <span>{formatCurrency(calculations.otherSubtotal)}</span>
                      </div>
                    )}
                    {calculations.parkingSubtotal > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estacionamento</span>
                          <span>{formatCurrency(calculations.parkingSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs pl-4">
                          <span className="text-muted-foreground">+ Taxa Serviço (15%)</span>
                          <span>{formatCurrency(calculations.serviceFee)}</span>
                        </div>
                        <div className="flex justify-between text-xs pl-4">
                          <span className="text-muted-foreground">+ Impostos (16,62%)</span>
                          <span>{formatCurrency(calculations.federalTax)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(calculations.total)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Cotação Completa
                      </>
                    )}
                  </Button>

                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Preview do texto:
                    </Label>
                    <Textarea
                      readOnly
                      value={generateQuoteText()}
                      className="h-[200px] text-xs font-mono"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
