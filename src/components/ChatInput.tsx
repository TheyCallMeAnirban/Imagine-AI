import { Send, Paperclip } from "lucide-react";
import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t-2 border-black p-4 z-40">
      <div className="max-w-5xl mx-auto flex gap-4 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            className="w-full border-2 border-black bg-white p-4 font-sans focus:border-4 outline-none placeholder:text-black placeholder:opacity-50 transition-all disabled:opacity-50 resize-none overflow-y-auto"
            placeholder="Tell ImagineAI something..."
          />
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-black text-white p-4 h-[60px] border-2 border-black flex items-center justify-center hover:bg-white hover:text-black transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} fill="currentColor" />
        </button>
        <button 
           disabled={disabled}
           className="border-2 border-black p-4 h-[60px] flex items-center justify-center hover:bg-black hover:text-white transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>
      </div>
    </footer>
  );
}
