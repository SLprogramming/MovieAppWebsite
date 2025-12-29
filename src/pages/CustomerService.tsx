import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Send, User, Headset, Paperclip, Smile, MoreVertical, X, FileText } from 'lucide-react';

interface Message {
  id: number;
  text?: string;
  fileName?: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

const CustomerServiceChat = () => {
  const [messages, setMessages] = useState<Message[]>([
  { id: 1, text: "Hello! Welcome to Support. How can we help you today?", sender: 'agent', timestamp: '10:00 AM' },
  { id: 2, text: "Hi, I just bought the VIP package but my account still says 'Standard'.", sender: 'user', timestamp: '10:01 AM' },
  { id: 3, text: "I'm sorry to hear that. Could you please provide your transaction ID?", sender: 'agent', timestamp: '10:01 AM' },
  { id: 4, text: "Sure, let me find it. It was from about 10 minutes ago.", sender: 'user', timestamp: '10:02 AM' },
  { id: 5, text: "No problem. I can wait while you check.", sender: 'agent', timestamp: '10:02 AM' },
  { id: 6, fileName: "receipt_7721.png", text: "Here is the screenshot of my receipt.", sender: 'user', timestamp: '10:04 AM' },
  { id: 7, text: "Thank you. I'm verifying this with our billing department now. Please stay online.", sender: 'agent', timestamp: '10:05 AM' },
  { id: 8, text: "How long does it usually take to update?", sender: 'user', timestamp: '10:07 AM' },
  { id: 9, text: "Usually it's instant, but sometimes there is a delay with the payment gateway sync.", sender: 'agent', timestamp: '10:07 AM' },
  { id: 10, text: "I've just manually refreshed your status. Could you please logout and log back in?", sender: 'agent', timestamp: '10:09 AM' },
  { id: 11, text: "It worked! I see the Premium badge now. Thank you so much!", sender: 'user', timestamp: '10:10 AM' },
  { id: 12, text: "You're very welcome! Is there anything else I can assist you with today?", sender: 'agent', timestamp: '10:11 AM' }
]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue || undefined,
      fileName: selectedFile?.name,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[96%] md:h-full w-full bg-[var(--secondary-bg)] overflow-hidden">
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[var(--primary-bg)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--primary)]/10 rounded-full">
            <Headset size={24} className="text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[var(--text-highlight)] font-semibold text-sm">Live Support</h2>
            <p className="text-[10px] text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Agent Online
            </p>
          </div>
        </div>
        <button className="text-[var(--text)] hover:text-[var(--text-highlight)] transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* --- Chat Messages --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                ${msg.sender === 'user' ? 'bg-[var(--primary)] text-black' : 'bg-gray-700 text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Headset size={16} />}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[var(--primary)] text-black rounded-tr-none' 
                    : 'bg-[var(--primary-bg)] text-[var(--text)] rounded-tl-none border border-gray-800'
                }`}>
                  {msg.fileName && (
                    <div className="flex items-center gap-2 mb-1 p-2 bg-black/10 rounded-lg border border-black/5">
                      <FileText size={16} />
                      <span className="text-xs font-medium truncate max-w-[150px]">{msg.fileName}</span>
                    </div>
                  )}
                  {msg.text}
                </div>
                <p className={`text-[10px] text-[var(--text)] opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Input Area --- */}
      <div className="p-4 bg-[var(--primary-bg)] border-t border-gray-800">
        
        {/* File Preview Bubble */}
        {selectedFile && (
          <div className="mb-2 flex items-center justify-between bg-[var(--secondary-bg)] p-2 px-3 rounded-lg border border-[var(--primary)] w-fit min-w-[200px]">
            <div className="flex items-center gap-2 text-[var(--text-highlight)]">
              <FileText size={16} className="text-[var(--primary)]" />
              <span className="text-xs truncate max-w-[150px]">{selectedFile.name}</span>
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              className="text-[var(--text)] hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[var(--secondary-bg)] rounded-xl px-4 py-2 border border-gray-700 focus-within:border-[var(--primary)] transition-all">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className={`transition-colors ${selectedFile ? 'text-[var(--primary)]' : 'text-[var(--text)] hover:text-[var(--primary)]'}`}
          >
            <Paperclip size={20} />
          </button>
          
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedFile ? "Add a caption..." : "Type your message..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--text-highlight)] text-sm py-2 outline-none"
          />

          <div className="flex items-center gap-2">
            <button type="button" className="hidden sm:block text-[var(--text)] hover:text-[var(--primary)] transition-colors">
              <Smile size={20} />
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim() && !selectedFile}
              className="p-2 bg-[var(--primary)] text-black rounded-lg disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerServiceChat;