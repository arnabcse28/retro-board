import config from '../config.js';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

export async function dialog(messages: ChatCompletionRequestMessage[]) {
  const api = new OpenAIApi(configure());
  const response = await api.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  });
  return response.data;
}

export function configure(): Configuration {
  const configuration = new Configuration({
    apiKey: config.OPEN_AI_API_KEY,
  });

  return configuration;
}
