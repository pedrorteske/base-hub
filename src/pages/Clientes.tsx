import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Users, Trash2, Search } from "lucide-react";

interface Cliente {
  id: string;
  operador: string;
  documento: string;
  tipoDocumento: "CNPJ" | "CPF";
  contatoOperacional: string;
  email: string;
  telefone: string;
  dataCadastro: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    operador: "",
    documento: "",
    tipoDocumento: "CNPJ" as "CNPJ" | "CPF",
    contatoOperacional: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("clientes");
    if (saved) {
      setClientes(JSON.parse(saved));
    }
  }, []);

  const generateClientId = () => {
    const count = clientes.length + 1;
    return `CLI-${String(count).padStart(5, "0")}`;
  };

  const formatDocumento = (value: string, tipo: "CNPJ" | "CPF") => {
    const numbers = value.replace(/\D/g, "");
    if (tipo === "CPF") {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2");
    } else {
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})/, "$1-$2");
    }
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operador || !formData.documento || !formData.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const novoCliente: Cliente = {
      id: generateClientId(),
      ...formData,
      dataCadastro: new Date().toISOString(),
    };

    const updatedClientes = [...clientes, novoCliente];
    setClientes(updatedClientes);
    localStorage.setItem("clientes", JSON.stringify(updatedClientes));

    toast.success(`Cliente ${novoCliente.id} cadastrado com sucesso!`);

    setFormData({
      operador: "",
      documento: "",
      tipoDocumento: "CNPJ",
      contatoOperacional: "",
      email: "",
      telefone: "",
    });
  };

  const handleDelete = (id: string) => {
    const updatedClientes = clientes.filter((c) => c.id !== id);
    setClientes(updatedClientes);
    localStorage.setItem("clientes", JSON.stringify(updatedClientes));
    toast.success("Cliente removido");
  };

  const filteredClientes = clientes.filter(
    (c) =>
      c.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documento.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-muted-foreground">Cadastro e gestão de clientes</p>
      </div>

      <Tabs defaultValue="cadastro" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Cliente
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes Cadastrados ({clientes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Cadastrar Novo Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operador">Operador *</Label>
                    <Input
                      id="operador"
                      placeholder="Nome do operador"
                      value={formData.operador}
                      onChange={(e) =>
                        setFormData({ ...formData, operador: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.tipoDocumento === "CNPJ" ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setFormData({ ...formData, tipoDocumento: "CNPJ", documento: "" })
                        }
                      >
                        CNPJ
                      </Button>
                      <Button
                        type="button"
                        variant={formData.tipoDocumento === "CPF" ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setFormData({ ...formData, tipoDocumento: "CPF", documento: "" })
                        }
                      >
                        CPF
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento">{formData.tipoDocumento} *</Label>
                    <Input
                      id="documento"
                      placeholder={formData.tipoDocumento === "CNPJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                      value={formData.documento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documento: formatDocumento(e.target.value, formData.tipoDocumento),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contatoOperacional">Contato Operacional</Label>
                    <Input
                      id="contatoOperacional"
                      placeholder="Nome do contato"
                      value={formData.contatoOperacional}
                      onChange={(e) =>
                        setFormData({ ...formData, contatoOperacional: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          telefone: formatTelefone(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar Cliente
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Clientes Cadastrados
                </CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredClientes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum cliente cadastrado
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {cliente.id}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {cliente.operador}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground mr-1">
                              {cliente.tipoDocumento}:
                            </span>
                            {cliente.documento}
                          </TableCell>
                          <TableCell>{cliente.contatoOperacional || "-"}</TableCell>
                          <TableCell>{cliente.email}</TableCell>
                          <TableCell>{cliente.telefone || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cliente.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clientes;
