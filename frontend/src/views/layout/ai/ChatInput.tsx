import styled from '@emotion/styled';
import { Send } from '@mui/icons-material';
import { Button, Input } from '@mui/material';
import { useCallback, useState } from 'react';

type ChatInputProps = {
  onMessage: (content: string) => void;
};

function isEnter(code: string) {
  return code === 'Enter' || code === 'NumpadEnter';
}

export default function ChatInput({ onMessage }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    onMessage(input);
    setInput('');
  }, [input, onMessage]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<unknown>) => {
      if (isEnter(event.nativeEvent.code) && !event.nativeEvent.shiftKey) {
        event.stopPropagation();
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Container>
      <Input
        fullWidth
        placeholder="Ask me a question"
        value={input}
        onChange={(evt) => setInput(evt.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button endIcon={<Send />} onClick={handleSend}>
        Send
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  > :first-child {
    flex: 1;
  }
`;
