# back/database.py
import json

def load_tanks_data():
    try:
        with open("tanks_db.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: tanks_db.json not found.")
        return []

# משתנה גלובלי שהקבצים האחרים ייבאו
tanks_db = load_tanks_data()