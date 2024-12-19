import React, { useState } from "react";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");

  // Função chamada quando o arquivo de teste é selecionado
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "code" | "test"
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const uploadResponse = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        headers: {
          "X-File-Type": type, // Adiciona o tipo como cabeçalho
        },
      });
  
      if (uploadResponse.ok) {
        const jsonResponse = await uploadResponse.json();
        console.log("File upload successful:", jsonResponse);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleDownloadMutations = async () => {
    try {
      const response = await fetch("http://localhost:3000/files/mutations.txt");
      if (!response.ok) throw new Error("Erro ao baixar o arquivo");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mutations.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro durante o download do arquivo:", error);
      setResponse("Erro durante o download do arquivo");
    }
  };
  
  

  const handleGenerateTests = async () => {
    const textarea = document.getElementById("context") as HTMLTextAreaElement;
    const context = textarea.value; // Obtém o valor do <textarea>
    const languageElem = document.getElementById("language") as HTMLSelectElement;
    const language = languageElem.value;
  
    try {
      // Envia o conteúdo como JSON
      const saveResponse = await fetch("http://localhost:3000/save-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, language }), // Formata os dados corretamente
      });
  
      if (saveResponse.ok) {
        const jsonResponse = await saveResponse.json();
        console.log("Context saved successfully:", jsonResponse);
        setResponse(jsonResponse.message); // Atualiza a mensagem de sucesso no UI
      } else {
        throw new Error("Erro ao salvar o contexto");
      }
    } catch (error) {
      console.error("Erro durante o salvamento do contexto:", error);
      setResponse("Erro durante o salvamento do contexto"); // Atualiza a mensagem de erro no UI
    }
  };

  
  

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        backgroundColor: "#302c54",
        color: "white",
      }}
    >
      <style>{`
        h1 {
          font-size: 24px;
          font-weight: bold;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #2a274a;
          border-bottom: 2px solid #524f81;
        }

        header nav label {
          font-size: 14px;
          color: #c8c8d0;
        }

        header nav select {
          margin-left: 10px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background-color: #524f81;
          color: white;
        }

        main {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        main section {
          margin-bottom: 20px;
          width: 100%;
          max-width: 600px;
        }

        main section label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }

        textarea {
          width: 100%;
          height: 100px;
          background-color: #524f81;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px;
        }

        input.upload_btn {
          display: block;
          margin-top: 10px;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: #524f81;
          color: white;
          cursor: pointer;
        }

        input.upload_btn:hover {
          background-color: #6a67a3;
        }

        button {
          margin-right: 10px;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: #524f81;
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        button:hover {
          background-color: #6a67a3;
        }

        button:last-child {
          margin-right: 0;
        }

        footer {
          margin-top: 20px;
          padding: 10px;
          background-color: #2a274a;
          text-align: center;
          color: #c8c8d0;
          font-size: 14px;
        }
      `}</style>
      <header>
        <div>
          <h1>TwisterAI</h1>
        </div>
        <div>
          <nav>
            <label>Select the language:</label>
            <select id="language">
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </nav>
        </div>
      </header>
      <main>
        <section>
          <div>
            <label className="upload" htmlFor="code-file">
              Upload code file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
                className="upload_btn"
                type="file"
                onChange={(e) => handleFileChange(e, 'code')} // Arquivo de código
                />
          </div>
          <div>
            <label className="upload" htmlFor="tests-file">
              Upload tests file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
                className="upload_btn"
                type="file"
                onChange={(e) => handleFileChange(e, 'test')} // Arquivo de teste
                />
          </div>
        </section>

        <section>
            <label htmlFor="context">Give me some context about your code:</label>
            <textarea id="context" placeholder="Insert here the context."></textarea>
        </section>

        <section>
            <button onClick={handleGenerateTests}>Generate mutant tests</button>
            <button onClick={handleDownloadMutations}>Download mutant tests</button>
        </section>


        <section>
          {/* Exibe a resposta do servidor */}
          <p>{response}</p>
        </section>
      </main>
    </div>
  );
};

export default App;
