import express, { Router } from 'express';
import { dialog } from './index.js';
import { ChatCompletionRequestMessage } from 'openai';

export default function aiRouter(): Router {
  const router = express.Router();

  router.post('/chat', async (req, res) => {
    const messages = req.body as ChatCompletionRequestMessage[];

    const response = await dialog(messages);

    return res.status(200).send(response);
  });

  return router;
}
