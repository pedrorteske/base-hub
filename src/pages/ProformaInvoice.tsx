import React, { useState, useEffect } from "react";
import { Printer, FileText, Save, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface InvoiceItem {
  id: string;
  descricao: string;
  quantidade: string;
  valorUnitario: string;
}

interface FormData {
  cliente: string;
  operador: string;
  email: string;
  telefone: string;
  dataVoo: string;
  dolarDia: string;
  data: string;
  items: InvoiceItem[];
}

interface SavedInvoice {
  id: string;
  form: FormData;
  total: number;
  totalBRL: number;
  createdAt: string;
}

const STORAGE_KEY = "proforma_invoices";

const createEmptyItem = (descricao = "", quantidade = "", valorUnitario = ""): InvoiceItem => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  descricao,
  quantidade,
  valorUnitario,
});

const createDefaultItems = (): InvoiceItem[] => [
  createEmptyItem(),
  createEmptyItem("ADM FEES - AIRPORT FEES", "15", ""),
  createEmptyItem("GOV FEES - AIRPORT FEES", "16.62", ""),
];

export default function ProformaInvoice() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("nova");
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [viewingInvoice, setViewingInvoice] = useState<SavedInvoice | null>(null);

  const [form, setForm] = useState<FormData>({
    cliente: "",
    operador: "",
    email: "",
    telefone: "",
    dataVoo: "",
    dolarDia: "",
    data: "",
    items: createDefaultItems(),
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old format to new format
      const migrated = parsed.map((inv: any) => {
        if (!inv.form.items) {
          return {
            ...inv,
            form: {
              ...inv.form,
              items: [{
                id: "migrated",
                descricao: inv.form.descricao || "",
                quantidade: inv.form.quantidade || "",
                valorUnitario: inv.form.valorUnitario || "",
              }],
            },
          };
        }
        return inv;
      });
      setSavedInvoices(migrated);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: string) => {
    setForm({
      ...form,
      items: form.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, createEmptyItem()],
    });
  };

  const removeItem = (itemId: string) => {
    if (form.items.length === 1) return;
    setForm({
      ...form,
      items: form.items.filter((item) => item.id !== itemId),
    });
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    return Number(item.quantidade || 0) * Number(item.valorUnitario || 0);
  };

  const total = form.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  const totalBRL = form.dolarDia ? total * Number(form.dolarDia) : 0;

  const saveInvoice = () => {
    const hasValidItem = form.items.some((item) => item.descricao);
    if (!form.cliente || !hasValidItem) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o cliente e a descrição de um item.",
        variant: "destructive",
      });
      return;
    }

    const newInvoice: SavedInvoice = {
      id: Date.now().toString(),
      form,
      total,
      totalBRL,
      createdAt: new Date().toISOString(),
    };

    const updated = [newInvoice, ...savedInvoices];
    setSavedInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: "Invoice salva!",
      description: `Invoice para ${form.cliente} foi salva com sucesso.`,
    });

    // Reset form
    setForm({
      cliente: "",
      operador: "",
      email: "",
      telefone: "",
      dataVoo: "",
      dolarDia: "",
      data: "",
      items: createDefaultItems(),
    });
  };

  const deleteInvoice = (id: string) => {
    const updated = savedInvoices.filter((inv) => inv.id !== id);
    setSavedInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast({
      title: "Invoice excluída",
      description: "A invoice foi removida com sucesso.",
    });
  };

  const gerarPDF = (invoiceData?: FormData) => {
    const data = invoiceData || form;
    const items = data.items || [];
    const invoiceTotal = items.reduce(
      (acc, item) => acc + Number(item.quantidade || 0) * Number(item.valorUnitario || 0),
      0
    );
    const invoiceTotalBRL = data.dolarDia ? invoiceTotal * Number(data.dolarDia) : 0;

    const itemsRows = items
      .map(
        (item) => `
        <tr>
          <td>${item.descricao || "-"}</td>
          <td style="text-align: center;">${item.quantidade || "-"}</td>
          <td style="text-align: right;">${item.valorUnitario ? `$${Number(item.valorUnitario).toFixed(2)}` : "-"}</td>
          <td style="text-align: right;">$${(Number(item.quantidade || 0) * Number(item.valorUnitario || 0)).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const content = `
      <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Proforma Invoice</h2>
      <div style="margin-bottom: 20px;">
        <p><strong style="display: inline-block; width: 150px;">Cliente:</strong> ${data.cliente || "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Operador:</strong> ${data.operador || "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Email:</strong> ${data.email || "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Telefone:</strong> ${data.telefone || "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Data do Voo:</strong> ${data.dataVoo || "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Dólar do Dia:</strong> ${data.dolarDia ? `R$ ${data.dolarDia}` : "-"}</p>
        <p><strong style="display: inline-block; width: 150px;">Data:</strong> ${data.data || "-"}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Valor Unit. USD</th>
            <th style="text-align: right;">Total USD</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      <div style="margin-top: 20px; text-align: right;">
        <p style="font-size: 18px; font-weight: bold;">Total USD: $${invoiceTotal.toFixed(2)}</p>
        ${data.dolarDia ? `<p style="color: #666;">Total BRL: R$ ${invoiceTotalBRL.toFixed(2)}</p>` : ""}
      </div>
    `;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Proforma Invoice - ${data.cliente}</title>
          <style>
            @page { size: landscape; margin: 20mm; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
            h2 { margin-bottom: 20px; color: #1a1a1a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const getInvoiceItemsSummary = (invoice: SavedInvoice) => {
    const items = invoice.form.items || [];
    if (items.length === 0) return "-";
    if (items.length === 1) return items[0].descricao || "-";
    return `${items[0].descricao} (+${items.length - 1} itens)`;
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Proforma Invoice"
        subtitle="Gerador de Invoice"
        icon={<FileText className="w-8 h-8" />}
      />

      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="nova">Nova Invoice</TabsTrigger>
            <TabsTrigger value="salvas">
              Invoices Salvas ({savedInvoices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nova">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados da Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente *</Label>
                      <Input
                        id="cliente"
                        name="cliente"
                        placeholder="Nome do cliente"
                        value={form.cliente}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="operador">Operador</Label>
                      <Input
                        id="operador"
                        name="operador"
                        placeholder="Nome do operador"
                        value={form.operador}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="+55 00 00000-0000"
                        value={form.telefone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataVoo">Data do Voo</Label>
                      <Input
                        id="dataVoo"
                        name="dataVoo"
                        type="date"
                        value={form.dataVoo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data">Data da Invoice</Label>
                      <Input
                        id="data"
                        name="data"
                        type="date"
                        value={form.data}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="dolarDia">Dólar do Dia (BRL)</Label>
                      <Input
                        id="dolarDia"
                        name="dolarDia"
                        placeholder="5.50"
                        value={form.dolarDia}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Itens *</h3>
                      <Button variant="outline" size="sm" onClick={addItem}>
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Item
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {form.items.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-muted/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Item {index + 1}
                            </span>
                            {form.items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Input
                              placeholder="Descrição do serviço"
                              value={item.descricao}
                              onChange={(e) => handleItemChange(item.id, "descricao", e.target.value)}
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Quantidade</Label>
                              <Input
                                type="number"
                                placeholder="1"
                                value={item.quantidade}
                                onChange={(e) => handleItemChange(item.id, "quantidade", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Valor Unitário (USD)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={item.valorUnitario}
                                onChange={(e) => handleItemChange(item.id, "valorUnitario", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <span className="text-muted-foreground">Subtotal: </span>
                            <span className="font-medium">${calculateItemTotal(item).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={saveInvoice} className="flex-1" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Invoice
                    </Button>
                    <Button onClick={() => gerarPDF()} variant="outline" size="lg">
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview da Invoice */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-bold border-b-2 border-foreground pb-2 mb-4">
                      Proforma Invoice
                    </h2>

                    <div className="space-y-2 mb-6">
                      <p><strong className="inline-block w-36">Cliente:</strong> {form.cliente || "-"}</p>
                      <p><strong className="inline-block w-36">Operador:</strong> {form.operador || "-"}</p>
                      <p><strong className="inline-block w-36">Email:</strong> {form.email || "-"}</p>
                      <p><strong className="inline-block w-36">Telefone:</strong> {form.telefone || "-"}</p>
                      <p><strong className="inline-block w-36">Data do Voo:</strong> {form.dataVoo || "-"}</p>
                      <p><strong className="inline-block w-36">Dólar do Dia:</strong> {form.dolarDia ? `R$ ${form.dolarDia}` : "-"}</p>
                      <p><strong className="inline-block w-36">Data:</strong> {form.data || "-"}</p>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-center">Qtd</TableHead>
                          <TableHead className="text-right">Valor Unit. USD</TableHead>
                          <TableHead className="text-right">Total USD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {form.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.descricao || "-"}</TableCell>
                            <TableCell className="text-center">{item.quantidade || "-"}</TableCell>
                            <TableCell className="text-right">
                              {item.valorUnitario ? `$${Number(item.valorUnitario).toFixed(2)}` : "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${calculateItemTotal(item).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 text-right">
                      <p className="text-xl font-bold">
                        Total USD: ${total.toFixed(2)}
                      </p>
                      {form.dolarDia && (
                        <p className="text-muted-foreground mt-1">
                          Total BRL: R$ {totalBRL.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="salvas">
            {savedInvoices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma invoice salva</h3>
                  <p className="text-muted-foreground">
                    Crie uma nova invoice na aba "Nova Invoice" e salve para visualizar aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{invoice.form.cliente}</h3>
                          <p className="text-muted-foreground text-sm">
                            {getInvoiceItemsSummary(invoice)}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Total: ${invoice.total.toFixed(2)}</span>
                            {invoice.totalBRL > 0 && (
                              <span className="text-muted-foreground ml-2">
                                (R$ {invoice.totalBRL.toFixed(2)})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Criada em: {new Date(invoice.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => gerarPDF(invoice.form)}
                          >
                            <Printer className="w-4 h-4 mr-1" />
                            Imprimir
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteInvoice(invoice.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog para visualizar invoice */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proforma Invoice - {viewingInvoice?.form.cliente}</DialogTitle>
          </DialogHeader>
          {viewingInvoice && (
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-bold border-b-2 border-foreground pb-2 mb-4">
                Proforma Invoice
              </h2>

              <div className="space-y-2 mb-6">
                <p><strong className="inline-block w-36">Cliente:</strong> {viewingInvoice.form.cliente || "-"}</p>
                <p><strong className="inline-block w-36">Operador:</strong> {viewingInvoice.form.operador || "-"}</p>
                <p><strong className="inline-block w-36">Email:</strong> {viewingInvoice.form.email || "-"}</p>
                <p><strong className="inline-block w-36">Telefone:</strong> {viewingInvoice.form.telefone || "-"}</p>
                <p><strong className="inline-block w-36">Data do Voo:</strong> {viewingInvoice.form.dataVoo || "-"}</p>
                <p><strong className="inline-block w-36">Dólar do Dia:</strong> {viewingInvoice.form.dolarDia ? `R$ ${viewingInvoice.form.dolarDia}` : "-"}</p>
                <p><strong className="inline-block w-36">Data:</strong> {viewingInvoice.form.data || "-"}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Valor Unit. USD</TableHead>
                    <TableHead className="text-right">Total USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(viewingInvoice.form.items || []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descricao || "-"}</TableCell>
                      <TableCell className="text-center">{item.quantidade || "-"}</TableCell>
                      <TableCell className="text-right">
                        {item.valorUnitario ? `$${Number(item.valorUnitario).toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(Number(item.quantidade || 0) * Number(item.valorUnitario || 0)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 text-right">
                <p className="text-xl font-bold">
                  Total USD: ${viewingInvoice.total.toFixed(2)}
                </p>
                {viewingInvoice.totalBRL > 0 && (
                  <p className="text-muted-foreground mt-1">
                    Total BRL: R$ {viewingInvoice.totalBRL.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => gerarPDF(viewingInvoice.form)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
