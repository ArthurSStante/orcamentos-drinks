import React, { useState } from "react";
import {
  Form,
  InputNumber,
  Card,
  Col,
  Row,
  Typography,
  Divider,
  Checkbox,
  Select,
  Button,
  Input,
} from "antd";
// Importamos os parâmetros, mas agora vamos criar uma versão "vazia"
import { parametrosPadrao, cardapioDrinks, insumos } from "../data/dados";
import { calcularCustoDrink } from "../utils/calculos";
import { gerarOrcamentoPDF } from "../utils/gerarPdf";

const { Title, Text } = Typography;

const GeradorOrcamento = () => {
  const [form] = Form.useForm();

  const regiaoSelecionada = Form.useWatch("regiaoFrete", form);

  // A lousa de resultados começa zerada
  const [resumo, setResumo] = useState({
    custoTotal: 0,
    vendaSugerida: 0,
    lucro: 0,
  });

  // 1. Criamos um "Gabarito Vazio" para o formulário começar limpo
  const parametrosZerados = {
    nomeCliente: null,
    pessoas: null,
    duracaoEvento: null,
    regiaoFrete: null,
    drinksSelecionados: [],
    dataEvento: null,
    tipoCopo: null,
    horarioEvento: null,
    enderecoEvento: null,
  };

  const idDrinkObrigatorio = "semAlcool";

  const calcularTudo = (valoresDaTela) => {
    // Usamos o '|| 0' para dizer: "Se o campo estiver vazio, finja que é zero"
    // Isso evita o erro de NaN (Não é um Número)
    const pessoas = valoresDaTela.pessoas || 0;
    const drinksPorPessoa = (valoresDaTela.duracaoEvento || 0) * 0.8;
    const frete = valoresDaTela.regiaoFrete || 0;

    // Pegamos as taxas fixas do nosso arquivo de dados
    const margemLucro = parametrosPadrao.margemLucro;
    const taxaBartender = parametrosPadrao.taxaBartender;
    const pessoasPorBartender = parametrosPadrao.pessoasPorBartender;

    // Se não houver pessoas ou drinks, não precisa calcular nada, o resultado é 0
    if (pessoas === 0 || drinksPorPessoa === 0) {
      setResumo({ custoTotal: 0, vendaSugerida: 0, lucro: 0 });
      return;
    }

    // 2. Cálculos de Base
    const totalDrinks = pessoas * drinksPorPessoa;
    const qtdBartenders = Math.ceil(pessoas / pessoasPorBartender);
    const custoEquipe = qtdBartenders * taxaBartender;

    // 3. Custo dos Drinks
    let custoTodosDrinks = 0;

    // 1º Passo: Pegamos a Lista VIP (os drinks que o cliente marcou na tela)
    // Se ele ainda não marcou nenhum, consideramos uma lista vazia []
    let drinksEscolhidos = valoresDaTela.drinksSelecionados || [];

    if (!drinksEscolhidos.includes(idDrinkObrigatorio)) {
      drinksEscolhidos = [...drinksEscolhidos, idDrinkObrigatorio];
    }

    const quantidadeDeTiposEscolhidos = drinksEscolhidos.length;

    // Cestos
    const cestoDeFrutas = new Set();
    const cestoDeMarcas = new Set();

    const ingredientesQueSaoFrutas = [
      "limao",
      "morango",
      "sucoAbacaxi",
      "polpaFruta",
    ];

    const mapaDeMarcas = {
      vodka: "Vodka - Smirnoff",
      cachaca: "Cachaça - Velho Barreiro",
      rum: "Rum - Montilla",
      gin: "Gin - Rock's",
    };

    // 2º Passo: Só fazemos a conta se ele escolheu pelo menos 1 drink
    if (quantidadeDeTiposEscolhidos > 0) {
      // O Robô vai olhar todos os drinks do cardápio...
      cardapioDrinks.forEach((drink) => {
        // 3º Passo: O nosso Segurança em ação!
        // "O ID deste drink que o Robô está segurando agora, está na lista VIP?"
        if (drinksEscolhidos.includes(drink.id)) {
          // Se SIM, ele entra aqui e calcula!
          const custoUnitario = calcularCustoDrink(drink.receita);

          // Dividimos o total de copos pela quantidade de opções que o cliente marcou
          const qtdeDesteDrink = totalDrinks / quantidadeDeTiposEscolhidos;

          custoTodosDrinks += custoUnitario * qtdeDesteDrink;

          Object.keys(drink.receita).forEach((ingredientes) => {
            if (ingredientesQueSaoFrutas.includes(ingredientes)) {
              cestoDeFrutas.add(insumos[ingredientes].nome);
            }
            if (mapaDeMarcas[ingredientes]) {
              cestoDeMarcas.add(mapaDeMarcas[ingredientes]);
            }
          });
        }
      });
    }

    // 4. Totais Finais
    const custoEvento = custoTodosDrinks + custoEquipe + frete;
    const vendaTotalSugerida =
      custoTodosDrinks * margemLucro + custoEquipe + frete;

    const qtdCopeiros = Math.max(1, Math.floor(qtdBartenders / 2));

    setResumo({
      custoTotal: custoEvento,
      vendaSugerida: vendaTotalSugerida,
      lucro: vendaTotalSugerida - custoEvento,
      listaDeFrutas: Array.from(cestoDeFrutas),
      listaDeMarcas: Array.from(cestoDeMarcas),
      qtdBartenders: qtdBartenders,
      qtdCopeiros: qtdCopeiros,
    });
  };

  const opcoesCheckbox = cardapioDrinks
    .filter((drink) => drink.id !== idDrinkObrigatorio)
    .map((drink) => {
      return {
        label: drink.nome,
        value: drink.id,
      };
    });

  const opcoesRegiao = [
    { label: "Ainda não definido", value: 0 },
    { label: "Dentro da Cidade", value: 80 },
    { label: "Fora da Cidade", value: 120 },
    { label: "Cidade Vizinha", value: 200 },
  ];

  const opcoesCopo = [
    { label: "Copo descartável (330ml)", value: "descartavel" },
    { label: "Copo Long Drink (Acrílico)", value: "longdrink" },
    { label: "Vidro (Taças e Copos)", value: "vidro" },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <Title level={2}>📊 Orçamento de Drinks</Title>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="Dados do Evento" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              // MUDANÇA AQUI: Agora começa com o Gabarito Vazio
              initialValues={parametrosZerados}
              onValuesChange={() => calcularTudo(form.getFieldsValue(true))}
            >
              <Form.Item
                label="Nome do Cliente ou Evento"
                name="nomeCliente"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o nome do cliente ou evento!",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: Casamento João e Maria"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Quantidade de pessoas do evento?"
                    name="pessoas"
                    rules={[
                      {
                        required: true,
                        message: "Insira a quantidade de pessoas!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Ex: 100"
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Duração do Evento? (Horas)"
                    name="duracaoEvento"
                    rules={[{ required: true, message: "Insira a duração!" }]}
                  >
                    <InputNumber
                      placeholder="Ex: 5 horas"
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Data do Evento"
                    name="dataEvento"
                    rules={[{ required: true, message: "Selecione a data!" }]}
                  >
                    <Input type="date" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Horário de Início"
                    name="horarioEvento"
                    rules={[
                      { required: true, message: "Selecione o horário!" },
                    ]}
                  >
                    <Input type="time" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Local do Evento?"
                    name="regiaoFrete"
                    rules={[
                      {
                        required: true,
                        message:
                          "Por favor, selecione onde será o local do evento",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Selecione onde será a festa..."
                      options={opcoesRegiao}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Estrutura de Copos"
                    nam="tipoCopo"
                    rules={[
                      { required: true, message: "Selecione o tipo de copo!" },
                    ]}
                  >
                    <Select
                      placeholder="Qual copo será usado?"
                      options={opcoesCopo}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {regiaoSelecionada > 0 && (
                <Form.Item
                  label="Endereço Completo do Local"
                  name="enderecoEvento"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, digite o endereço do evento!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ex: Chácara Recanto Verde, Rua X, Nº 120 - Bairro"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Quais drinks farão parte do cardápio?"
                name="drinksSelecionados"
                rules={[
                  {
                    required: true,
                    message: "Selecione pelo menos um drink para o cardápio!",
                  },
                ]}
              >
                <Checkbox.Group options={opcoesCheckbox} />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Resumo do Orçamento"
            headStyle={{ background: "#1890ff", color: "#fff" }}
          >
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">VALOR DO ORÇAMENTO</Text>
              <Title level={1} style={{ color: "#52c41a", marginTop: 0 }}>
                R${" "}
                {resumo.vendaSugerida.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Title>
            </div>
            <Divider />
            <Button
              type="primary"
              size="large"
              block
              // Quando clicado, ele entrega o "resumo" e as respostas do formulário para o Robô do PDF
              disabled={resumo.vendaSugerida === 0}
              onClick={() =>
                form
                  .validateFields()
                  .then((valoresValidados) => {
                    gerarOrcamentoPDF({ resumo, formDados: valoresValidados });
                  })
                  .catch((erro) => {
                    console.log("Campos obrigatórios faltando!");
                  })
              }
              // O botão fica bloqueado se a venda sugerida for zero (evita gerar PDF vazio)
            >
              📄 Baixar Orçamento em PDF
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeradorOrcamento;
