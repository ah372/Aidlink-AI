const BASE_URL = 'http://127.0.0.1:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  audio_response_path?: string;
}

export interface ChatResponse {
  response: string;
  emergency_type?: 'Medical' | 'Police' | 'Electricity' | 'Fire';
  audio_response_path?: string;
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

// Voice message functions
export const triageVoiceChat = async (userId: string, audioBlob: Blob): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('message', '');
  formData.append('input_type', 'voice');
  formData.append('audio', audioBlob, 'voice.wav');

  const response = await fetch(`${BASE_URL}/api/triage/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send voice message to triage agent');
  }

  return response.json();
};

export const medicalVoiceChat = async (userId: string, audioBlob: Blob): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('message', '');
  formData.append('input_type', 'voice');
  formData.append('audio', audioBlob, 'voice.wav');

  const response = await fetch(`${BASE_URL}/api/medical-emergency/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send voice message to medical agent');
  }

  return response.json();
};

export const policeVoiceChat = async (userId: string, audioBlob: Blob): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('message', '');
  formData.append('input_type', 'voice');
  formData.append('audio', audioBlob, 'voice.wav');

  const response = await fetch(`${BASE_URL}/api/police-emergency/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send voice message to police agent');
  }

  return response.json();
};

export const electricityVoiceChat = async (userId: string, audioBlob: Blob): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('message', '');
  formData.append('input_type', 'voice');
  formData.append('audio', audioBlob, 'voice.wav');

  const response = await fetch(`${BASE_URL}/api/electricity-emergency/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send voice message to electricity agent');
  }

  return response.json();
};

export const fireVoiceChat = async (userId: string, audioBlob: Blob): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('message', '');
  formData.append('input_type', 'voice');
  formData.append('audio', audioBlob, 'voice.wav');

  const response = await fetch(`${BASE_URL}/api/fire-emergency/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send voice message to fire agent');
  }

  return response.json();
};

// Audio response functions
export const getAudioUrl = (audioPath: string): string => {
  // If the path already starts with /audio/, use it as is
  if (audioPath.startsWith('/audio/')) {
    return `${BASE_URL}${audioPath}`;
  }
  // Otherwise, assume it's just the filename and add the /audio/ prefix
  return `${BASE_URL}/audio/${audioPath}`;
};