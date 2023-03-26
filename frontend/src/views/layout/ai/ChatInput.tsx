import styled from '@emotion/styled';
import { Send } from '@mui/icons-material';
import { Button, Input } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ChatInputProps = {
  onMessage: (content: string) => void;
};

function isEnter(code: string) {
  return code === 'Enter' || code === 'NumpadEnter';
}

export default function ChatInput({ onMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { t } = useTranslation();

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
        placeholder={t('Ai.inputPrompt')!}
        value={input}
        onChange={(evt) => setInput(evt.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button endIcon={<Send />} onClick={handleSend}>
        {t('Ai.send')}
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
