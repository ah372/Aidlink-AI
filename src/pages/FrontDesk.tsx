import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import { triageChat, getTriageChatHistory, generateUserId } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FrontDesk = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => generateUserId());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getTriageChatHistory(userId);
        const formattedMessages = history.history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // Don't show error for empty history, it's expected
      }
    };

    loadChatHistory();
  }, [userId]);

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
      const response = await triageChat(userId, message);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Check if emergency type is determined
      if (response.emergency_type) {
        toast({
          title: "Emergency Classified",
          description: `Routing you to ${response.emergency_type} Emergency Agent...`,
        });

        // Navigate to appropriate agent page after a short delay
        setTimeout(() => {
          switch (response.emergency_type) {
            case 'Medical':
              navigate('/medical', { state: { fromTriage: true, userId } });
              break;
            case 'Police':
              navigate('/police', { state: { fromTriage: true, userId } });
              break;
            case 'Electricity':
              navigate('/electricity', { state: { fromTriage: true, userId } });
              break;
            case 'Fire':
              navigate('/fire', { state: { fromTriage: true, userId } });
              break;
            default:
              console.warn('Unknown emergency type:', response.emergency_type);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to emergency services. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to emergency services right now. Please try again or call emergency services directly if this is urgent.",
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
      <div className="flex justify-between items-center p-4 bg-background border-b">
        <div className="flex gap-2">
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
          theme="triage"
          placeholder="Describe your emergency situation..."
          agentName="FrontDesk Agent"
        />
      </div>
    </div>
  );
};

export default FrontDesk;