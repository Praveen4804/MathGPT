import React, { useState, useRef } from 'react';
import { PaperclipIcon, SendIcon } from './IconComponents';

interface UserInputProps {
  onSend: (text: string, file?: File) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      event.target.value = ''; // Reset file input
    }
  };

  const handleSendClick = () => {
    if (isLoading || (!text.trim() && !imageFile)) return;
    onSend(text, imageFile);
    setText('');
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  return (
    <footer className="p-4 bg-white">
      <div className="max-w-3xl mx-auto w-full">
        {imagePreviewUrl && (
          <div className="relative inline-block mb-3">
            <img src={imagePreviewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200 shadow-sm" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-md hover:bg-gray-700"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors mb-0.5"
            aria-label="Attach image"
            disabled={isLoading}
          >
            <PaperclipIcon className="w-6 h-6" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Math GPT..."
              className="w-full bg-transparent border border-gray-300 rounded-2xl p-3 px-4 text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder-gray-400 shadow-sm"
              rows={1}
              disabled={isLoading}
              style={{ maxHeight: '150px', minHeight: '48px' }}
            />
          </div>

          <button
            onClick={handleSendClick}
            disabled={isLoading || (!text.trim() && !imageFile)}
            className="p-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-sm mb-0.5"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
            <span className="text-xs text-gray-400">Math GPT can make mistakes. Check important info.</span>
        </div>
      </div>
    </footer>
  );
};

export default UserInput;