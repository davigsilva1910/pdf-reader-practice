// Separa vários em vários blocos diferentes: [[{}, {}], [{}, {}], [{}, {}]]
// O 5 separa todos em um único bloco: [{}, {}, {}]

const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

class ConteudoBloco {
    constructor(titulo, paginaInicial, paginaFinal, conteudo) {
        this.titulo = titulo,
        this.paginaInicial = paginaInicial,
        this.paginaFinal = paginaFinal,
        this.conteudo = conteudo
    }
}

function agruparLinhas(itens) {
    const linhas = {}

    for (const item of itens) {
        const y = Math.round(item.transform[5]) // Math.round arredonda

        // Se a linha atual não existir, adiciona dentro do objeto linhas
        if (!linhas[y]) {
            linhas[y] = [];
        }

        linhas[y].push(item.str); // Adiciona o texto para dentro da linha
    }

    return linhas;
}

function organizarLinhas(linhas) {
    let linhasOrganizadas = [];// retorno de um objeto
    for (const [y, palavras] of Object.entries(linhas).sort((a, b) => b[0] - a[0])) {
        const linha = palavras.filter(palavra => palavra.trim() !== "").join(" ");
        linhasOrganizadas.push(linha)
    }
    return linhasOrganizadas;
}


async function extrairPagina(documento, numeroPagina) {
    const pagina = await documento.getPage(numeroPagina);
    const texto = await pagina.getTextContent();

    const itens = texto.items

    const linhas = agruparLinhas(itens);

    const linhasOrganizadas = organizarLinhas(linhas);

    const linhasComPagina = linhasOrganizadas.map(linha => {
        return {
            texto: linha,
            pagina: numeroPagina
        }
    })

    return linhasComPagina
}

// Função regex para pegar se a linha contém somente numeros, o que provavelmente representa o número da página
function ehNumeroDePagina(linha) {
    return /^\d+$/.test(linha.trim());
}

function ehTituloNumerado(linha) {
    return /^\d+\.\s+/.test(linha.trim());
}

function agruparBlocos(linhas) {
    const blocos = [];
    let blocoAtual = [];

    for (const linha of linhas) {

        if (ehNumeroDePagina(linha.texto)) {
            continue;
        }

        if (ehTituloNumerado(linha.texto)) {

            if (blocoAtual.length > 0) {
                blocos.push(blocoAtual);
            }

            blocoAtual = [linha];

        } else {
            blocoAtual.push(linha);
        }
    }

    // Depois que o loop termina, ainda pode existir um bloco aberto
    if (blocoAtual.length > 0) {
        blocos.push(blocoAtual);
    }

    return blocos;
}

function estruturarBlocos(blocos) {

}

async function main() {
    const fs = require("fs")
    const nomeDoArquivo = "Correção do Ambiente SAP CAP.pdf"
    const buffer = fs.readFileSync(nomeDoArquivo)

    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer) // array de bytes
    })

    const pdfDocument = await loadingTask.promise;

    // Para pegar numero total de páginas
    const totalPaginas = pdfDocument.numPages

    const todasAsLinhas = []
    for(let i = 1; i <= totalPaginas; i++) {
        const linhaExtraida = await extrairPagina(pdfDocument, i)
        // Os ... servem para adicionar cada elemento individualmente
        // Sem eles [{jlfjdlk}, {jdlkfjlsd}]
        // Com eles {fkdlsj}, {fjkdlsjfsl}
        todasAsLinhas.push(...linhaExtraida) 
    }

    const blocos = agruparBlocos(todasAsLinhas)

    const blocoEstruturado = [];

    for(let i = 0; i < blocos.length; i++) {
        let tamanhoBloco = blocos[i].length
        const tituloBloco = blocos[i][0].texto;
        const primeiraPaginaBloco = blocos[i][0].pagina
        const ultimaPaginaBloco = blocos[i][tamanhoBloco-1].pagina
        let conteudoCompletoBloco = "";
        for(let j = 0; j < tamanhoBloco; j++) {
            conteudoCompletoBloco += blocos[i][j].texto + " ";
        }

        const blocoFeito = new ConteudoBloco(
            tituloBloco,
            primeiraPaginaBloco,
            ultimaPaginaBloco,
            conteudoCompletoBloco
        )

        blocoEstruturado.push(blocoFeito)
    }

    for(let i = 0; i < blocos.length; i++) {

    }
    
    console.log(blocoEstruturado)

}

main()