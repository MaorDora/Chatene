// הגדרת המבנה של הודעה בצ'אט
export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
};

// הגדרת המבנה של פריט בהיסטוריה
export type ChatHistoryItem = {
  id: string;
  title: string;
  date: string;
};