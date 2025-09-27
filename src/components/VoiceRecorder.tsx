import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, Trash2 } from 'lucide-react';
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
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-2">
        {!audioBlob ? (
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={disabled || isTranscribing}
            variant={isRecording ? "destructive" : "outline"}
            size="lg"
            className={cn(
              "rounded-full w-12 h-12 p-0",
              isRecording && "animate-pulse"
            )}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePlayRecording}
              disabled={disabled || isTranscribing}
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleSendRecording}
              disabled={disabled || isTranscribing}
              variant="default"
              size="sm"
              className="px-4"
            >
              {isTranscribing ? "Transcribing..." : "Send Voice"}
            </Button>
            <Button
              onClick={clearRecording}
              disabled={disabled || isTranscribing}
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="text-sm text-muted-foreground">
          Recording... Click to stop
        </div>
      )}

      {audioBlob && !isTranscribing && (
        <div className="text-sm text-green-600">
          Recording ready! Click "Send Voice" to transcribe and send.
        </div>
      )}

      {isTranscribing && (
        <div className="text-sm text-blue-600">
          Transcribing your voice...
        </div>
      )}

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
