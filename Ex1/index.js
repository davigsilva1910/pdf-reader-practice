// Importação do módulo File System para ler arquivos
const fs = require("fs");

// Importação da biblioteca responsável por interpretar o pdf
const pdfParse = require("pdf-parse");

// Captura do arquivo pdf
// read - ler; File - arquivo; Sync - Sincrono. Leia o arquivo e espere terminar antes de continuar
// PDF é armazenado assim: 0101010010101001...
// Retorna um BUFFER
// <Buffer 25 50 44 46 2d 31 2e 33 0a 25 ff ff ff ff 0a 35 20 30 20 6f 62 6a 0a 3c 3c 0a 2f54 79 70 65 20 2f 58 4f 62 6a 65 63 74 0a 2f 53 75 62 74 79 70 65 20 ... 52163 more bytes>
const dataBuffer = fs.readFileSync("Declaracao_de_Previsao_de_Termino_do_Curso.pdf");

console.log(dataBuffer);

console.log("---------------------------------");
console.log("---------------------------------");
console.log("");