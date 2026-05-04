import React, { useState } from "react";
import { Download, ExternalLink, Image as ImageIcon, Copy, Check } from "lucide-react";
import { ChatMessage as ChatMessageType, MessageRole, MessageType } from "../types";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: ChatMessageType;
  onImageClick?: (url: string) => void;
  key?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onImageClick }) => {
  const isUser = message.role === MessageRole.USER;
  const isImage = message.type === MessageType.IMAGE;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-8`}
    >
      {isImage ? (
        <div className="max-w-full md:max-w-2xl bg-white border-2 border-black p-2 grainy hard-shadow">
          <div className="p-2 border-b-2 border-black flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">
              {message.metadata?.filename || "IMAGE_OUTPUT.PNG"}
            </span>
            <ImageIcon size={14} />
          </div>
          <img
            src={message.content}
            alt={message.metadata?.alt || "Generated visual"}
            className="w-full h-auto border-b-2 border-black"
          />
          <div className="flex gap-2 p-2 mt-2">
            <button 
              onClick={() => window.location.href = `/api/download?url=${encodeURIComponent(message.content)}`}
              className="flex-1 border-2 border-black py-2 px-4 font-mono uppercase text-xs hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Download
            </button>
            <button 
              onClick={() => onImageClick ? onImageClick(message.content) : window.open(message.content, '_blank')}
              className="flex-1 border-2 border-black py-2 px-4 font-mono uppercase text-xs hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              Open
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`max-w-[80%] bg-white border-2 border-black p-4 grainy ${
            isUser ? "hard-shadow" : ""
          }`}
        >
          <div className="flex justify-between mb-2 border-b border-black pb-1 gap-8 items-center">
            <span className="text-[10px] font-mono uppercase font-bold">
              {isUser ? "USER" : "ImagineAI"}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono opacity-50">
                {message.timestamp}
              </span>
              {!isUser && (
                <button onClick={handleCopy} className="hover:opacity-50 transition-opacity" title="Copy text">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
          <div className="font-sans text-base leading-relaxed break-words prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:border prose-pre:border-black prose-pre:p-2 prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-a:text-blue-600 prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
