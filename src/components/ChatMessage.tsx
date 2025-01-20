import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useConversation } from "@11labs/react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  className?: string;
}

export const ChatMessage = ({ message, isBot, className }: ChatMessageProps) => {
  const conversation = useConversation({
    overrides: {
      tts: {
        voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
      }
    }
  });

  useEffect(() => {
    if (isBot) {
      // Convert bot messages to speech
      conversation.startSession({
        agentId: "your-agent-id"
      }).then(() => {
        // Send the message to be spoken
        conversation.setVolume({ volume: 1 });
      });
    }
  }, [message, isBot, conversation]);

  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in",
        isBot ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] shadow-sm",
          isBot
            ? "bg-primary-100 text-gray-800"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message}
      </div>
    </div>
  );
};