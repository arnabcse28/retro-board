import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from '@mui/material';
import { fetchPostGet } from 'api/fetch';
import { useCallback, useState } from 'react';

type AiCoachProps = {
  onClose: () => void;
};

type Message = {
  role: string;
  content: string;
};

export function AiCoach({ onClose }: AiCoachProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessage = useCallback(async () => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const response = await fetchPostGet<Message[], Message[]>(
      '/api/ai/chat',
      [],
      newMessages
    );
    setMessages(response);
  }, [input, messages]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>AI Coach</DialogTitle>
      <DialogContent>
        <Input value={input} onChange={(evt) => setInput(evt.target.value)} />
        <Button onClick={handleMessage}>Send</Button>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.role}: {message.content}
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// const MessageContainer = styled.div``,
