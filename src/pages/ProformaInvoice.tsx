import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function ProformaInvoice() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = Number(form.quantidade || 0) * Number(form.valorUnitario || 0);

  const gerarPDF = () => {
    const conteudo = document.getElementById("invoice");
    if (!conteudo) return;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Proforma Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h2 { margin-bottom: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .info-row { margin-bottom: 8px; }
            .info-row strong { display: inline-block; width: 150px; }
            .total { margin-top: 20px; font-size: 18px; font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>${conteudo.innerHTML}</body>
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
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
                <h3 className="text-lg font-semibold mb-4">Item</h3>
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

              <Button onClick={gerarPDF} className="w-full" size="lg">
                <Printer className="w-4 h-4 mr-2" />
                Gerar PDF / Imprimir
              </Button>
            </CardContent>
          </Card>

          {/* Preview da Invoice */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="invoice" className="bg-card p-6 rounded-lg border">
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
                      Total BRL: R$ {(total * Number(form.dolarDia)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
