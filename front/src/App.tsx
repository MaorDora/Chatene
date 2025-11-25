import { useState, useRef, useEffect } from 'react';
import { Menu, Wrench, ShieldAlert, ClipboardList, Hammer, Zap } from 'lucide-react'; // החלפנו לאייקונים של אחזקה
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SuggestionCard from './components/SuggestionCard';
import {type Message } from './types'; 

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRealResponse = async (userText: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.body) return;

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', timestamp: Date.now() }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: accumulatedText } : msg
        ));
      }

    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'ai', 
        content: '⚠️ שגיאה: לא הצלחתי להתחבר לשרת. וודא שחלון הטרמינל של הפייתון פתוח ורץ.', 
        timestamp: Date.now() 
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await fetchRealResponse(userMsg.content);
    
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-[#f8fafc] overflow-hidden font-sans text-right" dir="rtl">
      
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        onNewChat={() => setMessages([])} 
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-[#0f172a]">
        
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-10 bg-[#0f172a]/80 backdrop-blur-md">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
               <Menu size={24} />
             </button>
             <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
                {/* שינוי שם המותג ל-Chatene */}
                <span className="font-semibold text-lg tracking-tight">Chatene <span className="text-blue-400 font-normal">AI</span></span>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-0">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-10 min-h-[400px]">
                {/* אייקון מרכזי של מפתח ברגים */}
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center ring-1 ring-white/10 shadow-2xl">
                    <Wrench size={32} className="text-white" />
                </div>
                
                {/* כרטיסי הצעות חדשים בנושאי אחזקה */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
                  <SuggestionCard 
                    icon={<ClipboardList className="text-emerald-400" />} 
                    title="נוהל טיפול שבועי" 
                    subtitle="רשימת תיוג לטיפול בטנק" 
                    onClick={() => setInput("מהו נוהל הטיפול השבועי המומלץ לטנק?")} 
                  />
                  <SuggestionCard 
                    icon={<Wrench className="text-blue-400" />} 
                    title="אבחון תקלה" 
                    subtitle="רעשים מהמנוע בעת הנעה" 
                    onClick={() => setInput("יש רעש חריג מהמנוע בזמן הנעה, מה הסיבות האפשריות?")} 
                  />
                  <SuggestionCard 
                    icon={<ShieldAlert className="text-red-400" />} 
                    title="בטיחות בחשמל" 
                    subtitle="עבודה עם מצברים במתח גבוה" 
                    onClick={() => setInput("מהם דגשי הבטיחות בעבודה עם מצברים?")} 
                  />
                  <SuggestionCard 
                    icon={<Hammer className="text-orange-400" />} 
                    title="החלפת זחל" 
                    subtitle="שלבים ודגשים טכניים" 
                    onClick={() => setInput("תאר לי את השלבים להחלפת זחל פגום")} 
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 py-6 pb-32">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <ChatInput 
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
        />

      </main>
    </div>
  );
}