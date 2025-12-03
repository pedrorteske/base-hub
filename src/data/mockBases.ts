import { Base } from "@/types/base";

export const mockBases: Base[] = [
  // Região Sul
  {
    id: "1",
    name: "Base Porto Alegre - Salgado Filho",
    icaoCode: "SBPA",
    city: "Porto Alegre",
    state: "RS",
    region: "Sul",
    manager: {
      name: "Marcos Ferreira",
      phone: "(51) 99123-4567",
      email: "marcos.ferreira@aviacao.com.br",
    },
    federalPolice: {
      present: true,
      contact: {
        name: "Delegacia PF Salgado Filho",
        phone: "(51) 3358-2000",
      },
      hours: { open: "06:00", close: "23:00" },
    },
    federalRevenue: {
      present: true,
      contact: {
        name: "Receita Federal - POA",
        phone: "(51) 3358-2100",
      },
      hours: { open: "08:00", close: "18:00" },
    },
    airportHours: { open: "05:30", close: "23:30" },
    services: [
      { name: "Abastecimento JET-A1", available: true },
      { name: "Abastecimento AVGAS", available: true },
      { name: "GPU", available: true },
      { name: "Reboque", available: true },
      { name: "Hangaragem", available: true },
      { name: "Manutenção", available: true },
      { name: "Catering", available: true },
      { name: "Crew Lounge", available: true },
      { name: "Deicing", available: true, notes: "Disponível no inverno" },
    ],
    equipment: ["GPU 28V", "GPU 115V", "Escada", "Rebocador", "Carrinho de bagagem", "Extintor ABC", "Deicing"],
    capacity: {
      maxAircraftLength: 50,
      maxAircraftWingspan: 45,
      maxAircraftWeight: 80,
      parkingSpots: 12,
      hangarCapacity: 6,
    },
    status: "operational",
  },
  {
    id: "2",
    name: "Base Florianópolis - Hercílio Luz",
    icaoCode: "SBFL",
    city: "Florianópolis",
    state: "SC",
    region: "Sul",
    manager: {
      name: "Carolina Machado",
      phone: "(48) 99876-5432",
      email: "carolina.machado@aviacao.com.br",
    },
    federalPolice: {
      present: true,
      contact: {
        name: "Delegacia PF Florianópolis",
        phone: "(48) 3331-6000",
      },
      hours: { open: "06:00", close: "22:00" },
    },
    federalRevenue: {
      present: true,
      contact: {
        name: "Receita Federal - FLN",
        phone: "(48) 3331-6100",
      },
      hours: { open: "08:00", close: "17:00" },
    },
    airportHours: { open: "06:00", close: "22:30" },
    services: [
      { name: "Abastecimento JET-A1", available: true },
      { name: "Abastecimento AVGAS", available: true },
      { name: "GPU", available: true },
      { name: "Reboque", available: true },
      { name: "Hangaragem", available: true },
      { name: "Manutenção", available: true, notes: "Parceiro autorizado" },
      { name: "Catering", available: true, notes: "Pedido com 12h antecedência" },
      { name: "Crew Lounge", available: true },
    ],
    equipment: ["GPU 28V", "Escada", "Rebocador", "Carrinho de bagagem", "Extintor ABC"],
    capacity: {
      maxAircraftLength: 42,
      maxAircraftWingspan: 38,
      maxAircraftWeight: 65,
      parkingSpots: 8,
      hangarCapacity: 4,
    },
    status: "operational",
  },
  {
    id: "3",
    name: "Base Curitiba - Afonso Pena",
    icaoCode: "SBCT",
    city: "Curitiba",
    state: "PR",
    region: "Sul",
    manager: {
      name: "Ricardo Almeida",
      phone: "(41) 99234-5678",
      email: "ricardo.almeida@aviacao.com.br",
    },
    federalPolice: {
      present: true,
      contact: {
        name: "Delegacia PF Afonso Pena",
        phone: "(41) 3381-1500",
      },
      hours: { open: "00:00", close: "23:59", is24h: true },
    },
    federalRevenue: {
      present: true,
      contact: {
        name: "Receita Federal - CWB",
        phone: "(41) 3381-1600",
      },
      hours: { open: "07:00", close: "19:00" },
    },
    airportHours: { open: "00:00", close: "23:59", is24h: true },
    services: [
      { name: "Abastecimento JET-A1", available: true },
      { name: "Abastecimento AVGAS", available: true },
      { name: "GPU", available: true },
      { name: "Reboque", available: true },
      { name: "Hangaragem", available: true },
      { name: "Manutenção", available: true },
      { name: "Catering", available: true },
      { name: "Crew Lounge", available: true },
    ],
    equipment: ["GPU 28V", "GPU 115V", "Escada grande", "Escada pequena", "Rebocador", "Carrinho de bagagem", "Extintor ABC", "Ar condicionado de solo"],
    capacity: {
      maxAircraftLength: 55,
      maxAircraftWingspan: 48,
      maxAircraftWeight: 90,
      parkingSpots: 15,
      hangarCapacity: 8,
    },
    status: "operational",
  },
];

export const regions: { name: string; states: string[] }[] = [
  { name: "Sul", states: ["RS", "SC", "PR"] },
  { name: "Sudeste", states: ["SP", "RJ", "MG", "ES"] },
  { name: "Centro-Oeste", states: ["DF", "GO", "MT", "MS"] },
  { name: "Nordeste", states: ["BA", "PE", "CE", "MA", "PI", "RN", "PB", "SE", "AL"] },
  { name: "Norte", states: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"] },
];
