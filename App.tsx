import React, { useState, useEffect } from 'react';
import { generateSolutionImage } from './services/geminiService';
import { ChatMessage } from './types';
import ChatHistory from './components/ChatHistory';
import UserInput from './components/UserInput';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    setChatHistory([
        {
            id: 'initial',
            role: 'model',
            content: "Hello. I can help you solve mathematical problems. Upload an image or type your question."
        }
    ]);
  }, []);

  const handleSend = async (text: string, image?: File) => {
    if (!text && !image) return;
    
    const promptText = text || "Solve the problem in the image.";

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
      ...(image && { image: URL.createObjectURL(image) })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await generateSolutionImage(promptText, image);
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `data:image/png;base64,${result}`,
      };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      const modelError: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `I encountered an error. ${errorMessage}`
      };
      setChatHistory(prev => [...prev, modelError]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 font-sans">
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          Math GPT
        </h1>
        {/* Optional: Add a simple model selector or settings icon here if needed in future */}
      </header>
      
      <ChatHistory chatHistory={chatHistory} isLoading={isLoading} />
      
      <UserInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;