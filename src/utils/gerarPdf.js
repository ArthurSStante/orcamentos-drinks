import { PDFDocument, rgb } from 'pdf-lib';

// Agora o Robô recebe a "caixa" com o resumo e os dados do formulário
export const gerarOrcamentoPDF = async ({ resumo, formDados }) => {
  try {
    const urlDoTemplate = '/template-orcamento.pdf'; 
    const templateCarregado = await fetch(urlDoTemplate).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(templateCarregado);
    const pagina = pdfDoc.getPages()[0];

    // 1. FORMATANDO OS TEXTOS ANTES DE IMPRIMIR
    // Colocando o formato de dinheiro bonito
    const valorFinalFormatado = `R$ ${resumo.vendaSugerida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Pegando nosso Cesto Mágico e costurando as palavras com uma vírgula e espaço!
    const textoFrutas = resumo.listaDeFrutas.join(', ');

    // 2. A BATALHA NAVAL COMEÇA AQUI!
    // Você vai precisar ajustar o 'x' e o 'y' até a palavra cair certinha na linha do seu PDF
    
    // Carimbando a Quantidade de Pessoas
    pagina.drawText(`${formDados.pessoas} convidados`, { 
      x: 100, // Passos para a direita
      y: 700, // Passos para cima (lembre que 842 é lá no topo)
      size: 12, 
      color: rgb(0, 0, 0) // RGB(0,0,0) é Preto puro
    });

    // Carimbando o Valor Final
    pagina.drawText(valorFinalFormatado, { 
      x: 100, 
      y: 650, 
      size: 16, 
      color: rgb(0, 0, 0) 
    });

    // Carimbando as Frutas
    if (textoFrutas) {
      pagina.drawText(`Frutas: ${textoFrutas}`, { 
        x: 100, 
        y: 600, 
        size: 12, 
        color: rgb(0, 0, 0) 
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Orcamento_Drinks_Personalizado.pdf';
    link.click();

  } catch (erro) {
    console.error("Ops! O Robô tropeçou ao gerar o PDF:", erro);
  }
};