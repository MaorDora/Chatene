import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# 1. טעינת המפתח הסודי מהקובץ .env
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

# בדיקה שהמפתח קיים
if not api_key:
    print("Error: GROQ_API_KEY not found in .env file")

# 2. חיבור ל-Groq
client = Groq(api_key=api_key)

app = FastAPI()

# 3. הגדרת הרשאות (כדי שה-React יוכל לגשת לכאן)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# הגדרת מבנה הנתונים שאנחנו מצפים לקבל מהאתר
class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "Armored Tech Brain is Active 🧠"}

# 4. נקודת הקצה (Endpoint) שמטפלת בצ'אט
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    
    # הגדרת השיחה ל-Groq
    messages = [
        {"role": "system", "content": "אתה מומחה לוגיסטיקה צבאי בשם Armored Tech. ענה בעברית, קצר ולעניין."},
        {"role": "user", "content": request.message}
    ]

    # פונקציה שמייצרת את התשובה בחלקים (Streaming)
    def generate():
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            stream=True,
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    # החזרת התשובה כזרם (Stream)
    return StreamingResponse(generate(), media_type="text/plain")