import express from 'express';
import { setupRoutes } from './api/index.js';
import 'dotenv/config';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use('/', setupRoutes());


