import { Router } from 'express';
import prompt from './routes/prompt.js';
import refactor from './routes/refactor.js';
import express from 'express';

export function setupRoutes() {
  const router = Router();
  router.use(express.json());

  router.get('/', (req, res) => {
    res.send(`
      <html>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
        <head>
          <title>Welcome</title>
        </head>
        <body>
          <h1>Welcome to What The Duck</h1>
          <p>This is where What The Duck is being hosted.</p>
          <img src="whattheduck.jpg" alt="Duck Picture" />
        </body>
      </html>
    `);
  });

  prompt(router);
  refactor(router);

  return router;
}
