import os
import json
import traceback  # הוספנו את זה כדי לראות שגיאות מלאות
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# ייבוא הכלים
from tools import tools_schema, available_functions

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    print(f"\n--- New Request: {request.message} ---") # הדפסה לתחילת בקשה
    
    messages = [
        {"role": "system", "content": "You are Armored Tech AI. Answer in Hebrew."},
        {"role": "user", "content": request.message}
    ]

    try:
        # שלב 1: שולחים למודל
        print("Sending request to LLM...")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=tools_schema, 
            tool_choice="auto",
            max_tokens=4096
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # אם המודל רוצה להפעיל כלים
        if tool_calls:
            print(f"LLM requested {len(tool_calls)} tools.")
            messages.append(response_message)

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                raw_args = tool_call.function.arguments
                print(f"Executing tool: {function_name} with args: {raw_args}")
                
                function_args = {}
                # תיקון וניקוי ארגומנטים
                if raw_args:
                    try:
                        loaded_args = json.loads(raw_args)
                        if loaded_args is not None:
                            function_args = loaded_args
                    except Exception as e:
                        print(f"Error parsing JSON args: {e}")

                # בדיקה והרצה
                if function_name in available_functions:
                    function_to_call = available_functions[function_name]
                    
                    try:
                        # הרצת הפונקציה המוגנת
                        function_response = function_to_call(**function_args)
                        print(f"Tool Result: {function_response[:50]}...") # מדפיס רק את ההתחלה שלא יציף
                    except Exception as e:
                        print(f"ERROR inside the tool function: {e}")
                        traceback.print_exc() # מדפיס את השגיאה המלאה לטרמינל
                        function_response = json.dumps({"error": str(e)})
                    
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    })
                else:
                    print(f"Warning: Tool {function_name} not found in available_functions!")

            # שלב 3: הזרמת התשובה
            print("Streaming final response...")
            def generate():
                stream = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    stream=True,
                )
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        yield chunk.choices[0].delta.content

            return StreamingResponse(generate(), media_type="text/plain")

        # אם אין כלים
        else:
            print("No tools needed, streaming simple response...")
            def generate_simple():
                stream = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    stream=True
                )
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        yield chunk.choices[0].delta.content

            return StreamingResponse(generate_simple(), media_type="text/plain")

    except Exception as e:
        # תופס כל שגיאה כללית כדי שהשרת לא יקרוס
        print("CRITICAL ERROR IN ENDPOINT:")
        traceback.print_exc()
        # מחזיר הודעת שגיאה מסודרת לצ'אט במקום שהאתר יקרוס
        return StreamingResponse(iter([f"Error: {str(e)}"]), media_type="text/plain")