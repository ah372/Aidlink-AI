import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import { medicalChat, medicalVoiceChat, getMedicalChatHistory, generateUserId, getAudioUrl } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import medicalHeroImage from '@/assets/medical-hero.jpg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const MedicalAgent = () => {
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
        const history = await getMedicalChatHistory(userId);
        const formattedMessages = history.history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
          audioUrl: msg.audio_response_path ? getAudioUrl(msg.audio_response_path) : undefined,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load medical chat history:', error);
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
      const response = await medicalChat(userId, message);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        audioUrl: response.audio_response_path ? getAudioUrl(response.audio_response_path) : undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message to medical agent:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to medical emergency services. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to medical emergency services right now. Please try again or call emergency medical services directly if this is urgent.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: '[Voice message...]',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await medicalVoiceChat(userId, audioBlob);
      
      // Update the user message with the transcribed text
      const transcribedText = response.response || '[Voice message processed]';
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.role === 'user' 
          ? { ...msg, content: transcribedText }
          : msg
      ));
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response || 'I received your voice message but could not process it properly.',
        timestamp: new Date(),
        audioUrl: response.audio_response_path ? getAudioUrl(response.audio_response_path) : undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send voice message to medical agent:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process voice message. Please try again.",
        variant: "destructive",
      });
      
      // Update the user message to show error
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.role === 'user' 
          ? { ...msg, content: '[Voice message failed to process]' }
          : msg
      ));
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your voice message right now. Please try again or use text input.",
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
      <div 
        className="flex justify-between items-center p-4 bg-medical-bg border-b relative bg-cover bg-center"
        style={{ backgroundImage: `url(${medicalHeroImage})` }}
      >
        <div className="absolute inset-0 bg-medical-primary/80"></div>
        <div className="flex gap-2 relative z-10">
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
          onVoiceMessage={handleVoiceMessage}
          isLoading={isLoading}
          theme="medical"
          placeholder="Describe your medical emergency..."
          agentName="🩺 Medical Emergency Agent"
        />
      </div>
    </div>
  );
};

export default MedicalAgent;