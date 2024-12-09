import express from 'express';
import { setupRoutes } from './api/index.js';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use('/', setupRoutes());


