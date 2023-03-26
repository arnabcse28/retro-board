export type CoachRole = 'user' | 'assistant';

export type CoachMessage = {
  role: CoachRole;
  content: string;
};
