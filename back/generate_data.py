import json
import random
from datetime import datetime, timedelta

# הגדרות כלליות
TANK_MODELS = ["מרכבה סימן 4", "מרכבה סימן 3", "נמ\"ר", "איתן"]
LOCATIONS = ["מחסן צפון", "מחסן דרום", "סדנא מרכזית", "בשטח כינוס", "בבסיס האם"]
STATUSES = ["כשיר", "מושבת", "בטיפול", "ממתין לחלפים"]
ORDER_TYPES = ["טיפול שבועי", "תקלה משביתה", "החלפת זחל", "טיפול 10,000", "התקנת מיגון"]
URGENCY = ["רגיל", "דחוף", "חירום (מיידי)"]

def generate_tanks_db():
    tanks = []
    
    # 1. יצירת 150 טנקים
    for i in range(1, 500):
        tank_id = 800000 + i  # צ'ים מדומים (למשל 800001)
        model = random.choice(TANK_MODELS)
        status = random.choice(STATUSES)
        
        # אם הטנק כשיר, הכשירות היא 100%, אחרת נמוכה יותר
        competence = 100 if status == "כשיר" else random.randint(0, 80)
        
        tank = {
            "id": str(tank_id),
            "model": model,
            "status": status,
            "location": random.choice(LOCATIONS),
            "competence_percentage": competence,
            "is_emergency_ready": competence > 85,  # כשיר לחירום רק מעל 85%
            "last_maintenance": (datetime.now() - timedelta(days=random.randint(1, 365))).strftime("%Y-%m-%d"),
            "orders": []  # רשימת הזמנות ריקה שתתמלא בהמשך
        }
        tanks.append(tank)

    # 2. יצירת 160 הזמנות טיפול ופיזורן בין הטנקים
    for i in range(1, 1000):
        order_id = f"ORD-{1000+i}"
        random_tank = random.choice(tanks)
        
        order = {
            "order_id": order_id,
            "type": random.choice(ORDER_TYPES),
            "description": f"דיווח על {random.choice(['רעש במנוע', 'נזילת שמן', 'בעיה במערכת בקרת אש', 'חוסר במים', 'זחל קרוע'])}",
            "status": random.choice(["פתוח", "בטיפול", "הסתיים", "ממתין לאישור"]),
            "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            "urgency": random.choice(URGENCY),
            "required_parts": random.randint(1, 10) # כמות חלקים נדרשת
        }
        
        # הוספת ההזמנה לטנק הספציפי
        random_tank["orders"].append(order)

    # שמירה לקובץ JSON
    with open("tanks_db.json", "w", encoding="utf-8") as f:
        json.dump(tanks, f, ensure_ascii=False, indent=2)

    print(f"Created tanks_db.json with {len(tanks)} tanks and orders distributed successfully.")

if __name__ == "__main__":
    generate_tanks_db()