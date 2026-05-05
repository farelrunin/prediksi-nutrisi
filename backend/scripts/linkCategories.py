import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from database import engine, SessionLocal, Base
from models import Category, Food

def link_categories():
    session = SessionLocal()
    categories = session.query(Category).all()
    
    # Keyword mapping
    mapping = {
        "Protein": ["chicken", "beef", "pork", "fish", "meat", "egg", "turkey", "lamb", "ayam", "daging", "ikan", "telur"],
        "Buah-buahan": ["fruit", "apple", "banana", "orange", "berry", "grape", "melon", "mango", "buah", "pisang", "apel", "jeruk"],
        "Sayuran": ["vegetable", "spinach", "carrot", "broccoli", "tomato", "onion", "garlic", "sayur", "bayam", "wortel", "tomat"],
        "Karbohidrat": ["rice", "bread", "potato", "noodle", "pasta", "oat", "wheat", "nasi", "roti", "kentang", "mie", "pasta"],
        "Masakan Indonesia": ["rendang", "soto", "sate", "padang", "goreng", "bakar", "sambal"],
        "Fast Food": ["burger", "pizza", "fries", "nugget", "hot dog", "mcdonald", "kfc"],
        "Jajanan Pasar": ["kue", "gorengan", "martabak", "snack"],
        "Makanan Instan": ["instant", "canned", "frozen", "microwave"],
        "Menu Sehat": ["salad", "quinoa", "kale", "vegan"],
        "Menu Kafe": ["coffee", "tea", "cake", "latte", "espresso", "kopi", "teh", "pastry"],
    }
    
    # Map category names to IDs
    cat_ids = {c.name: c.id for c in categories}
    
    foods = session.query(Food).all()
    updated_count = 0
    
    for food in foods:
        name_en = str(food.food_name_en).lower()
        name_id = str(food.food_name_id).lower()
        combined = f"{name_en} {name_id}"
        
        assigned = False
        for cat_name, keywords in mapping.items():
            if cat_name not in cat_ids: continue
            
            for keyword in keywords:
                if re.search(rf"\b{keyword}\b", combined):
                    food.category_id = cat_ids[cat_name]
                    assigned = True
                    updated_count += 1
                    break
            
            if assigned:
                break
                
    session.commit()
    print(f"Assigned category to {updated_count} food items out of {len(foods)}.")
    session.close()

if __name__ == "__main__":
    link_categories()
