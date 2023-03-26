import styled from '@emotion/styled';
import { Psychology } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { fetchPostGet } from 'api/fetch';
import { useCallback, useState } from 'react';
import { Chat } from './Chat';
import { CoachMessage, CoachRole } from './types';

type AiCoachProps = {
  open: boolean;
  onClose: () => void;
};

export function AiCoach({ open, onClose }: AiCoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [thinking, setThinking] = useState(false);

  const handleMessage = useCallback(
    async (content: string) => {
      setThinking(true);
      const newMessages = [...messages, { role: 'user' as CoachRole, content }];
      setMessages(newMessages);
      const response = await fetchPostGet<CoachMessage[], CoachMessage[]>(
        '/api/ai/chat',
        [],
        newMessages
      );
      setThinking(false);
      setMessages(response);
    },
    [messages]
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
