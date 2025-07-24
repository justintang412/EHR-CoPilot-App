import { api } from '@/lib/api-client';
import { buildFirebaseFunctionUrl, FIREBASE_FUNCTIONS_CONFIG } from '@/config/firebase-functions';
import { useMutation } from '@tanstack/react-query';

export type CopilotMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type CopilotChatRequest = {
  messages: Array<Pick<CopilotMessage, 'role' | 'content'>>;
};

export type CopilotChatResponse = {
  messages: CopilotMessage[];
};

export const sendCopilotMessage = async (
  payload: CopilotChatRequest
): Promise<CopilotChatResponse> => {
  const response = await api.post(
    buildFirebaseFunctionUrl(FIREBASE_FUNCTIONS_CONFIG.ENDPOINTS.COPILOT_CHAT),
    payload
  );
  return response.data;
};

export const useCopilotChat = () => {
  return useMutation({
    mutationFn: sendCopilotMessage,
  });
}; 