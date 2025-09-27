import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import { fireChat, getFireChatHistory, generateUserId } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FireAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
        const history = await getFireChatHistory(userId);
        const formattedMessages = history.history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load fire chat history:', error);
        // Show default welcome message
        const welcomeMessage: Message = {
          role: 'assistant',
          content: "My Assistant has sent you to me. Plz tell me what I can help you with?",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
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
      const response = await fireChat(userId, message);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message to fire agent:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to fire emergency services. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to fire emergency services right now. Please try again or call emergency services directly if this is urgent.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-gradient-fire border-b border-fire-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/frontdesk')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Front Desk
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>
      
      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          theme="fire"
          placeholder="Describe your fire emergency situation..."
          agentName="🔥 Fire Emergency Agent"
        />
      </div>
    </div>
  );
};

export default FireAgent;