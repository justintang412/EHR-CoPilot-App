import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { useCopilotChat } from '../api/copilot-chat';
import type { CopilotMessage } from '../types';

export const CopilotChat: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const { mutate: sendMessage, isPending } = useCopilotChat();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Omit<CopilotMessage, 'id' | 'createdAt'> = {
      role: 'user',
      content: input.trim(),
    };
    sendMessage(
      { messages: [...messages.map(({ role, content }) => ({ role, content })), userMessage] },
      {
        onSuccess: (data) => {
          setMessages(data.messages);
          setInput('');
        },
        onError: () => {
          // Optionally handle error
        },
      }
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Copilot Chat
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', mb: 2 }}>
        {messages.length === 0 && (
          <Typography color="text.secondary">No messages yet. Start the conversation!</Typography>
        )}
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ mb: 1, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <Typography variant="body2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
              <strong>{msg.role === 'user' ? 'You' : 'Copilot'}:</strong> {msg.content}
            </Typography>
          </Box>
        ))}
        {isPending && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={isPending}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={isPending || !input.trim()}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}; 