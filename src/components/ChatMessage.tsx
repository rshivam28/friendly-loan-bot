import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  className?: string;
}

export const ChatMessage = ({ message, isBot, className }: ChatMessageProps) => {
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