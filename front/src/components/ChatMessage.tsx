import { Sparkles, Copy, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Message } from '../types';

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isUser ? (
        // בועת משתמש
        <div className="max-w-[85%] md:max-w-[70%] bg-[#334155] text-white px-5 py-3 rounded-[20px] rounded-br-md border border-white/5 shadow-sm">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
        </div>
      ) : (
        // בועת AI
        <div className="flex items-start gap-4 max-w-[95%] md:max-w-[85%] group">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#020617] flex-shrink-0 mt-1 shadow-sm">
            <Sparkles size={14} className="text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col gap-1 w-full min-w-0">
            <span className="text-sm font-semibold text-white/90 mb-1">Chatene</span>
            <div className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap font-light">
              {message.content || <span className="animate-pulse">חושב...</span>}
            </div>
            
            {/* כפתורי פעולה */}
            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition"><Copy size={14} /></button>
               <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition"><ThumbsUp size={14} /></button>
               <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition"><ThumbsDown size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}