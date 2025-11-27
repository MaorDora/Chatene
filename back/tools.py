import json
from collections import Counter
from database import tanks_db

# --- פונקציות הלוגיקה ---

def get_tank_details(tank_id: str):
    """מחזירה את כל המידע על טנק לפי מספר צ'"""
    for tank in tanks_db:
        if tank["id"] == tank_id:
            return json.dumps(tank, ensure_ascii=False)
    return json.dumps({"error": "Tank not found"}, ensure_ascii=False)

def get_all_tanks():
    """
    במקום להחזיר את כל הרשימה (שקורסת בגלל מגבלת טוקנים),
    הפונקציה הזו מחשבת סטטיסטיקות ומחזירה סיכום.
    """
    total_tanks = len(tanks_db)
    status_counts = Counter(tank["status"] for tank in tanks_db)
    model_counts = Counter(tank["model"] for tank in tanks_db)
    location_counts = Counter(tank["location"] for tank in tanks_db)
    summary_report = {
        "total_count": total_tanks,
        "breakdown_by_status": dict(status_counts),
        "breakdown_by_model": dict(model_counts),
        "breakdown_by_location": dict(location_counts),
        "note": "This is a statistical summary. For specific tank details, use get_tank_details with an ID."
    }
    
    return json.dumps(summary_report, ensure_ascii=False)



tools_schema = [
    {
        "type": "function",
        "function": {
            "name": "get_tank_details",
            "description": "Get full technical details for a specific tank by ID (e.g. 800001).",
            "parameters": {
                "type": "object",
                "properties": {
                    "tank_id": {"type": "string", "description": "The tank ID"}
                },
                "required": ["tank_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_tanks",
            "description": "Get general statistics about the fleet: total count, status breakdown, model distribution, etc. Use this for 'how many' questions.",
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    }
]

available_functions = {
    "get_tank_details": get_tank_details,
    "get_all_tanks": get_all_tanks
}