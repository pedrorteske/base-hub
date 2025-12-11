import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, FileText, Save, Trash2, Copy, Eye } from "lucide-react";
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

interface FormData {
  cliente: string;
  operador: string;
  email: string;
  telefone: string;
  dataVoo: string;
  dolarDia: string;
  data: string;
  descricao: string;
  quantidade: string;
  valorUnitario: string;
}

interface SavedInvoice {
  id: string;
  form: FormData;
  total: number;
  totalBRL: number;
  createdAt: string;
}

const STORAGE_KEY = "proforma_invoices";

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
    descricao: "",
    quantidade: "",
    valorUnitario: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedInvoices(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = Number(form.quantidade || 0) * Number(form.valorUnitario || 0);
  const totalBRL = form.dolarDia ? total * Number(form.dolarDia) : 0;

  const saveInvoice = () => {
    if (!form.cliente || !form.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o cliente e a descrição.",
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
      descricao: "",
      quantidade: "",
      valorUnitario: "",
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
    const invoiceTotal = Number(data.quantidade || 0) * Number(data.valorUnitario || 0);
    const invoiceTotalBRL = data.dolarDia ? invoiceTotal * Number(data.dolarDia) : 0;

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
          <tr>
            <td>${data.descricao || "-"}</td>
            <td style="text-align: center;">${data.quantidade || "-"}</td>
            <td style="text-align: right;">${data.valorUnitario ? `$${Number(data.valorUnitario).toFixed(2)}` : "-"}</td>
            <td style="text-align: right;">$${invoiceTotal.toFixed(2)}</td>
          </tr>
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
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Proforma Invoice</h1>
                <p className="text-primary-foreground/80 text-sm">Gerador de Invoice</p>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                    <h3 className="text-lg font-semibold mb-4">Item *</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input
                          id="descricao"
                          name="descricao"
                          placeholder="Descrição do serviço"
                          value={form.descricao}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantidade">Quantidade</Label>
                          <Input
                            id="quantidade"
                            name="quantidade"
                            type="number"
                            placeholder="1"
                            value={form.quantidade}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valorUnitario">Valor Unitário (USD)</Label>
                          <Input
                            id="valorUnitario"
                            name="valorUnitario"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.valorUnitario}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
                        <TableRow>
                          <TableCell>{form.descricao || "-"}</TableCell>
                          <TableCell className="text-center">{form.quantidade || "-"}</TableCell>
                          <TableCell className="text-right">
                            {form.valorUnitario ? `$${Number(form.valorUnitario).toFixed(2)}` : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${total.toFixed(2)}
                          </TableCell>
                        </TableRow>
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
                            {invoice.form.descricao} • {invoice.form.quantidade}x
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
                  <TableRow>
                    <TableCell>{viewingInvoice.form.descricao || "-"}</TableCell>
                    <TableCell className="text-center">{viewingInvoice.form.quantidade || "-"}</TableCell>
                    <TableCell className="text-right">
                      {viewingInvoice.form.valorUnitario ? `$${Number(viewingInvoice.form.valorUnitario).toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${viewingInvoice.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
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
