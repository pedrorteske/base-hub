import React, { useState, useEffect, useMemo } from "react";
import { Plane, Plus, Trash2, Edit2, Save, X, BarChart3 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface Flight {
  id: string;
  prefixo: string;
  tipoAeronave: string;
  dataVoo: string;
  origem: string;
  destino: string;
  createdAt: string;
}

interface BaseStats {
  base: string;
  count: number;
  percentage: number;
}

const STORAGE_KEY = "portal_voos";

export default function PortalVoos() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lista");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [form, setForm] = useState({
    prefixo: "",
    tipoAeronave: "",
    dataVoo: "",
    origem: "",
    destino: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFlights(JSON.parse(stored));
    }
  }, []);

  // Calculate base statistics from flights (origin and destination)
  const baseStats = useMemo((): BaseStats[] => {
    const baseCounts: Record<string, number> = {};
    
    flights.forEach((flight) => {
      // Extract base code from origin (e.g., "SBGR - Guarulhos" -> "SBGR")
      const originBase = flight.origem.split(" ")[0].toUpperCase();
      const destBase = flight.destino.split(" ")[0].toUpperCase();
      
      if (originBase) {
        baseCounts[originBase] = (baseCounts[originBase] || 0) + 1;
      }
      if (destBase) {
        baseCounts[destBase] = (baseCounts[destBase] || 0) + 1;
      }
    });

    const totalOperations = Object.values(baseCounts).reduce((a, b) => a + b, 0);
    
    return Object.entries(baseCounts)
      .map(([base, count]) => ({
        base,
        count,
        percentage: totalOperations > 0 ? (count / totalOperations) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [flights]);

  const totalOperations = baseStats.reduce((acc, stat) => acc + stat.count, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      prefixo: "",
      tipoAeronave: "",
      dataVoo: "",
      origem: "",
      destino: "",
    });
  };

  const saveFlight = () => {
    if (!form.prefixo || !form.tipoAeronave || !form.dataVoo || !form.origem || !form.destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar o voo.",
        variant: "destructive",
      });
      return;
    }

    const newFlight: Flight = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    const updated = [newFlight, ...flights];
    setFlights(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: "Voo adicionado!",
      description: `Voo ${form.prefixo} foi registrado com sucesso.`,
    });

    resetForm();
    setActiveTab("lista");
  };

  const deleteFlight = (id: string) => {
    const updated = flights.filter((f) => f.id !== id);
    setFlights(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast({
      title: "Voo excluído",
      description: "O voo foi removido com sucesso.",
    });
  };

  const openEditDialog = (flight: Flight) => {
    setEditingFlight(flight);
    setIsDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingFlight) return;
    setEditingFlight({ ...editingFlight, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    if (!editingFlight) return;

    const updated = flights.map((f) =>
      f.id === editingFlight.id ? editingFlight : f
    );
    setFlights(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: "Voo atualizado!",
      description: `Voo ${editingFlight.prefixo} foi atualizado com sucesso.`,
    });

    setIsDialogOpen(false);
    setEditingFlight(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Portal dos Voos"
        subtitle="Gerenciamento de voos confirmados"
        icon={<Plane className="w-8 h-8" />}
      />

      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="lista">Voos Confirmados ({flights.length})</TabsTrigger>
            <TabsTrigger value="novo">
              <Plus className="w-4 h-4 mr-1" />
              Novo Voo
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-1" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista">
            {flights.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum voo confirmado ainda.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("novo")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Voo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Voos Confirmados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Prefixo</TableHead>
                          <TableHead>Tipo de Aeronave</TableHead>
                          <TableHead>Data do Voo</TableHead>
                          <TableHead>Origem</TableHead>
                          <TableHead>Destino</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flights.map((flight) => (
                          <TableRow key={flight.id}>
                            <TableCell className="font-medium">{flight.prefixo}</TableCell>
                            <TableCell>{flight.tipoAeronave}</TableCell>
                            <TableCell>{formatDate(flight.dataVoo)}</TableCell>
                            <TableCell>{flight.origem}</TableCell>
                            <TableCell>{flight.destino}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(flight)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => deleteFlight(flight.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="novo">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Adicionar Novo Voo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prefixo">Prefixo *</Label>
                    <Input
                      id="prefixo"
                      name="prefixo"
                      placeholder="PR-ABC"
                      value={form.prefixo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoAeronave">Tipo de Aeronave *</Label>
                    <Input
                      id="tipoAeronave"
                      name="tipoAeronave"
                      placeholder="Gulfstream G550"
                      value={form.tipoAeronave}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataVoo">Data do Voo *</Label>
                    <Input
                      id="dataVoo"
                      name="dataVoo"
                      type="date"
                      value={form.dataVoo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origem">Origem *</Label>
                    <Input
                      id="origem"
                      name="origem"
                      placeholder="SBGR - Guarulhos"
                      value={form.origem}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="destino">Destino *</Label>
                    <Input
                      id="destino"
                      name="destino"
                      placeholder="SBFL - Florianópolis"
                      value={form.destino}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button onClick={saveFlight} className="w-full" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Voo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de Voos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{flights.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de Operações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalOperations}</div>
                    <p className="text-xs text-muted-foreground">Origem + Destino</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Bases Atendidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{baseStats.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Bar Chart */}
              {baseStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Gráfico de Atendimentos por Base
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Operações",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={baseStats}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="base"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" name="Operações" radius={[4, 4, 0, 0]}>
                            {baseStats.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--primary) / ${1 - index * 0.1})`}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {/* Base Statistics with Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Atendimentos por Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {baseStats.length === 0 ? (
                    <div className="py-8 text-center">
                      <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum dado disponível. Adicione voos para visualizar as estatísticas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {baseStats.map((stat) => (
                        <div key={stat.base} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{stat.base}</span>
                            <span className="text-sm text-muted-foreground">
                              {stat.count} operações ({stat.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={stat.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Table */}
              {baseStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhamento por Base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Base (ICAO)</TableHead>
                          <TableHead className="text-center">Qtd. Operações</TableHead>
                          <TableHead className="text-center">Percentual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {baseStats.map((stat) => (
                          <TableRow key={stat.base}>
                            <TableCell className="font-medium">{stat.base}</TableCell>
                            <TableCell className="text-center">{stat.count}</TableCell>
                            <TableCell className="text-center">
                              {stat.percentage.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Voo</DialogTitle>
          </DialogHeader>
          {editingFlight && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-prefixo">Prefixo</Label>
                <Input
                  id="edit-prefixo"
                  name="prefixo"
                  value={editingFlight.prefixo}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tipoAeronave">Tipo de Aeronave</Label>
                <Input
                  id="edit-tipoAeronave"
                  name="tipoAeronave"
                  value={editingFlight.tipoAeronave}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dataVoo">Data do Voo</Label>
                <Input
                  id="edit-dataVoo"
                  name="dataVoo"
                  type="date"
                  value={editingFlight.dataVoo}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-origem">Origem</Label>
                <Input
                  id="edit-origem"
                  name="origem"
                  value={editingFlight.origem}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-destino">Destino</Label>
                <Input
                  id="edit-destino"
                  name="destino"
                  value={editingFlight.destino}
                  onChange={handleEditChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={saveEdit}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
