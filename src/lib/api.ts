const BASE_URL = 'https://zainattiq-aidlinkai.hf.space';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  emergency_type?: 'Medical' | 'Police' | 'Electricity' | 'Fire';
}

export interface ChatHistoryResponse {
  history: ChatMessage[];
}

// Generate unique user ID for each conversation
export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Triage Agent API
export const triageChat = async (userId: string, message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/triage/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to triage agent');
  }

  return response.json();
};

export const getTriageChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${BASE_URL}/api/triage/chatHistory/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch triage chat history');
  }

  return response.json();
};

// Medical Agent API
export const medicalChat = async (userId: string, message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/medical-emergency/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to medical agent');
  }

  return response.json();
};

export const getMedicalChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${BASE_URL}/api/medical-emergency/chatHistory/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch medical chat history');
  }

  return response.json();
};

// Police Agent API
export const policeChat = async (userId: string, message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/police-emergency/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to police agent');
  }

  return response.json();
};

export const getPoliceChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${BASE_URL}/api/police-emergency/chatHistory/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch police chat history');
  }

  return response.json();
};

// Electricity Agent API
export const electricityChat = async (userId: string, message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/electricity-emergency/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to electricity agent');
  }

  return response.json();
};

export const getElectricityChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${BASE_URL}/api/electricity-emergency/chatHistory/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch electricity chat history');
  }

  return response.json();
};

// Fire Agent API
export const fireChat = async (userId: string, message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/fire-emergency/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to fire agent');
  }

  return response.json();
};

export const getFireChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${BASE_URL}/api/fire-emergency/chatHistory/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch fire chat history');
  }

  return response.json();
};