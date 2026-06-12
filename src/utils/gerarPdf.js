import { PDFDocument, rgb } from "pdf-lib";

// Agora o Robô recebe a "caixa" com o resumo e os dados do formulário
export const gerarOrcamentoPDF = async ({ resumo, formDados }) => {
  try {
    const urlDoTemplate = "/template-orcamento.pdf";
    const templateCarregado = await fetch(urlDoTemplate).then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(templateCarregado);
    const pagina = pdfDoc.getPages()[0];

    // 1. FORMATANDO OS TEXTOS ANTES DE IMPRIMIR
    // Colocando o formato de dinheiro bonito
    const valorFinalFormatado = `R$ ${resumo.vendaSugerida.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Pegando nosso Cesto Mágico e costurando as palavras com uma vírgula e espaço!
    const textoFrutas = resumo.listaDeFrutas.join(", ");
    const textoMarcas = resumo.listaDeMarcas.join(", ");

    let textoItensInclusos = "Incluso: Guardanapos e canudos";

    // ATENÇÃO: Verifique se o ID "moscowMule" está escrito exatamente igual ao que está no seu arquivo dados.js
    if (formDados.drinksSelecionados.includes("moscowMule")) {
      textoItensInclusos += ", canecas para Moscow Mule";
    }

    // Tipo do copo selecionado
    if (formDados.tipoCopo === "descartavel") {
      textoItensInclusos += ", copos descartáveis 330ml";
    } else if (formDados.tipoCopo === "longdrink") {
      textoItensInclusos += ", copos long drink";
    } else if (formDados.tipoCopo === "vidro") {
      textoItensInclusos += ", taças e copos de vidro";
    }

    // 2. A BATALHA NAVAL COMEÇA AQUI!
    // Lembrete: Eixo X (0 é na esquerda, aumenta para a direita)
    // Lembrete: Eixo Y (0 é no rodapé da folha, aumenta para o topo. O topo tem aprox 842)

    const corPreta = rgb(0, 0, 0); // Cor da tinta
    const tamanhoNormal = 12; // Tamanho da fonte

    // DADOS DO EVENTO (Ajuste o Y de 20 em 20 para ir descendo as linhas)
    pagina.drawText(`Cliente: ${formDados.nomeCliente || "Não informado"}`, {
      x: 100,
      y: 750,
      size: tamanhoNormal,
      color: corPreta,
    });

    pagina.drawText(
      `Data: ${formDados.dataEvento || ""} - Horário: ${formDados.horarioEvento || ""}`,
      { x: 100, y: 730, size: tamanhoNormal, color: corPreta },
    );

    pagina.drawText(`Quantidade de convidados: ${formDados.pessoas || 0}`, {
      x: 100,
      y: 710,
      size: tamanhoNormal,
      color: corPreta,
    });

    // FRUTAS E MARCAS
    if (textoFrutas) {
      pagina.drawText(`Frutas: ${textoFrutas}`, {
        x: 100,
        y: 670,
        size: tamanhoNormal,
        color: corPreta,
      });
    }
    if (textoMarcas) {
      pagina.drawText(`Marcas de bebidas: ${textoMarcas}`, {
        x: 100,
        y: 650,
        size: tamanhoNormal,
        color: corPreta,
      });
    }

    // EQUIPE E ESTRUTURA
    pagina.drawText(`${resumo.qtdBartenders} - bartenders trabalhando`, {
      x: 100,
      y: 610,
      size: tamanhoNormal,
      color: corPreta,
    });
    pagina.drawText(
      `${resumo.qtdCopeiros} - copeiros (Recolha e higienização)`,
      { x: 100, y: 590, size: tamanhoNormal, color: corPreta },
    );
    pagina.drawText(`( ${textoItensInclusos} )`, {
      x: 100,
      y: 570,
      size: 10,
      color: corPreta,
    }); // Fonte menor aqui

    // VALOR TOTAL (Usando uma fonte maior: 16)
    pagina.drawText(`Valor total do orçamento: ${valorFinalFormatado}`, {
      x: 100,
      y: 530,
      size: 16,
      color: corPreta,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Orcamento_Drinks_Personalizado.pdf";
    link.click();
  } catch (erro) {
    console.error("Ops! O Robô tropeçou ao gerar o PDF:", erro);
  }
};
