import { Router } from 'express';
import prompt from './routes/prompt.js';
import refactor from './routes/refactor.js';
import regenerate from './routes/regenerate.js';
import express from 'express';

export function setupRoutes() {
  const router = Router();
  router.use(express.json());

  prompt(router);
  refactor(router);
  regenerate(router);

  return router;
}
