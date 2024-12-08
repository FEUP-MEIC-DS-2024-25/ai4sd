// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const fs = require('fs');

// Função para ler o arquivo JSON
function readMutationJson(filePath) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const data = fs.readFileSync(filePath, stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'utf-8'));
    return JSON.parse(data);
  }
}

// Função para aplicar mutantes
function applyMutants(code, mutants) {
  if (stryMutAct_9fa48("2")) {
    {}
  } else {
    stryCov_9fa48("2");
    let mutatedCodes = stryMutAct_9fa48("3") ? ["Stryker was here"] : (stryCov_9fa48("3"), []);
    mutants.forEach(mutant => {
      if (stryMutAct_9fa48("4")) {
        {}
      } else {
        stryCov_9fa48("4");
        // Copia o código original para modificar
        let modifiedCode = code;
        if (stryMutAct_9fa48("7") ? mutant.status !== "Killed" : stryMutAct_9fa48("6") ? false : stryMutAct_9fa48("5") ? true : (stryCov_9fa48("5", "6", "7"), mutant.status === (stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), "Killed")))) {
          if (stryMutAct_9fa48("9")) {
            {}
          } else {
            stryCov_9fa48("9");
            const startLine = stryMutAct_9fa48("10") ? mutant.location.start.line + 1 : (stryCov_9fa48("10"), mutant.location.start.line - 1); // Linhas em 0-index
            const endLine = mutant.location.end.line; // Linhas em 0-index
            const lines = modifiedCode.split(stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), '\n'));

            // Aplica a substituição
            lines.splice(startLine, stryMutAct_9fa48("12") ? endLine + startLine : (stryCov_9fa48("12"), endLine - startLine), mutant.replacement);
            modifiedCode = lines.join(stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), '\n'));

            // Armazena o código modificado e informações do mutante
            mutatedCodes.push(stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
              id: mutant.id,
              code: modifiedCode,
              replacement: mutant.replacement,
              mutatorName: mutant.mutatorName,
              status: mutant.status
            }));
          }
        }
      }
    });
    return mutatedCodes;
  }
}

// Função para escrever resultados em um arquivo
function writeResultsToFile(results, outputFilePath) {
  if (stryMutAct_9fa48("15")) {
    {}
  } else {
    stryCov_9fa48("15");
    let output = stryMutAct_9fa48("16") ? "Stryker was here!" : (stryCov_9fa48("16"), '');
    results.forEach(result => {
      if (stryMutAct_9fa48("17")) {
        {}
      } else {
        stryCov_9fa48("17");
        output += stryMutAct_9fa48("18") ? `` : (stryCov_9fa48("18"), `Modified code:\n${result.code}\n\n`);
      }
    });
    fs.writeFileSync(outputFilePath, output, stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'utf-8'));
    console.log(stryMutAct_9fa48("20") ? `` : (stryCov_9fa48("20"), `Resultados escritos em ${outputFilePath}`));
  }
}

// Função principal
function main() {
  if (stryMutAct_9fa48("21")) {
    {}
  } else {
    stryCov_9fa48("21");
    const mutationFilePath = stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'reports/mutation/mutation.json'); // Caminho para o seu arquivo mutation.json
    const outputFilePath = stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), 'mutated_results.txt'); // Caminho para o arquivo de saída
    const mutationData = readMutationJson(mutationFilePath);
    const originalCode = mutationData.files[stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), 'sum.js')].source;
    const mutants = mutationData.files[stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), 'sum.js')].mutants;

    // Aplica os mutantes e obtém os códigos modificados
    const mutatedResults = applyMutants(originalCode, mutants);

    // Escreve os resultados em um arquivo
    writeResultsToFile(mutatedResults, outputFilePath);
  }
}

// Executa a função principal
main();