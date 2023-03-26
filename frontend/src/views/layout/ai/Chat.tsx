import { CoachMessage } from './types';
import ScrollToBottom from 'react-scroll-to-bottom';
import styled from '@emotion/styled';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type ChatProps = {
  messages: CoachMessage[];
  thinking: boolean;
  onMessage: (content: string) => void;
};

export function Chat({ messages, thinking, onMessage }: ChatProps) {
  return (
    <Container>
      <ScrollContainer>
        {messages.map((m, index) => (
          <ChatMessage message={m} key={index} />
        ))}
        {thinking ? (
          <ChatMessage message={{ role: 'assistant', content: '...' }} />
        ) : null}
      </ScrollContainer>
      <UserInput>
        <ChatInput onMessage={onMessage} />
      </UserInput>
    </Container>
  );
}

const Container = styled.div``;

const UserInput = styled.div`
  margin-top: 20px;
`;

const ScrollContainer = styled(ScrollToBottom)`
  height: calc(100vh - 300px);
  flex: 1 1 auto;
`;
