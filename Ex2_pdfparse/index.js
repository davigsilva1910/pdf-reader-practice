const fs = require("fs")
const pdfParse = require("pdf-parse")

async function main() {
    const dataBuffer = fs.readFileSync("Declaracao_de_Previsao_de_Termino_do_Curso.pdf")

    const data = await pdfParse(dataBuffer)

    // Retorna informações sobre o pdf 
    console.log(data)
    console.log("------------------------")
    console.log("------------------------")
    console.log("")

    console.log(data.numpages)
    console.log(data.info.Creator)// Pega o criador

    console.log("------------------------")
    console.log("------------------------")
    console.log("")

    if (data.text.includes("Paulista")) {
        console.log("Achei Paulista")
    }

    const posicao = data.text.indexOf("Paulista");
    console.log(posicao)

    console.log("------------------------")
    console.log("------------------------")
    console.log("")

    const resposta = {
        pagina: data.numpages,
        creator: data.info.Creator
    }

    console.log(resposta)

    console.log("------------------------")
    console.log("------------------------")
    console.log("")

    // RGM → procura a palavra RGM
    // \s * → zero ou mais espaços
    // n\.º → o texto n.º(.precisa ser escapado)
    // \s * → espaços opcionais
    //     (\d +) → captura um ou mais dígitos(esse é o RGM)
    const regexRGM = /RGM\s*n\.º\s*(\d+)/;
    const match = data.text.match(regexRGM);

    if (match) {
        console.log("RGM:", match[1]);
    } else {
        console.log("RGM não encontrado");
    }

}

main();