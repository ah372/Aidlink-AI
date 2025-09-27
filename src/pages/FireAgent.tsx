import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { toast } from '@/hooks/use-toast';
import { fireChat, getFireChatHistory, generateUserId } from '@/lib/api';
import { Home, ArrowLeft } from 'lucide-react';
import fireHeroImage from '@/assets/fire-hero.jpg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FireAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => generateUserId());
  const navigate = useNavigate();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getFireChatHistory(userId);
        const formattedMessages = history.history.map(msg => ({
          ...msg,
          timestamp: new Date(),
        }));
        
        // Add default message if no history
        if (formattedMessages.length === 0) {
          setMessages([{
            role: 'assistant',
            content: 'My Assistant has sent you to me. Plz tell me what I can help you with?',
            timestamp: new Date(),
          }]);
        } else {
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setMessages([{
          role: 'assistant',
          content: 'My Assistant has sent you to me. Plz tell me what I can help you with?',
          timestamp: new Date(),
        }]);
      }
    };

    loadChatHistory();
  }, [userId]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fireChat(userId, message);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fire-bg">
      {/* Hero Section */}
      <div className="relative h-32 bg-gradient-fire overflow-hidden">
        <img 
          src={fireHeroImage} 
          alt="Fire Emergency Response" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-fire-primary/80 to-fire-secondary/60" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/frontdesk')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Front Desk
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <h1 className="text-2xl font-bold text-white">Fire Emergency Agent</h1>
          <p className="text-white/90">Specialized fire emergency assistance</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-8rem)]">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          theme="fire"
          placeholder="Describe your fire emergency situation..."
          agentName="Fire Emergency Agent"
        />
      </div>
    </div>
  );
};

export default FireAgent;