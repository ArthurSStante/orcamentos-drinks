import React from 'react';
import { Table } from 'antd'; // Importando a tabela mágica do Ant Design
import { cardapioDrinks } from '../data/dados'; // Nosso livro de receitas
import { calcularCustoDrink } from '../utils/calculos'; // Nosso robô calculadora

const TabelaDrinks = () => {
  
  // 1. Desenhando as Colunas da Tabela
  // Aqui dizemos o que vai estar escrito no topo de cada coluna
  const colunas = [
    {
      title: 'Nome do Drink',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Custo Unitário (R$)',
      dataIndex: 'custo',
      key: 'custo',
      // O 'render' formata o número de "3.641" para "R$ 3,64"
      render: (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`,
    },
  ];

  // 2. Preparando os Dados (As Linhas da Tabela)
  // O 'map' pega nosso cardápio e cria uma linha para cada drink
  const linhasDaTabela = cardapioDrinks.map((drink) => {
    return {
      key: drink.id, // O Ant Design pede uma chave única para cada linha
      nome: drink.nome,
      // Olha o nosso robô trabalhando aqui! Ele calcula o custo na hora:
      custo: calcularCustoDrink(drink.receita), 
    };
  });

  // 3. Mostrando tudo na tela
  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h2>🍸 Custos dos Drinks</h2>
      <Table 
        dataSource={linhasDaTabela} 
        columns={colunas} 
        pagination={false} // Tira a paginação para mostrar tudo de uma vez
        bordered 
      />
    </div>
  );
};

export default TabelaDrinks;