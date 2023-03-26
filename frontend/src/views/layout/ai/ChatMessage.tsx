import styled from '@emotion/styled';
import { colors } from '@mui/material';
import { CoachMessage } from './types';

type ChatMessageProps = {
  message: CoachMessage;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <MessageContainer own={message.role === 'user'}>
      {message.content}
    </MessageContainer>
  );
}

const MessageContainer = styled.div<{ own: boolean }>`
  float: ${(props) => (props.own ? 'right' : 'left')};
  white-space: pre-wrap;
  text-align: ${(props) => (props.own ? 'right' : 'left')};
  margin-right: ${(props) => (props.own ? '0' : '50px')};
  margin-left: ${(props) => (props.own ? '50px' : '0')};
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) => (props.own ? colors.blue[400] : '#f0f0f0')};
  color: ${(props) => (props.own ? 'white' : 'black')};
`;
