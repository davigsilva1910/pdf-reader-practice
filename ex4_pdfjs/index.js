const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

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
    let linhaTexto = "";
    for (const [y, palavras] of Object.entries(linhas).sort((a, b) => b[0] - a[0])) {
        linhaTexto += palavras.filter(palavra => palavra.trim() !== "").join(" ") + "\n"
    }
    return linhaTexto;
}

async function extrairPagina(documento, numeroPagina) {
    const pagina = await documento.getPage(numeroPagina);
    const texto = await pagina.getTextContent();

    const itens = texto.items
    
    const linhas = agruparLinhas(itens);
    
    const result = organizarLinhas(linhas);

    return result;
}

async function main() {
    const buffer = fs.readFileSync("Correção do Ambiente SAP CAP.pdf")

    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer) // array de bytes
    })

    const pdfDocument = await loadingTask.promise;
    
    // Para pegar numero total de páginas
    const totalPaginas = pdfDocument.numPages
    let conteudo = "";
    for(let i = 1; i <= totalPaginas; i++) {
        const conteudoExtraido = await extrairPagina(pdfDocument,i);
        conteudo += conteudoExtraido + "\n";
    }
    
    console.log(conteudo);


}

main()