import { useState, useRef, useCallback } from 'react';

interface UseVoiceSystemReturn {
  // Speech Recognition (Voice to Text)
  isListening: boolean;
  isSpeechSupported: boolean;
  speechText: string;
  startListening: () => void;
  stopListening: () => void;
  clearSpeechText: () => void;
  
  // Text to Speech (Response Voice)
  isSpeaking: boolean;
  isTtsSupported: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  
  // Error handling
  error: string | null;
}

export const useVoiceSystem = (): UseVoiceSystemReturn => {
  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Text to Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Check browser support
  const isSpeechSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
  const isTtsSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window;

  // Speech Recognition (Voice to Text)
  const startListening = useCallback(() => {
    if (!isSpeechSupported) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      setError(null);
      setSpeechText('');
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setSpeechText(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [isSpeechSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const clearSpeechText = useCallback(() => {
    setSpeechText('');
    setError(null);
  }, []);

  // Text to Speech (Response Voice)
  const speak = useCallback((text: string) => {
    if (!isTtsSupported) {
      setError('Text-to-speech not supported in this browser');
      return;
    }

    try {
      // Stop any current speech
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event: any) => {
        console.error('Speech synthesis error:', event.error);
        setError(`Speech synthesis error: ${event.error}`);
        setIsSpeaking(false);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error starting text-to-speech:', err);
      setError('Failed to start text-to-speech');
      setIsSpeaking(false);
    }
  }, [isTtsSupported]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    // Speech Recognition
    isListening,
    isSpeechSupported,
    speechText,
    startListening,
    stopListening,
    clearSpeechText,
    
    // Text to Speech
    isSpeaking,
    isTtsSupported,
    speak,
    stopSpeaking,
    
    // Error handling
    error,
  };
};
