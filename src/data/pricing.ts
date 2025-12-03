export interface PricingItem {
  id: string;
  category: string;
  service: string;
  unit: string;
  price: number;
  notes?: string;
}

export const pricingCategories = [
  "Combustível",
  "Estacionamento",
  "Hangaragem",
  "Equipamentos",
  "Serviços de Rampa",
  "Crew e Passageiros",
];

export const pricingData: PricingItem[] = [
  // Combustível
  {
    id: "1",
    category: "Combustível",
    service: "JET-A1",
    unit: "por litro",
    price: 6.50,
  },
  {
    id: "2",
    category: "Combustível",
    service: "AVGAS 100LL",
    unit: "por litro",
    price: 8.90,
  },
  {
    id: "3",
    category: "Combustível",
    service: "Taxa de abastecimento",
    unit: "por operação",
    price: 150.00,
    notes: "Mínimo 200 litros",
  },
  // Estacionamento Nacional
  {
    id: "4",
    category: "Estacionamento",
    service: "Nacional - Aeronave até 5.700kg",
    unit: "por hora",
    price: 45.00,
  },
  {
    id: "5",
    category: "Estacionamento",
    service: "Nacional - Aeronave 5.701kg a 15.000kg",
    unit: "por hora",
    price: 85.00,
  },
  {
    id: "6",
    category: "Estacionamento",
    service: "Nacional - Aeronave acima de 15.000kg",
    unit: "por hora",
    price: 150.00,
  },
  {
    id: "7",
    category: "Estacionamento",
    service: "Nacional - Pernoite (até 5.700kg)",
    unit: "por noite",
    price: 180.00,
  },
  {
    id: "8",
    category: "Estacionamento",
    service: "Nacional - Pernoite (5.701kg a 15.000kg)",
    unit: "por noite",
    price: 350.00,
  },
  {
    id: "9",
    category: "Estacionamento",
    service: "Nacional - Pernoite (acima de 15.000kg)",
    unit: "por noite",
    price: 600.00,
  },
  // Estacionamento Internacional
  {
    id: "9a",
    category: "Estacionamento",
    service: "Internacional - Aeronave até 5.700kg",
    unit: "por hora",
    price: 65.00,
  },
  {
    id: "9b",
    category: "Estacionamento",
    service: "Internacional - Aeronave 5.701kg a 15.000kg",
    unit: "por hora",
    price: 120.00,
  },
  {
    id: "9c",
    category: "Estacionamento",
    service: "Internacional - Aeronave acima de 15.000kg",
    unit: "por hora",
    price: 220.00,
  },
  {
    id: "9d",
    category: "Estacionamento",
    service: "Internacional - Pernoite (até 5.700kg)",
    unit: "por noite",
    price: 280.00,
  },
  {
    id: "9e",
    category: "Estacionamento",
    service: "Internacional - Pernoite (5.701kg a 15.000kg)",
    unit: "por noite",
    price: 520.00,
  },
  {
    id: "9f",
    category: "Estacionamento",
    service: "Internacional - Pernoite (acima de 15.000kg)",
    unit: "por noite",
    price: 900.00,
  },
  // Hangaragem
  {
    id: "10",
    category: "Hangaragem",
    service: "Aeronave até 5.700kg",
    unit: "por dia",
    price: 450.00,
  },
  {
    id: "11",
    category: "Hangaragem",
    service: "Aeronave 5.701kg a 15.000kg",
    unit: "por dia",
    price: 850.00,
  },
  {
    id: "12",
    category: "Hangaragem",
    service: "Aeronave acima de 15.000kg",
    unit: "por dia",
    price: 1500.00,
  },
  {
    id: "13",
    category: "Hangaragem",
    service: "Hangaragem mensal (até 5.700kg)",
    unit: "por mês",
    price: 8500.00,
  },
  {
    id: "14",
    category: "Hangaragem",
    service: "Hangaragem mensal (5.701kg a 15.000kg)",
    unit: "por mês",
    price: 15000.00,
  },
  // Equipamentos
  {
    id: "15",
    category: "Equipamentos",
    service: "GPU 28V DC",
    unit: "por hora",
    price: 120.00,
  },
  {
    id: "16",
    category: "Equipamentos",
    service: "GPU 115V AC",
    unit: "por hora",
    price: 150.00,
  },
  {
    id: "17",
    category: "Equipamentos",
    service: "Ar condicionado de solo",
    unit: "por hora",
    price: 200.00,
  },
  {
    id: "18",
    category: "Equipamentos",
    service: "Escada de embarque",
    unit: "por uso",
    price: 80.00,
  },
  {
    id: "19",
    category: "Equipamentos",
    service: "Rebocador",
    unit: "por operação",
    price: 250.00,
  },
  // Serviços de Rampa
  {
    id: "20",
    category: "Serviços de Rampa",
    service: "Handling completo",
    unit: "por operação",
    price: 450.00,
    notes: "Inclui recepção, despacho e coordenação",
  },
  {
    id: "21",
    category: "Serviços de Rampa",
    service: "Limpeza interna básica",
    unit: "por serviço",
    price: 180.00,
  },
  {
    id: "22",
    category: "Serviços de Rampa",
    service: "Limpeza interna completa",
    unit: "por serviço",
    price: 350.00,
  },
  {
    id: "23",
    category: "Serviços de Rampa",
    service: "Lavagem externa",
    unit: "por serviço",
    price: 800.00,
    notes: "Aeronaves até 15.000kg",
  },
  {
    id: "24",
    category: "Serviços de Rampa",
    service: "Deicing",
    unit: "por aplicação",
    price: 2500.00,
    notes: "Disponível apenas em POA",
  },
  // Crew e Passageiros
  {
    id: "25",
    category: "Crew e Passageiros",
    service: "Sala VIP (por pessoa)",
    unit: "por hora",
    price: 120.00,
  },
  {
    id: "26",
    category: "Crew e Passageiros",
    service: "Crew Lounge",
    unit: "por tripulante/dia",
    price: 80.00,
  },
  {
    id: "27",
    category: "Crew e Passageiros",
    service: "Catering - Snack box",
    unit: "por pessoa",
    price: 85.00,
  },
  {
    id: "28",
    category: "Crew e Passageiros",
    service: "Catering - Refeição completa",
    unit: "por pessoa",
    price: 180.00,
  },
  {
    id: "29",
    category: "Crew e Passageiros",
    service: "Transporte terrestre (sedan)",
    unit: "por hora",
    price: 150.00,
  },
  {
    id: "30",
    category: "Crew e Passageiros",
    service: "Transporte terrestre (van)",
    unit: "por hora",
    price: 250.00,
  },
];
