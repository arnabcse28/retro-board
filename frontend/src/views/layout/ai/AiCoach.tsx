import styled from '@emotion/styled';
import { Psychology } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { requestConfig } from 'api/fetch';
import { CoachMessage, CoachRole } from 'common';
import { useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { Chat } from './Chat';

type AiCoachProps = {
  open: boolean;
  onClose: () => void;
};

export function AiCoach({ open, onClose }: AiCoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [id] = useState(v4());

  const handleMessage = useCallback(
    async (content: string) => {
      setThinking(true);
      const newMessages = [...messages, { role: 'user' as CoachRole, content }];
      setMessages(newMessages);
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          body: JSON.stringify({ id, messages: newMessages }),
          ...requestConfig(),
        });
        if (response.ok) {
          const msgs = (await response.json()) as CoachMessage[];
          setThinking(false);
          setMessages(msgs);
        } else if (response.status === 402) {
          setThinking(false);
          setMessages([
            ...newMessages,
            {
              role: 'assistant' as CoachRole,
              content:
                'You have reached your limit for today. Please try again tomorrow.',
            },
          ]);
        } else {
          setThinking(false);
          setMessages([
            ...newMessages,
            {
              role: 'assistant' as CoachRole,
              content:
                'Something went wrong with the AI. Please try again later.',
            },
          ]);
        }
      } catch (ex) {
        setThinking(false);
        console.error(ex);
      }
    },
    [messages, id]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <HeaderContainer>
          <Psychology />
          AI Coach
        </HeaderContainer>
      </DialogTitle>
      <DialogContent>
        <Chat
          messages={messages}
          onMessage={handleMessage}
          thinking={thinking}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
