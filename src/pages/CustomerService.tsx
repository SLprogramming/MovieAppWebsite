import React, { useState, useEffect, useRef  , type ChangeEvent, useMemo} from 'react';
import { Send, User, Headset, Paperclip, Smile, MoreVertical, X, FileText } from 'lucide-react';
import { messageSocket } from '../socket';
import { useAuthStore } from '../store/user';
import { useMessageStore , type ChatMessage}   from '../store/message';
import { formatApiResponseMessage, formatChatTime, generateUniqueId } from '../tools/helper';



const CustomerServiceChat = () => {
  const {messages,conversations,fetchConversation,addMessage,fetchMessages,updateMessage,addConversation} = useMessageStore()

  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authStore = useAuthStore()


 useEffect(() => {

  messageSocket.on('message:new',(data:any) => {
    console.log("New message received:",data)
    let newMessage = formatApiResponseMessage([data])[0]
    addMessage(newMessage)
  })
  messageSocket.on("conversation:new",(data:any) => {
    console.log("New conversation started:",data)
   addConversation(data)
  });
  messageSocket.on("message:saved",(data:any) => {
    console.log("message saved:",data)
    updateMessage(data)
   
  });
    fetchConversation(authStore.user?._id || '')
   
    return () =>{
      messageSocket.off("message:new")
      messageSocket.off("message:saved")
      messageSocket.off("conversation:new")
    }
 }, []);

 useEffect(() => {

     if(conversations.length > 0){
      console.log('hello')
     fetchMessages(conversations[0]?._id)
  }
  },[conversations.length]);



 
 

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
    const client_id = generateUniqueId()
    messageSocket.emit('message:new',{sender_id:authStore.user?._id, message:inputValue ,conversation_id:conversations[0]?._id , client_id})
    const newMessage :ChatMessage= {
      id:client_id,
      text: inputValue ,
      fileName: selectedFile?.name || null,
      sender_id: authStore.user?._id || '',
      timestamp: new Date().toISOString(),
      status:"sending"
    };
    addMessage(newMessage);
    // setMessages([...messages, newMessage]);
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  
  return (
    <div className="flex flex-col h-[96%] md:h-full w-full bg-[var(--secondary-bg)] overflow-hidden">
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[var(--primary-bg)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--cyan)]/10 rounded-full">
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
          <div key={msg?.id} className={`flex ${msg?.sender_id == authStore.user?._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg?.sender_id == authStore.user?._id ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                ${msg?.sender_id == authStore.user?._id ? 'bg-[var(--cyan)] text-black' : 'bg-gray-700 text-white'}`}>
                {msg?.sender_id == authStore.user?._id ? <User size={16} /> : <Headset size={16} />}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl text-sm ${
                  msg?.sender_id == authStore.user?._id 
                    ? 'bg-[var(--cyan)] text-black rounded-tr-none' 
                    : 'bg-[var(--primary-bg)] text-[var(--text)] rounded-tl-none border border-gray-800'
                }`}>
                  {/* {msg.fileName && (
                    <div className="flex items-center gap-2 mb-1 p-2 bg-black/10 rounded-lg border border-black/5">
                      <FileText size={16} />
                      <span className="text-xs font-medium truncate max-w-[150px]">{msg.fileName}</span>
                    </div>
                  )} */}
                  {msg?.text && <p>{msg.text}</p>}
                 
                </div>
                <p className={`text-[10px] text-[var(--text)] opacity-50 ${msg?.sender_id == authStore.user?._id ? 'text-right' : 'text-left'}`}>
                  {formatChatTime(msg.timestamp)}
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
          <div className="mb-2 flex items-center justify-between bg-[var(--secondary-bg)] p-2 px-3 rounded-lg border border-[var(--cyan)] w-fit min-w-[200px]">
            <div className="flex items-center gap-2 text-[var(--text-highlight)]">
              <FileText size={16} className="text-[var(--cyan)]" />
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

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[var(--secondary-bg)] rounded-xl px-4 py-2 border border-gray-700 focus-within:border-[var(--cyan)] transition-all">
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
            className={`transition-colors ${selectedFile ? 'text-[var(--cyan)]' : 'text-[var(--text)] hover:text-[var(--cyan)]'}`}
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
            <button type="button" className="hidden sm:block text-[var(--text)] hover:text-[var(--cyan)] transition-colors">
              <Smile size={20} />
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim() && !selectedFile}
              className="p-2 bg-[var(--cyan)] text-black rounded-lg disabled:opacity-80 hover:scale-105 active:scale-95 transition-all"
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