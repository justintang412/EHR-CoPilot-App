export type CopilotMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type CopilotChatState = {
  messages: CopilotMessage[];
  loading: boolean;
  error?: string;
}; 