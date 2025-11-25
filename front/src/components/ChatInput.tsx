import { useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
};

export default function ChatInput({ input, setInput, handleSend, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // שינוי גובה אוטומטי
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full bg-[#0f172a] p-4 border-t border-white/5">
      <div className="max-w-3xl mx-auto relative bg-[#1e293b] rounded-[26px] shadow-lg ring-1 ring-white/10 focus-within:ring-white/20 transition-all">
        
        <button className="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Plus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="שלח הודעה ל-Chatene..."
          rows={1}
          className="w-full bg-transparent text-white placeholder-gray-500 px-12 py-4 max-h-[200px] overflow-y-auto resize-none outline-none text-[15px] leading-relaxed rounded-[26px]"
          dir="rtl"
        />

        <div className="absolute bottom-3 left-3">
           <button 
             onClick={handleSend}
             disabled={!input.trim() || isLoading}
             className={`p-2 rounded-full transition-all duration-200 ${input.trim() ? 'bg-white text-[#0f172a]' : 'bg-transparent text-gray-500 cursor-not-allowed'}`}
           >
             {isLoading ? <div className="w-5 h-5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" /> : <Send size={18} fill={input.trim() ? "currentColor" : "none"} />}
           </button>
        </div>
      </div>
      <p className="text-center text-[11px] text-gray-500 mt-3 font-light">
        Chatene עלול לעשות טעויות. מומלץ לבדוק מידע חשוב.
      </p>
    </div>
  );
}