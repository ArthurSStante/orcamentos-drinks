// utils/calculos.js
import { insumos, parametrosPadrao } from '../data/dados';

export const calcularCustoDrink = (receita) => {
  let custoBase = 0;

  // Percorre cada ingrediente da receita do drink
  for (const [ingrediente, quantidade] of Object.entries(receita)) {
    if (insumos[ingrediente]) {
      // Multiplica a quantidade (ex: 50ml) pelo custo unitário (ex: 0.035)
      custoBase += quantidade * insumos[ingrediente].custo;
    }
  }

  // Aplica a regra da planilha: Custo + Perda Técnica (10%)
  const custoComPerda = custoBase * (1 + parametrosPadrao.perdaTecnica);
  
  return custoComPerda;
};