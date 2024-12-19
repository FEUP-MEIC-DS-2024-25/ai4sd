import express from 'express';
import multer from 'multer';
import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let originalCodeFileName = ''; // Variável global para o nome original do ficheiro "code"
let originalTestFileName = ''; // Variável global para o nome original do ficheiro "test"

const dir = './files';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const type = req.headers['x-file-type'] || 'default';
      const filenameMap = {
        code: 'code_file',
        test: 'test-file',
        default: Date.now().toString(),
      };

      // Guardar os nomes originais nas variáveis globais
      if (type === 'code') {
        originalCodeFileName = file.originalname; // Nome original do ficheiro de código
        console.log(originalCodeFileName);
      } else if (type === 'test') {
        originalTestFileName = file.originalname; // Nome original do ficheiro de teste
        console.log(originalTestFileName);
      }

      cb(null, `${filenameMap[type] || filenameMap.default}${path.extname(file.originalname)}`);
    },
  }),
});

async function updateImports(testFilePath,language) {
  try {
    // Ler o conteúdo do ficheiro
    let content = await fsPromises.readFile(testFilePath, 'utf-8');

    // Garantir que 'originalCodeFileName' é substituído com o nome sem a extensão
    const baseName = originalCodeFileName.split('.')[0]; // Extrair nome sem extensão

    if (language ==="python"){
        // Substituir todas as ocorrências de 'originalCodeFileName' pelo nome sem extensão (baseName)
        content = content.replace(baseName, 'code_file');
    }else{
        //Caso de javascript
        // Substituir todas as ocorrências de 'originalCodeFileName' pelo nome sem extensão (baseName)
        content = content.replace(/require\(\s*['"]\.\/([^'"]+)['"]\s*\)/g, (match, p1) => {
          // Substitua p1 com o nome desejado
          return `require('./${p1.replace(baseName, 'code_file')}')`;
        });
    }

    // Salvar as alterações no ficheiro
    await fsPromises.writeFile(testFilePath, content);
    console.log(`Substituições realizadas no arquivo: ${testFilePath}`);
  } catch (err) {
    console.error('Erro ao atualizar o arquivo:', err);
    throw err;
  }
}



app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send({ filename: req.file.filename });
});

app.post('/save-context', async (req, res) => {
  const { context, language } = req.body;

  const filePath = path.join(dir, 'context.txt');

  try {
    // Salvar o contexto em context.txt
    await fsPromises.writeFile(filePath, context);

    // Mapear os arquivos por linguagem
    const fileMappings = {
      python: { codeFile: 'code_file.py', testFile: 'test-file.py' },
      java: { codeFile: 'code_file.java', testFile: 'test-file.java' },
      javascript: { codeFile: 'code_file.js', testFile: 'test-file.js' },
    };

    const languageFiles = fileMappings[language];
    if (!languageFiles) return res.status(400).send('Linguagem não suportada.');

    const sourceDir = path.join(__dirname, './files');
    const targetDir = path.join(__dirname, '../');

    const sourcePaths = [];
    const targetPaths = [];

    // Adicionar arquivos válidos à lista
    if (fs.existsSync(path.join(sourceDir, languageFiles.codeFile))) {
      sourcePaths.push(path.join(sourceDir, languageFiles.codeFile));
      targetPaths.push(path.join(targetDir, languageFiles.codeFile));
    }
    if (fs.existsSync(path.join(sourceDir, languageFiles.testFile))) {
      sourcePaths.push(path.join(sourceDir, languageFiles.testFile));
      targetPaths.push(path.join(targetDir, languageFiles.testFile));
    }

    // Sempre adicionar o context.txt
    sourcePaths.push(filePath);
    targetPaths.push(path.join(targetDir, 'context.txt'));

    // Copiar os arquivos para o diretório de destino
    await Promise.all(sourcePaths.map((src, idx) => fsPromises.rename(src, targetPaths[idx])));
    console.log('Arquivos copiados para:', targetPaths);

    // Ver quais os ficheiros
    const files_names = [];
    if (language === 'python') {
      files_names.push('code_file.py');
      files_names.push('test-file.py');
      files_names.push('context.txt');

      // Renomear os imports para funcionar
      const testFilePath = path.join(targetDir, languageFiles.testFile);
      await updateImports(testFilePath,"python");
    } else if (language === 'java') {
      files_names.push('code_file.java');
      files_names.push('test-file.java');
      files_names.push('context.txt');
    } else {
      // JavaScript
      files_names.push('code_file.js');
      files_names.push('test-file.js');
      files_names.push('context.txt');
      const testFilePath = path.join(targetDir, languageFiles.testFile);
      await updateImports(testFilePath,"javascript");
    }

    const contextFilePath = path.join(targetDir, 'context.txt');

    if (fs.existsSync(contextFilePath)) {
      const content = fs.readFileSync(contextFilePath, 'utf-8').trim();
      if (content.length === 0) {
        console.warn('O ficheiro context.txt está vazio e será removido da lista.');
        // Remover 'context.txt' do array files_names
        const index = files_names.indexOf('context.txt');
        if (index > -1) {
          files_names.splice(index, 1);
        }
      } else {
        console.log('O ficheiro context.txt possui conteúdo.');
      }
    } else {
      console.warn('O ficheiro context.txt não foi encontrado.');
    }

    

    // Executar o script Python
    const scriptPath = path.join(__dirname, '../juncao.py');
    const pythonProcess = spawn(
      'python3',
      [scriptPath, language, ...files_names],
      { cwd: path.join(__dirname, '../') } // Diretório de trabalho para o script Python
    );

    pythonProcess.on('close', async (code) => {
      if (code === 0) {
        try {
          // Restaurar os arquivos para seus caminhos de origem
          await Promise.all(targetPaths.map((tgt, idx) => fsPromises.rename(tgt, sourcePaths[idx])));

          // Mover mutations.txt de ../ para ./files
          const mutationsSrc = path.join(targetDir, 'mutations.txt'); // Local de origem
          const mutationsDest = path.join(sourceDir, 'mutations.txt'); // Local de destino

          if (fs.existsSync(mutationsSrc)) {
            await fsPromises.rename(mutationsSrc, mutationsDest);
            console.log(`Arquivo mutations.txt movido de ${mutationsSrc} para ${mutationsDest}`);
          } else {
            console.warn('mutations.txt não encontrado em ../. Certifique-se de que o script Python o gerou.');
          }

          res.send({ message: 'Process completed successfully!' });
        } catch (err) {
          console.error('Erro ao mover os arquivos:', err);
          res.status(500).send('Erro ao mover os arquivos após a execução.');
        }
      } else {
        res.status(500).send('Erro no script Python.');
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Erro ao executar o script Python:', err);
      res.status(500).send('Erro ao executar o script.');
    });
  } catch (err) {
    console.error('Erro no processo:', err);
    res.status(500).send('Erro no processo.');
  }
});

// Rota para servir o arquivo mutations.txt
app.get('/files/mutations.txt', (req, res) => {
  const mutationsFile = path.join('files', 'mutations.txt');

  if (fs.existsSync(mutationsFile)) {
    res.download(mutationsFile); // Permite o download do arquivo
  } else {
    res.status(404).json({ message: 'Mutations file not found' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
