import { useState, useRef, useEffect } from 'react';
import { Menu, Dumbbell, Atom, Code2, Utensils } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SuggestionCard from './components/SuggestionCard';
import {type Message } from './types'; // אם יש שגיאה כאן, נסדר את זה מיד

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // גלילה אוטומטית למטה כשיש הודעה חדשה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // פונקציה שמדמה תשובה של AI (זמני, עד שנחבר את השרת האמיתי)
  const simulateResponse = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // חיקוי של זמן חשיבה
    
    const mockResponses = [
      "אני כאן כדי לעזור! הארכיטקטורה החדשה שלך נראית מצוין.",
      "השילוב של React עם Python הוא חזק מאוד ומאפשר גמישות רבה.",
      "העיצוב הכחול הזה הרבה יותר נעים לעין, נכון?",
      "שאלה מצוינת, תן לי רגע לחשוב עליה...",
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const aiMsgId = (Date.now() + 1).toString();
    // יצירת הודעה ריקה שתתמלא
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', timestamp: Date.now() }]);

    // אפקט הקלדה
    for (let i = 0; i <= randomResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, content: randomResponse.substring(0, i) } : msg
        ));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // הוספת הודעת המשתמש
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      await simulateResponse(); // כאן נחליף בעתיד לקריאה לשרת האמיתי
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-[#f8fafc] overflow-hidden font-sans text-right" dir="rtl">
      
      {/* תפריט צד */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        onNewChat={() => setMessages([])} 
      />

      {/* תוכן ראשי */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-[#0f172a]">
        
        {/* כותרת עליונה */}
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-10 bg-[#0f172a]/80 backdrop-blur-md">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
               <Menu size={24} />
             </button>
             <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
                <span className="font-semibold text-lg tracking-tight">Chatene <span className="text-blue-400 font-normal">4o</span></span>
             </div>
           </div>
        </header>

        {/* אזור הצ'אט */}
        <div className="flex-1 overflow-y-auto p-4 md:p-0">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            
            {messages.length === 0 ? (
              // מסך פתיחה (הצעות)
              <div className="flex flex-col items-center justify-center flex-1 space-y-10 min-h-[400px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center ring-1 ring-white/10 shadow-2xl">
                    <Atom size={32} className="text-white" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
                  <SuggestionCard icon={<Dumbbell className="text-emerald-400" />} title="צור תוכנית אימון" subtitle="למתחילים בחדר כושר" onClick={() => setInput("צור תוכנית אימון למתחילים")} />
                  <SuggestionCard icon={<Atom className="text-purple-400" />} title="הסבר מושג" subtitle="מחשוב קוונטי בפשטות" onClick={() => setInput("הסבר לי על מחשוב קוונטי")} />
                  <SuggestionCard icon={<Code2 className="text-blue-400" />} title="כתוב קוד" subtitle="סקריפט Python לאוטומציה" onClick={() => setInput("כתוב סקריפט Python לגיבוי קבצים")} />
                  <SuggestionCard icon={<Utensils className="text-orange-400" />} title="רעיון למתכון" subtitle="ארוחת ערב ב-15 דקות" onClick={() => setInput("תן לי מתכון לארוחת ערב מהירה")} />
                </div>
              </div>
            ) : (
              // רשימת ההודעות
              <div className="flex flex-col gap-6 py-6 pb-32">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* אזור הקלט */}
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