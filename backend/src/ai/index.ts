import config from '../config.js';
import { Configuration, OpenAIApi } from 'openai';
import { getAiChatSession, recordAiChatMessage } from '../db/actions/ai.js';
import UserView from '../db/entities/UserView.js';
import { CoachMessage } from '../common/types.js';
import { last } from 'lodash-es';

const systemMessage: CoachMessage = {
  role: 'system',
  content: `You are an online agile coach, helping a team to improve their online retrospectives, using Retrospected.
	The team is a remote team and is not physically in the same room. 
	Retrospected provides various templates such as "Start, Stop, Continue" and "4Ls". 
	The user can also vote, use a timer, and get a summary that can be exported to Jira using Markdown.
	The export functionality is located in the Summary tab, using the export button on the bottom right corner.
	The user can also use the "Copy to clipboard" button to copy the summary to the clipboard.
	The user can make posts anonymous or not, change voting rules, customize the columns, encrypt sessions and make them private.
  The user can also use an AI coach to help them make the most out of Retrospected. That coach is you.
  Your answers should be clear and brief, try to stay below 200 words.
  When possible, use bullet points.
  Also end your answers by asking the user needs more information on your answer, or has another question.
  Please confirm the answer is clear for the user, or ask the user to ask clarifying questions.
  `,
};

export async function dialog(
  chatId: string,
  user: UserView,
  messages: CoachMessage[]
): Promise<CoachMessage[]> {
  const chat = await getAiChatSession(chatId, user, systemMessage);
  const api = new OpenAIApi(configure());
  const response = await api.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, ...messages],
  });
  const answer = response.data.choices[0].message!;
  if (messages.length) {
    await recordAiChatMessage('user', last(messages)!.content, chat);
  }
  await recordAiChatMessage('assistant', answer.content, chat);
  return [...messages, answer];
}

export function configure(): Configuration {
  const configuration = new Configuration({
    apiKey: config.OPEN_AI_API_KEY,
  });

  return configuration;
}
