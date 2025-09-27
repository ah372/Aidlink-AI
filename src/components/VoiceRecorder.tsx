import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, Trash2, Send, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
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
    isRecording,
    isSupported,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    error,
    clearRecording,
  } = useVoiceRecording();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleStartRecording = () => {
    if (!disabled) {
      startRecording();
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handlePlayRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSendRecording = async () => {
    if (audioBlob) {
      setIsTranscribing(true);
      try {
        // Send audio directly to backend for processing
        onRecordingComplete(audioBlob);
        clearRecording();
      } catch (error) {
        console.error('Failed to send voice recording:', error);
        clearRecording();
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        // If no result was captured, resolve with empty string
        resolve('');
      };

      // Start recognition
      recognition.start();

      // Stop recognition after 10 seconds to prevent hanging
      setTimeout(() => {
        recognition.stop();
        resolve('');
      }, 10000);
    });
  };

  if (!isSupported) {
    return (
      <div className={cn("text-center p-4 text-muted-foreground", className)}>
        <MicOff className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Voice recording not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-700 text-sm font-medium">
            Recording Error: {error}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* Status Header */}
        <div className="text-center mb-6">
          {isRecording && (
            <div className="flex items-center justify-center gap-3 text-red-600 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Recording in progress...</span>
            </div>
          )}
          {audioBlob && !isRecording && (
            <div className="flex items-center justify-center gap-3 text-green-600 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold">Recording complete</span>
            </div>
          )}
          {!isRecording && !audioBlob && (
            <div className="text-gray-600 text-sm">
              Tap the microphone to start recording your message
            </div>
          )}
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          {!audioBlob ? (
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={disabled || isTranscribing}
              size="lg"
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                isRecording 
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span className="font-semibold">Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span className="font-semibold">Start Recording</span>
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlayRecording}
                disabled={disabled || isTranscribing}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-blue-600" />
                ) : (
                  <Play className="w-5 h-5 text-blue-600" />
                )}
                <span className="font-medium text-gray-700">
                  {isPlaying ? 'Pause' : 'Play'}
                </span>
              </Button>

              <Button
                onClick={handleSendRecording}
                disabled={disabled || isTranscribing}
                size="lg"
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isTranscribing ? 'Sending...' : 'Send Voice'}
                </span>
              </Button>

              <Button
                onClick={clearRecording}
                disabled={disabled || isTranscribing}
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
        {audioBlob && !isTranscribing && (
          <div className="mt-4 text-center">
            <div className="text-sm text-green-600 font-medium">
              ✓ Recording ready! Click "Send Voice" to send your message.
            </div>
          </div>
        )}

        {isTranscribing && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Processing your voice message...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}
    </div>
  );
};
