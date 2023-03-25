import express, { Router } from 'express';
import { dialog } from './index.js';

export default function aiRouter(): Router {
  const router = express.Router();

  router.get('/chat', async (req, res) => {
    const messages = await dialog([
      {
        role: 'system',
        content:
          'You are an agile coach, helping a team to improve their retrospectives',
      },
      {
        role: 'user',
        content:
          'Hi, I would need to know how to make retrospectives more effective and fun',
      },
    ]);

    return res.status(200).send(messages);
  });

  return router;
}
