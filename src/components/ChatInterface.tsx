import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  theme: 'medical' | 'police' | 'electricity' | 'fire' | 'triage';
  placeholder?: string;
  agentName?: string;
}

const themeConfig = {
  medical: {
    primary: 'medical',
    secondary: 'medical-secondary',
    bgClass: 'bg-medical-bg',
    userBubble: 'bg-medical-primary text-medical-foreground',
    botBubble: 'bg-medical-secondary text-white',
    gradient: 'bg-gradient-medical',
  },
  police: {
    primary: 'police',
    secondary: 'police-secondary',
    bgClass: 'bg-police-bg',
    userBubble: 'bg-police-primary text-police-foreground',
    botBubble: 'bg-police-secondary text-police-primary',
    gradient: 'bg-gradient-police',
  },
  electricity: {
    primary: 'electricity',
    secondary: 'electricity-secondary',
    bgClass: 'bg-electricity-bg',
    userBubble: 'bg-electricity-primary text-electricity-secondary',
    botBubble: 'bg-electricity-secondary text-electricity-primary',
    gradient: 'bg-gradient-electricity',
  },
  fire: {
    primary: 'fire',
    secondary: 'fire-secondary',
    bgClass: 'bg-fire-bg',
    userBubble: 'bg-fire-primary text-fire-foreground',
    botBubble: 'bg-fire-secondary text-fire-primary',
    gradient: 'bg-gradient-fire',
  },
  triage: {
    primary: 'emergency',
    secondary: 'default',
    bgClass: 'bg-background',
    userBubble: 'bg-primary text-primary-foreground',
    botBubble: 'bg-emergency text-emergency-foreground',
    gradient: 'bg-gradient-emergency',
  },
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  theme,
  placeholder = "Type your message...",
  agentName = "Agent"
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = themeConfig[theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Refocus input after messages update (when not loading)
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex flex-col h-full min-h-screen",
      config.bgClass
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b shadow-lg relative",
        config.gradient
      )}>
        <div className="absolute top-4 right-4">
          <div className="relative">
            {/* Emergency beacon bulb shape */}
            <div className="w-4 h-6 bg-red-500 rounded-t-full rounded-b-sm animate-ping shadow-lg"></div>
            <div className="absolute top-0 left-0 w-4 h-6 bg-red-600 rounded-t-full rounded-b-sm animate-pulse"></div>
            {/* Base of the beacon */}
            <div className="w-5 h-1 bg-gray-600 rounded-sm -mt-0.5 -ml-0.5"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Bot className="w-8 h-8" />
          {agentName}
        </h1>
        <p className="text-white/90 mt-1">Emergency Support Assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Welcome to {agentName}</h3>
            <p className="text-muted-foreground">
              I'm here to help you with your emergency. Please describe your situation.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
                message.role === 'user' 
                  ? config.userBubble
                  : config.botBubble
              )}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {message.content}
                  </p>
                  {message.timestamp && (
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
              config.botBubble
            )}>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-current"></div>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-current" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-current" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="h-12 text-base focus:ring-2 focus:ring-primary/50"
              style={{
                caretColor: 'hsl(var(--primary))',
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            variant={config.primary as any}
            size="lg"
            className="h-12 px-6"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
