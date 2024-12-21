/**
 * Parse C++ code and extract function information
 * @param {string} code - The C++ source code to parse
 * @returns {Map<number, Object>} Map of start lines to function details
 */
export function parseCppCode(code: string) {
    // Tokenization regex patterns
    const patterns = {
      whitespace: /\s+/,
      functionPattern: /(\w+(?:\s+\w+)*)\s+(\w+)\s*\(([^)]*)\)\s*{/g
    };
  
    // Remove comments
    let cleanedCode = code;
  
    // Function to get line number
    function getLineNumber(fullText:string, index: number | undefined) {
      return fullText.substring(0, index).split('\n').length;
    }
  
    // Parse functions
    const functionMap = new Map();
    const lines = code.split('\n');
  
    let match;
    while ((match = patterns.functionPattern.exec(cleanedCode)) !== null) {
      const fullMatch = match[0];
      const returnType = match[1].trim();
      const functionName = match[2];
      const parameters = match[3].split(',').map(p => p.trim());
  
      // Find the start line
      const startIndex = code.indexOf(fullMatch);
      const startLine = getLineNumber(code, startIndex);
  
      // Find the function body (including nested braces)
      let braceCount = 1;
      let bodyEndIndex = startIndex + fullMatch.length;
      
      while (braceCount > 0 && bodyEndIndex < code.length) {
        if (code[bodyEndIndex] === '{') {braceCount++;}
        if (code[bodyEndIndex] === '}') {braceCount--;}
        bodyEndIndex++;
      }
  
      const body = returnType+" "+functionName+"("+parameters.join(",")+")"+"{\n"+code.substring(startIndex + fullMatch.length, bodyEndIndex).trim();
  
      functionMap.set(startLine, {
        name: functionName,
        returnType: returnType,
        parameters: parameters,
        body: body
      });
    }
  
    return functionMap;
  }