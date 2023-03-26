import UserView from '../entities/UserView.js';
import AiChatEntity from '../entities/AiChat.js';
import { transaction } from './transaction.js';
import AiChatRepository from '../repositories/AiChatRepository.js';
import { getUser } from './users.js';
import { CoachMessage, CoachRole } from 'common/types.js';
import AiChatMessageRepository from '../repositories/AiChatMessageRepository.js';
import AiChatMessageEntity from '../entities/AiChatMessage.js';
import { v4 } from 'uuid';

export async function getAiChatSession(
  id: string,
  userView: UserView,
  systemMessage: CoachMessage
): Promise<AiChatEntity> {
  return await transaction(async (manager) => {
    const repository = manager.withRepository(AiChatRepository);
    const chat = await repository.findOne({
      where: { id },
    });
    if (chat) {
      return chat;
    }
    const user = await getUser(userView.id);
    if (user) {
      const newChat = new AiChatEntity(id, user);
      await repository.save(newChat);
      const messageRepository = manager.withRepository(AiChatMessageRepository);
      await messageRepository.save(
        new AiChatMessageEntity(
          v4(),
          newChat,
          systemMessage.content,
          systemMessage.role
        )
      );
      return newChat;
    }

    throw Error('Could not persist a chat session');
  });
}

export async function recordAiChatMessage(
  role: CoachRole,
  content: string,
  chat: AiChatEntity
): Promise<void> {
  return await transaction(async (manager) => {
    const repository = manager.withRepository(AiChatMessageRepository);
    await repository.save(new AiChatMessageEntity(v4(), chat, content, role));
  });
}
