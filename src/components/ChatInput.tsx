import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface ChatInputProps {
  onSubmit: (value: string | File) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}

export const ChatInput = ({ onSubmit, placeholder, type = "text", disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'file' && fileInputRef.current?.files?.[0]) {
      onSubmit(fileInputRef.current.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setValue("");
    } else if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  if (type === 'file') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="flex-1"
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" disabled={disabled || !value}>
          Upload
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </form>
  );
};