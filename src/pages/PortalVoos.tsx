import React, { useState, useEffect } from "react";
import { Plane, Plus, Trash2, Edit2, Save, X } from "lucide-react";
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

interface Flight {
  id: string;
  prefixo: string;
  tipoAeronave: string;
  dataVoo: string;
  origem: string;
  destino: string;
  createdAt: string;
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
