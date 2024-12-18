declare function acquireVsCodeApi(): {
    postMessage: (message: any) => void;
    getState: () => any;
    setState: (state: any) => void;
  };
  
  declare const vscode: ReturnType<typeof acquireVsCodeApi>;