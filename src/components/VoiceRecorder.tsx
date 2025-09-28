import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, Trash2, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useVoiceSystem } from '@/hooks/useVoiceSystem';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onTranscriptionComplete,
  disabled = false,
  className
}) => {
  const {
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
  } = useVoiceSystem();

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleStartListening = () => {
    if (!disabled) {
      startListening();
    }
  };

  const handleStopListening = () => {
    stopListening();
  };

  const handleSendText = async () => {
    if (speechText.trim()) {
      setIsProcessing(true);
      try {
        // Send the transcribed text to the chatbot
        onTranscriptionComplete(speechText.trim());
        clearSpeechText();
      } catch (error) {
        console.error('Failed to send transcribed text:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClearText = () => {
    clearSpeechText();
  };

  if (!isSpeechSupported) {
    return (
      <div className={cn("text-center p-4 text-muted-foreground", className)}>
        <MicOff className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Voice recognition not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-700 text-sm font-medium">
            Voice Error: {error}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* Status Header */}
        <div className="text-center mb-6">
          {isListening && (
            <div className="flex items-center justify-center gap-3 text-red-600 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Listening... Speak now</span>
            </div>
          )}
          {speechText && !isListening && (
            <div className="flex items-center justify-center gap-3 text-green-600 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold">Speech recognized</span>
            </div>
          )}
          {!isListening && !speechText && (
            <div className="text-gray-600 text-sm">
              Tap the microphone to start speaking
            </div>
          )}
        </div>

        {/* Transcribed Text Display */}
        {speechText && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Transcribed text:</div>
            <div className="text-gray-800 font-medium">{speechText}</div>
          </div>
        )}

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          {!speechText ? (
            <Button
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={disabled || isProcessing}
              size="lg"
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                isListening 
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span className="font-semibold">Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span className="font-semibold">Start Speaking</span>
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSendText}
                disabled={disabled || isProcessing}
                size="lg"
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isProcessing ? 'Sending...' : 'Send Text'}
                </span>
              </Button>

              <Button
                onClick={handleClearText}
                disabled={disabled || isProcessing}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-700">Clear</span>
              </Button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {speechText && !isProcessing && (
          <div className="mt-4 text-center">
            <div className="text-sm text-green-600 font-medium">
              ✓ Text ready! Click "Send Text" to send your message.
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Sending your message...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
