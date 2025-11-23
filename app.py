import streamlit as st
from groq import Groq
from PIL import Image  # התיקון: מייבאים מ-PIL ולא מ-Pillow

# --- 1. הגדרות עמוד בסיסיות ---
st.set_page_config(
    page_title="Armored Tech AI",
    page_icon="🛡️",
    layout="wide", # פריסה רחבה כמו ב-ChatGPT
    initial_sidebar_state="expanded"
)

# --- 2. עיצוב CSS מתקדם (הקסם הוויזואלי) ---
# כאן אנחנו "דורסים" את העיצוב של Streamlit
st.markdown("""
    <style>
    /* רקע ראשי - כחול צי כהה */
    .stApp {
        background-color: #021024; /* כחול כהה מאוד */
        color: #FFFFFF;
    }
    
    /* רקע התפריט הצדדי - כחול קצת יותר בהיר */
    [data-testid="stSidebar"] {
        background-color: #052659;
        border-right: 1px solid #1E3A8A;
    }

    /* צבע טקסט כללי - לבן */
    h1, h2, h3, p, div, span {
        color: #FFFFFF !important;
    }
    
    /* תיבת הקלט (Input) למטה */
    .stChatInputContainer {
        padding-bottom: 20px;
    }
    .stChatInput input {
        background-color: #0B3D91 !important; /* כחול בינוני */
        color: white !important;
        border: 1px solid #5483B3;
    }
    
    /* עיצוב בועות הצ'אט */
    /* בועת המשתמש */
    [data-testid="stChatMessage"]:nth-child(odd) {
        background-color: #052659; /* רקע בועה */
        border: 1px solid #1E3A8A;
        border-radius: 10px;
    }
    /* בועת ה-AI */
    [data-testid="stChatMessage"]:nth-child(even) {
        background-color: transparent;
    }

    /* כפתור "צ'אט חדש" בסטייל */
    .stButton button {
        background-color: #5483B3;
        color: white;
        border: none;
        width: 100%;
        border-radius: 5px;
        font-weight: bold;
    }
    .stButton button:hover {
        background-color: #7DA0C4;
    }
    </style>
""", unsafe_allow_html=True)

# --- 3. בניית ה-Sidebar (כמו ב-ChatGPT) ---
with st.sidebar:
    # טעינת הלוגו
    try:
        image = Image.open("assets/logo.jpg")
        st.image(image, use_container_width=True)
    except:
        st.warning("שים את התמונה בתיקיית assets וקרא לה logo.jpg")
    
    st.markdown("### 🛡️ Armored Tech AI")
    
    # כפתור צ'אט חדש
    if st.button("+ צ'אט חדש"):
        st.session_state.messages = []
        st.rerun()
    
    st.markdown("---")
    st.markdown("**היסטוריה (דמו):**")
    # סתם כפתורים כדי שזה ייראה כמו היסטוריה
    st.button("📋 נוהל בדיקת שמן", key="hist1")
    st.button("🔧 חוסרים פלוגה ג'", key="hist2")
    st.button("📦 הזמנת חלפים דחופה", key="hist3")
    
    st.markdown("---")
    st.caption("מערכת לוגיסטית חכמה v1.0")

# --- 4. חיבור למנוע Groq ---
# וודא שיש לך קובץ secrets.toml תקין
try:
    client = Groq(api_key=st.secrets["GROQ_API_KEY"])
except:
    st.error("חסר מפתח API! בדוק את קובץ secrets.toml")
    st.stop()

# --- 5. ניהול הצ'אט הראשי ---

# אתחול זיכרון אם לא קיים
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "אתה מומחה לוגיסטיקה צבאי בשם Armored Tech. ענה בעברית, קצר ולעניין."}
    ]

# הצגת השיחה
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.write(message["content"])

# קלט מהמשתמש
if prompt := st.chat_input("איך אני יכול לעזור לך בלוגיסטיקה היום?"):
    
    # הצגת הודעת משתמש
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    # קבלת תשובה מה-AI עם הזרמה (Streaming)
    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=st.session_state.messages,
            stream=True,
        )
        
        # פונקציית הגנרטור (התיקון שעשינו קודם)
        def generate_text():
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
        
        response = st.write_stream(generate_text())
    
    # שמירה בזיכרון
    st.session_state.messages.append({"role": "assistant", "content": response})