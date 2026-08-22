const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

async function main() {
    const buffer = fs.readFileSync("Correção do Ambiente SAP CAP.pdf")

    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer) // array de bytes
    })

    const pdfDocument = await loadingTask.promise;

    // console.log(pdfDocument)

    // console.log(Object.keys(pdfDocument))

    // console.log(pdfDocument.numPages)

    const pagina = await pdfDocument.getPage(4)

    const texto = await pagina.getTextContent()

    // Retorno dos itens do pdf. Cada item, seja um '' ou palavra, cada um recebe uma posição dentro de um objeto
    const itens = texto.items

    // console.log(itens)

    // [ 18, 0, 0, 18, 78, 699.515991 ]
    // [a, b, c, d, e, f]
    // e - valor X e f - valor Y
    // Outros valores são escala, rotação, inclinação
    // console.log(item.transform)

    // for (const item of texto.items) {
    // console.log({
    //     texto: item.str,
    //     x: item.transform[4],
    //     y: item.transform[5]
    // });

    // agrupar linhas
    // const linhas = {};
    // linhas[239] = [];
    // linhas[239].push("npm");
    // linhas[239].push("uninstall");
    // linhas[239].push("-g");

    // console.log(linhas[239].join(" "))
    // finalizando agrupar linhas

    // Objeto que vai armazenar todas as linhas
    // '169': ['', 'which', ' ', 'cds'],
    // '206': ['', 'Depois foi verificado de onde vinha o comando:'],
    // '239': ['', 'npm', ' ', 'uninstall', ' ', '-g', ' ', '@sap/cds-dk'],
    // '277': ['', 'Primeiro foi removida a instalação global:'],
    // '306': ['', '6. Remoção das instalações conflitantes'],
    const linhas = {}

    for (const item of itens) {
        const y = Math.round(item.transform[5]) // Math.round arredonda

        // Se a linha atual não existir, adiciona dentro do objeto linhas
        if (!linhas[y]) {
            linhas[y] = [];
        }

        linhas[y].push(item.str); // Adiciona o texto para dentro da linha
    }



    // console.log(linhas);

    // for (const y in linhas) {
    //     console.log("Linhas: ", y)
    //     console.log("Conteúdo: ", linhas[y])
    // }

    for (const [y, palavras] of Object.entries(linhas).sort((a, b) => b[0] - a[0])) {
        const linhaTexto = palavras.filter(palavra => palavra.trim() !== "").join(" ")
        console.log(linhaTexto);
    }
}

main()