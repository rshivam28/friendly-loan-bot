import { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export const VoiceAssistant = ({ 
  onMessage,
  isListening,
  setIsListening 
}: { 
  onMessage: (text: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const conversation = useConversation({
    apiKey: "your-eleven-labs-api-key",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // default voice
  });

  useEffect(() => {
    if (isListening) {
      conversation.start();
    } else {
      conversation.stop();
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    conversation.setVolume({ volume: isMuted ? 1 : 0 });
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        className="rounded-full"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Button
        variant={isListening ? "destructive" : "default"}
        size="icon"
        onClick={toggleListening}
        className="rounded-full"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
};