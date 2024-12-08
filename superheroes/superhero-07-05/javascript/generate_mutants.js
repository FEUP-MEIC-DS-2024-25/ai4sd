const fs = require('fs');

// Função para ler o arquivo JSON
function readMutationJson(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Função para aplicar mutantes
function applyMutants(code, mutants) {
  let mutatedCodes = [];

  mutants.forEach(mutant => {
    // Copia o código original para modificar
    let modifiedCode = code;

    if (mutant.status === "Killed") {
      const startLine = mutant.location.start.line - 1; // Linhas em 0-index
      const endLine = mutant.location.end.line; // Linhas em 0-index
      const lines = modifiedCode.split('\n');

      // Aplica a substituição
      lines.splice(startLine, endLine - startLine, mutant.replacement);
      modifiedCode = lines.join('\n');
      
      // Armazena o código modificado e informações do mutante
      mutatedCodes.push({
        id: mutant.id,
        code: modifiedCode,
        replacement: mutant.replacement,
        mutatorName: mutant.mutatorName,
        status: mutant.status
      });
    }
  });

  return mutatedCodes;
}

// Função para escrever resultados em um arquivo
function writeResultsToFile(results, outputFilePath) {
  let output = '';

  results.forEach(result => {
    output += `Modified code:\n${result.code}\n\n`;
  });

  fs.writeFileSync(outputFilePath, output, 'utf-8');
  console.log(`Resultados escritos em ${outputFilePath}`);
}

// Função principal
function main() {
  const nome_ficheiro_codigo = process.argv.slice(2);

  const mutationFilePath = 'reports/mutation/mutation.json'; // Caminho para o seu arquivo mutation.json
  const outputFilePath = 'mutations.txt'; // Caminho para o arquivo de saída
  const mutationData = readMutationJson(mutationFilePath);
  const originalCode = mutationData.files[nome_ficheiro_codigo[0]].source;
  const mutants = mutationData.files[nome_ficheiro_codigo[0]].mutants;

  // Aplica os mutantes e obtém os códigos modificados
  const mutatedResults = applyMutants(originalCode, mutants);

  // Escreve os resultados em um arquivo
  writeResultsToFile(mutatedResults, outputFilePath);
}

// Executa a função principal
main();