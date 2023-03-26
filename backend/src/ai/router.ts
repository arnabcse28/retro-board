import express, { Router } from 'express';
import { dialog } from './index.js';
import { getUserViewFromRequest } from '../utils.js';
import { AiChatPayload } from '../common/payloads.js';

export default function aiRouter(): Router {
  const router = express.Router();

  router.post('/chat', async (req, res) => {
    const user = await getUserViewFromRequest(req);
    if (!user) {
      return res
        .status(401)
        .send('You need to be logged in to use this feature');
    }
    const payload = req.body as AiChatPayload;

    const response = await dialog(payload.id, user, payload.messages);

    return res.status(200).send(response);
  });

  return router;
}
