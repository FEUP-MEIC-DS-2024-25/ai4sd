import express from 'express';
import 'dotenv/config';
import commandRouter from './controllers/commandController.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

//Process JSON file
app.use(express.json());

// Routes
app.use('/command', cors(), commandRouter);

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
