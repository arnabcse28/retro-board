import config from '../config.js';
import { Configuration, OpenAIApi } from 'openai';
import { getAiChatSession, recordAiChatMessage } from '../db/actions/ai.js';
import UserView from '../db/entities/UserView.js';
import { CoachMessage } from '../common/types.js';

const systemMessage: CoachMessage = {
  role: 'system',
  content:
    'You are an online agile coach, helping a team to improve their online retrospectives, using Retrospected. The team is a remote team and is not physically in the same room. Retrospected provides various templates such as "Start, Stop, Continue" and "4Ls". You can also vote, use a timer, and get a summary that can be exported to Jira using Markdown.',
};

export async function dialog(
  chatId: string,
  user: UserView,
  messages: CoachMessage[]
): Promise<CoachMessage[]> {
  const chat = await getAiChatSession(chatId, user, systemMessage);
  console.log('Chat: ', chat);
  const api = new OpenAIApi(configure());
  const response = await api.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, ...messages],
  });
  const answer = response.data.choices[0].message!;
  await recordAiChatMessage('assistant', answer.content, chat);
  return [...messages, answer];
}

export function configure(): Configuration {
  const configuration = new Configuration({
    apiKey: config.OPEN_AI_API_KEY,
  });

  return configuration;
}
