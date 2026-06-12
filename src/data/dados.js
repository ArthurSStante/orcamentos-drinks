export const parametrosPadrao = {
  pessoas: 100,
  drinksPorPessoa: 4,
  margemLucro: 2.8,
  perdaTecnica: 0.1, // 10%
  taxaBartender: 180,
  pessoasPorBartender: 50,
  frete: 80,
  custosFixos: 0,
};

export const insumos = {
  cachaca: { nome: "Cachaça", custo: 0.035 }, // Custo por ml
  vodka: { nome: "Vodka", custo: 0.045 },
  saque: { nome: "Saquê", custo: 0.0466 },
  rum: { nome: "Rum", custo: 0.05 },
  limao: { nome: "Limão", custo: 0.8 }, // Custo por unidade
  acucar: { nome: "Açúcar/Xarope", custo: 0.008 },
  morango: { nome: "Morango", custo: 0.6 },
  leiteCondensado: { nome: "Leite Condensado", custo: 0.0177 },
  sucoAbacaxi: { nome: "Abacaxi", custo: 0.012 },
  leiteCoco: { nome: "Leite de Coco", custo: 0.025 },
  espumaGengibre: { nome: "Espuma de Gengibre", custo: 0.04 },
  aguaComGas: { nome: "Água com Gás", custo: 0.0033 },
  polpaFruta: { nome: "Maracujá", custo: 0.015 },
  gelo: { nome: "Gelo (kg)", custo: 4.0 }, // Custo por kg
};

// Aqui mapeamos a receita de cada drink baseada nas colunas da sua planilha
export const cardapioDrinks = [
  {
    id: "caipirinha",
    nome: "Caipirinha",
    receita: { cachaca: 50, limao: 1, acucar: 20, gelo: 0.15 },
  },
  {
    id: "caipiroska",
    nome: "Caipiroska",
    receita: { vodka: 50, limao: 1, acucar: 20, gelo: 0.15 },
  },
  {
    id: "sensacao",
    nome: "Sensação",
    receita: {
      vodka: 50,
      morango: 4,
      leiteCondensado: 30,
      acucar: 10,
      gelo: 0.2,
    },
  },
  {
    id: "moscowMule",
    nome: "Moscow Mule",
    receita: {
      vodka: 50,
      limao: 0.5,
      acucar: 10,
      espumaGengibre: 40,
      gelo: 0.2,
    },
  },
  {
    id: "semAlcool",
    nome: "Sem Álcool",
    receita: {
      limao: 0.5,
      acucar: 15,
      aguaComGas: 120,
      polpaFruta: 80,
      gelo: 0.2,
    },
  },

  // Adicionar os outros depois
];
