import * as ts from 'typescript';


export function extractFunctionsFlutter(sourceCode: string): Map<number, Object> {
  // Create a source file from the input code
  const sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);

  // Array to store function information
  const functions = new Map();

  // Recursive function to traverse the AST
  function visit(node: ts.Node) {
    // Check for function declarations, arrow functions, and method declarations
    if (ts.isFunctionDeclaration(node) || 
        ts.isMethodDeclaration(node) || 
        ts.isArrowFunction(node) || 
        ts.isFunctionExpression(node)) {
      
      // Get the source text of the node
      const nodeText = node.getText();
      
      // Get the line number
      const sourceFileLines = sourceCode.split('\n');
      const lineNumber = sourceCode.substring(0, node.getStart()).split('\n').length;
      
      // Determine function type and extract declaration
      let declaration = '';
      let add= false;
      if (ts.isFunctionDeclaration(node) && node.name) {
        declaration = `function ${node.name.getText()}`;
        //add = true;
      } else if (ts.isMethodDeclaration(node) && node.name) {
        declaration = `method ${node.name.getText()}`;
        add = true;
      } else if (ts.isArrowFunction(node)) {
        declaration = 'arrow function';
      } else if (ts.isFunctionExpression(node)) {
        declaration = 'function expression';
      }
      if(add===true){
        functions.set(lineNumber,{
          body: nodeText
        });
    }
    }

    // Continue traversing the AST
    ts.forEachChild(node, visit);
  }

  // Start traversing from the source file
  visit(sourceFile);

  return functions;
}

// Example usage
const exampleCode = `
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const multiply = (a: number, b: number) => a * b;

class Calculator {
  add(x: number, y: number): number {
    return x + y;
  }
}
`;

const extractedFunctions = extractFunctionsFlutter(exampleCode);
console.log(extractedFunctions);