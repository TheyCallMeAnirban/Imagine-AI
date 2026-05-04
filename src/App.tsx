import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import TypingIndicator from "./components/TypingIndicator";
import GalleryView from "./components/GalleryView";
import SettingsView from "./components/SettingsView";
import ImageModal from "./components/ImageModal";
import { ChatMessage as ChatMessageType, MessageRole, MessageType } from "./types";

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem("imagineai_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem("imagineai_chat", JSON.stringify(messages));
  }, [messages]);

  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState<"chat" | "gallery" | "settings">("chat");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      type: MessageType.TEXT,
      content,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const history = messages.slice(-6).map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const modelMessageId = (Date.now() + 1).toString();
      const modelMessage: ChatMessageType = {
        id: modelMessageId,
        role: MessageRole.MODEL,
        type: MessageType.TEXT,
        content: "Initiating neural link...",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, modelMessage]);
      setIsTyping(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "Initiating neural link...";
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'text_chunk') {
                  if (accumulatedText === "Initiating neural link...") accumulatedText = "";
                  accumulatedText += data.content;
                  setMessages(prev => prev.map(m => 
                    m.id === modelMessageId ? { ...m, content: accumulatedText } : m
                  ));
                } else if (data.type === 'system') {
                  accumulatedText = data.content;
                  setMessages(prev => prev.map(m => 
                    m.id === modelMessageId ? { ...m, content: accumulatedText } : m
                  ));
                } else if (data.type === 'image') {

                  setMessages(prev => prev.map(m => 
                    m.id === modelMessageId ? { ...m, content: data.content } : m
                  ));

                  const imageMessage: ChatMessageType = {
                    id: (Date.now() + 2).toString(),
                    role: MessageRole.MODEL,
                    type: MessageType.IMAGE,
                    content: data.image_url,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    metadata: {
                      filename: `IMAGE_OUTPUT_${Date.now()}.PNG`,
                      alt: content
                    }
                  };
                  setMessages(prev => [...prev, imageMessage]);
                } else if (data.type === 'error') {
                  accumulatedText += "\n[SYSTEM ERROR: " + data.content + "]";
                  setMessages(prev => prev.map(m => 
                    m.id === modelMessageId ? { ...m, content: accumulatedText } : m
                  ));
                }
              } catch (e) {
                console.error("Error parsing stream chunk", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Response error:", error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        type: MessageType.TEXT,
        content: "SYSTEM FAILURE: Unable to establish neural link with backend.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem("imagineai_chat");
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentView("chat");
  };

  return (
    <div className="flex h-screen bg-[--color-surface] dot-grid grainy relative overflow-hidden">
      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      
      <div className="relative z-10 hidden md:block">
        <Sidebar 
          onNewChat={handleNewChat} 
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        <Header messageCount={messages.length} onClear={handleClear} />
        
        {currentView === "gallery" ? (
          <GalleryView onImageClick={setSelectedImage} />
        ) : currentView === "settings" ? (
          <SettingsView onClearChat={() => { handleClear(); setCurrentView("chat"); }} />
        ) : (
          <>
            <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full mb-32 overflow-y-auto">
              <div className="space-y-12">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 opacity-20 select-none">
                    <h1 className="text-[12vw] font-black font-display tracking-tighter leading-none text-center">
                      IMAGINE<br />ANYTHING
                    </h1>
                    <p className="font-mono uppercase text-sm mt-4">Analogue Studio System V.1</p>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} onImageClick={setSelectedImage} />
                ))}
                
                {isTyping && <TypingIndicator />}
                
                <div ref={scrollRef} />
              </div>
            </main>

            <ChatInput onSend={handleSend} disabled={isTyping} />
          </>
        )}
      </div>
    </div>
  );
}
