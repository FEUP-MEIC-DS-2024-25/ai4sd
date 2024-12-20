import express from 'express';
import { setupRoutes } from './api/index.js';
import 'dotenv/config';

const app = express();

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use('/', setupRoutes());


