import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Copy, 
  Check,
  Plus,
  Minus,
  Calculator,
  Save,
  Trash2,
  Eye,
  FolderOpen,
  X
} from "lucide-react";
import { pricingData, pricingCategories, PricingItem } from "@/data/pricing";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/PageHeader";

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

interface SavedQuote {
  id: string;
  clientInfo: ClientInfo;
  selectedItems: SelectedItem[];
  total: number;
  createdAt: string;
  quoteNumber: string;
}

const SERVICE_FEE_RATE = 0.15; // 15%
const FEDERAL_TAX_RATE = 0.1662; // 16.62%

const STORAGE_KEY = "aviation-saved-quotes";

export default function Cotacao() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("nova");
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
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [viewingQuote, setViewingQuote] = useState<SavedQuote | null>(null);

  // Load saved quotes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedQuotes(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved quotes:", e);
      }
    }
  }, []);

  // Save quotes to localStorage
  const saveToStorage = (quotes: SavedQuote[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    setSavedQuotes(quotes);
  };

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

  const generateQuoteNumber = () => `COT-${Date.now().toString().slice(-6)}`;

  const generateQuoteText = (quoteNumber?: string, info?: ClientInfo, items?: SelectedItem[], calcs?: typeof calculations) => {
    const formatCurrency = (value: number) => 
      value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

    const useInfo = info || clientInfo;
    const useItems = items || selectedItems;
    const useCalcs = calcs || calculations;
    const dateFormatted = new Date(useInfo.date).toLocaleDateString('pt-BR');
    
    let text = `═══════════════════════════════════════
        COTAÇÃO DE SERVIÇOS AEROPORTUÁRIOS
═══════════════════════════════════════

📅 Data: ${dateFormatted}
📋 Cotação Nº: ${quoteNumber || generateQuoteNumber()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (useInfo.name) text += `👤 Cliente: ${useInfo.name}\n`;
    if (useInfo.company) text += `🏢 Empresa: ${useInfo.company}\n`;
    if (useInfo.aircraft) text += `✈️ Aeronave: ${useInfo.aircraft}\n`;
    if (useInfo.registration) text += `🔖 Matrícula: ${useInfo.registration}\n`;

    text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVIÇOS COTADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const groupedItems: Record<string, SelectedItem[]> = {};
    useItems.forEach(si => {
      if (!groupedItems[si.item.category]) {
        groupedItems[si.item.category] = [];
      }
      groupedItems[si.item.category].push(si);
    });

    Object.entries(groupedItems).forEach(([category, catItems]) => {
      text += `\n📂 ${category.toUpperCase()}\n`;
      text += `─────────────────────────────────────\n`;
      
      catItems.forEach(({ item, quantity }) => {
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

    if (useCalcs.otherSubtotal > 0) {
      text += `Outros Serviços: ${formatCurrency(useCalcs.otherSubtotal)}\n`;
    }

    if (useCalcs.parkingSubtotal > 0) {
      text += `Estacionamento (base): ${formatCurrency(useCalcs.parkingSubtotal)}\n`;
      text += `  + Taxa de Serviço (15%): ${formatCurrency(useCalcs.serviceFee)}\n`;
      text += `  + Impostos Federais (16,62%): ${formatCurrency(useCalcs.federalTax)}\n`;
      text += `Estacionamento (total): ${formatCurrency(useCalcs.parkingWithTaxes)}\n`;
    }

    text += `
═══════════════════════════════════════
💰 VALOR TOTAL: ${formatCurrency(useCalcs.total)}
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

  const copyToClipboard = async (text?: string) => {
    const quoteText = text || generateQuoteText();
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);
    toast({
      title: "Cotação copiada!",
      description: "O texto da cotação foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const saveQuote = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Nenhum serviço selecionado",
        description: "Selecione pelo menos um serviço para salvar a cotação.",
        variant: "destructive",
      });
      return;
    }

    const quoteNumber = generateQuoteNumber();
    const newQuote: SavedQuote = {
      id: Date.now().toString(),
      clientInfo: { ...clientInfo },
      selectedItems: selectedItems.map(si => ({ ...si, item: { ...si.item } })),
      total: calculations.total,
      createdAt: new Date().toISOString(),
      quoteNumber,
    };

    const updatedQuotes = [newQuote, ...savedQuotes];
    saveToStorage(updatedQuotes);

    toast({
      title: "Cotação salva!",
      description: `Cotação ${quoteNumber} foi salva com sucesso.`,
    });

    // Clear form
    setSelectedItems([]);
    setClientInfo({
      name: "",
      company: "",
      aircraft: "",
      registration: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  const deleteQuote = (id: string) => {
    const updatedQuotes = savedQuotes.filter(q => q.id !== id);
    saveToStorage(updatedQuotes);
    toast({
      title: "Cotação excluída",
      description: "A cotação foi removida com sucesso.",
    });
  };

  const recalculateQuoteTotal = (items: SelectedItem[]) => {
    let parkingSubtotal = 0;
    let otherSubtotal = 0;

    items.forEach(({ item, quantity }) => {
      const lineTotal = item.price * quantity;
      if (item.category === "Estacionamento") {
        parkingSubtotal += lineTotal;
      } else {
        otherSubtotal += lineTotal;
      }
    });

    const serviceFee = parkingSubtotal * SERVICE_FEE_RATE;
    const federalTax = parkingSubtotal * FEDERAL_TAX_RATE;
    const parkingWithTaxes = parkingSubtotal + serviceFee + federalTax;

    return {
      subtotal: parkingSubtotal + otherSubtotal,
      parkingSubtotal,
      otherSubtotal,
      serviceFee,
      federalTax,
      parkingWithTaxes,
      total: otherSubtotal + parkingWithTaxes,
    };
  };

  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Cotação de Serviços"
        subtitle="Gere e salve cotações"
        icon={<Calculator className="w-8 h-8" />}
      />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="nova" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Cotação
            </TabsTrigger>
            <TabsTrigger value="salvas" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Cotações Salvas ({savedQuotes.length})
            </TabsTrigger>
          </TabsList>

          {/* Nova Cotação Tab */}
          <TabsContent value="nova">
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
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
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

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => copyToClipboard()}
                        >
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copiar
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="secondary"
                          className="flex-1"
                          onClick={saveQuote}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Salvar
                        </Button>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Preview do texto:
                        </Label>
                        <Textarea
                          readOnly
                          value={generateQuoteText()}
                          className="h-[150px] text-xs font-mono"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cotações Salvas Tab */}
          <TabsContent value="salvas">
            {savedQuotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma cotação salva</h3>
                  <p className="text-muted-foreground text-sm">
                    Crie uma nova cotação e clique em "Salvar" para vê-la aqui.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("nova")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Nova Cotação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedQuotes.map(quote => (
                  <Card key={quote.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-primary">
                          {quote.quoteNumber}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        {quote.clientInfo.name && (
                          <p className="text-sm font-medium text-foreground">{quote.clientInfo.name}</p>
                        )}
                        {quote.clientInfo.company && (
                          <p className="text-xs text-muted-foreground">{quote.clientInfo.company}</p>
                        )}
                        {quote.clientInfo.aircraft && (
                          <p className="text-xs text-muted-foreground">
                            ✈️ {quote.clientInfo.aircraft} {quote.clientInfo.registration && `(${quote.clientInfo.registration})`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {quote.selectedItems.length} {quote.selectedItems.length === 1 ? 'serviço' : 'serviços'}
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(quote.total)}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setViewingQuote(quote)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const calcs = recalculateQuoteTotal(quote.selectedItems);
                            const text = generateQuoteText(quote.quoteNumber, quote.clientInfo, quote.selectedItems, calcs);
                            copyToClipboard(text);
                          }}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir cotação?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A cotação {quote.quoteNumber} será permanentemente excluída.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteQuote(quote.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal para visualizar cotação */}
        {viewingQuote && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{viewingQuote.quoteNumber}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setViewingQuote(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[70vh]">
                <Textarea
                  readOnly
                  value={generateQuoteText(
                    viewingQuote.quoteNumber,
                    viewingQuote.clientInfo,
                    viewingQuote.selectedItems,
                    recalculateQuoteTotal(viewingQuote.selectedItems)
                  )}
                  className="h-[500px] text-xs font-mono"
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const calcs = recalculateQuoteTotal(viewingQuote.selectedItems);
                      const text = generateQuoteText(viewingQuote.quoteNumber, viewingQuote.clientInfo, viewingQuote.selectedItems, calcs);
                      copyToClipboard(text);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Cotação
                  </Button>
                  <Button variant="outline" onClick={() => setViewingQuote(null)}>
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
