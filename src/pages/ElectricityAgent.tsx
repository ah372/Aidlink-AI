import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import { electricityChat, getElectricityChatHistory, generateUserId } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ElectricityAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Get user ID from navigation state or generate new one
  const [userId] = useState(() => {
    const stateUserId = location.state?.userId;
    return stateUserId || generateUserId();
  });

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getElectricityChatHistory(userId);
        const formattedMessages = history.history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load electricity chat history:', error);
        // Show welcome message if no history
        if (location.state?.fromTriage) {
          const welcomeMessage: Message = {
            role: 'assistant',
            content: "Hello! I'm the Electricity Emergency Agent. I've been notified about your electrical or utility issue. Please describe the problem you're experiencing - whether it's a power outage, electrical hazard, or other utility emergency.",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
      }
    };

    loadChatHistory();
  }, [userId, location.state?.fromTriage]);

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await electricityChat(userId, message);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message to electricity agent:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to electricity emergency services. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to electricity emergency services right now. Please try again or contact your utility company directly if this is urgent.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        theme="electricity"
        placeholder="Describe your electrical or utility emergency..."
        agentName="⚡ Electricity Emergency Agent"
      />
    </div>
  );
};

export default ElectricityAgent;