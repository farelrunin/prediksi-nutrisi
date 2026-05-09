from database import SessionLocal
from models import Food

db = SessionLocal()
food_count = db.query(Food).count()
print(f"Total foods: {food_count}")

some_foods = db.query(Food).limit(5).all()
for food in some_foods:
    print(f"- {food.food_name_id} ({food.food_name_en})")

db.close()
