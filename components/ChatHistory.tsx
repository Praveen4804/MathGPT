import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import GameLoading from './GameLoading';
import AIAvatar from './AIAvatar';
import { CopyIcon, CheckIcon } from './IconComponents';

interface ChatHistoryProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

const ImageMessage: React.FC<{ src: string }> = ({ src }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  return (
    <div className="relative group inline-block mt-2">
      <img 
        src={src} 
        alt="Solution" 
        className="rounded-lg max-w-full h-auto border border-gray-100 shadow-sm" 
      />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm shadow-sm"
        title="Copy Image"
      >
        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
      </button>
    </div>
  );
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const renderMessageContent = (message: ChatMessage) => {
    const isSuccessImage = message.role === 'model' && message.content.startsWith('data:image/');
    
    if (isSuccessImage) {
      return <ImageMessage src={message.content} />;
    }
    
    const isError = message.role === 'model' && message.content.toLowerCase().includes('error');
    if (isError) {
        return <p className="text-red-600 whitespace-pre-wrap">{message.content}</p>;
    }

    return <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{message.content}</p>;
  };

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8">
        {chatHistory.map(message => (
          <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             
             {message.role === 'model' && (
               <div className="w-8 h-8 flex-shrink-0 mt-1">
                 <AIAvatar />
               </div>
             )}

            <div 
               className={`max-w-xl ${message.role === 'user' 
                 ? 'bg-gray-100 text-gray-900 rounded-3xl rounded-tr-sm px-5 py-3' 
                 : 'bg-transparent text-gray-900 w-full'
               }`}
            >
              {message.role === 'user' && message.image && (
                <img src={message.image} alt="User upload" className="rounded-lg mb-3 max-w-xs max-h-64 border border-gray-200" />
              )}
              
              {message.role === 'model' ? (
                  <div className="prose prose-slate max-w-none">
                      {renderMessageContent(message)}
                  </div>
              ) : (
                  <div className="text-sm sm:text-base">
                      {renderMessageContent(message)}
                  </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <AIAvatar />
            </div>
            <div className="max-w-xl pt-2">
              <GameLoading />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatHistory;