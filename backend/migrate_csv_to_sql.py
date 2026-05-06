import os
import sys
import pandas as pd
from sqlalchemy.orm import Session
from pathlib import Path

# Setup paths
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from database import engine, SessionLocal, Base
from models import Food, AkgReference

# Create tables if not exist
Base.metadata.create_all(bind=engine)

def migrate_foods():
    print("Migrating foods...")
    csv_path = BACKEND_DIR / "data" / "raw" / "opennutritionclean_foods.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    df = pd.read_csv(csv_path, low_memory=False)
    db = SessionLocal()
    
    try:
        # Clear existing foods to avoid "corrupt" or duplicate data as requested
        # db.query(Food).delete() 
        
        imported = 0
        for _, row in df.iterrows():
            # Check if exists
            food_name = str(row.get('foodname_100g', '')).strip()
            if not food_name:
                continue
                
            existing = db.query(Food).filter(Food.food_name_id == food_name).first()
            if existing:
                continue

            # Extract main nutrients
            food_obj = Food(
                source_food_id=str(row.get('id', '')),
                food_name_en=food_name,
                food_name_id=food_name,
                alternate_names=str(row.get('alternate_names', '')),
                description=str(row.get('description', '')),
                serving_unit=str(row.get('serving', '')),
                calories=float(row.get('calories', 0)) if pd.notna(row.get('calories')) else 0,
                protein=float(row.get('protein', 0)) if pd.notna(row.get('protein')) else 0,
                carbohydrates=float(row.get('carbohydrates', 0)) if pd.notna(row.get('carbohydrates')) else 0,
                total_fat=float(row.get('total_fat', 0)) if pd.notna(row.get('total_fat')) else 0,
                dietary_fiber=float(row.get('dietary_fiber', 0)) if pd.notna(row.get('dietary_fiber')) else 0,
                total_sugars=float(row.get('total_sugars', 0)) if pd.notna(row.get('total_sugars')) else 0,
                sodium=float(row.get('sodium', 0)) if pd.notna(row.get('sodium')) else 0,
                calcium=float(row.get('calcium', 0)) if pd.notna(row.get('calcium')) else 0,
                iron=float(row.get('iron', 0)) if pd.notna(row.get('iron')) else 0,
                potassium=float(row.get('potassium', 0)) if pd.notna(row.get('potassium')) else 0,
                vitamin_a=float(row.get('vitamin_a', 0)) if pd.notna(row.get('vitamin_a')) else 0,
                vitamin_c=float(row.get('vitamin_c', 0)) if pd.notna(row.get('vitamin_c')) else 0,
                vitamin_d=float(row.get('vitamin_d', 0)) if pd.notna(row.get('vitamin_d')) else 0,
                nutrients_json={} # Optional: store remaining columns
            )
            db.add(food_obj)
            imported += 1
            
            if imported % 500 == 0:
                db.commit()
                print(f"Imported {imported} foods...")
        
        db.commit()
        print(f"Successfully imported {imported} food records.")
    except Exception as e:
        db.rollback()
        print(f"Error migrating foods: {e}")
    finally:
        db.close()

def migrate_akg():
    print("Migrating AKG references...")
    csv_path = BACKEND_DIR / "data" / "raw" / "akg.csv"
    if not csv_path.exists():
        print(f"File not found: {csv_path}")
        return

    df = pd.read_csv(csv_path)
    db = SessionLocal()
    
    try:
        db.query(AkgReference).delete()
        
        imported = 0
        for _, row in df.iterrows():
            akg_obj = AkgReference(
                age_category=str(row.get('age_category', '')),
                age_group=str(row.get('age_group', '')),
                body_weight=float(row.get('body_weight', 0)) if pd.notna(row.get('body_weight')) else 0,
                height=float(row.get('height', 0)) if pd.notna(row.get('height')) else 0,
                calories=float(row.get('calories', 0)) if pd.notna(row.get('calories')) else 0,
                protein=float(row.get('protein', 0)) if pd.notna(row.get('protein')) else 0,
                total_fat=float(row.get('total_fat', 0)) if pd.notna(row.get('total_fat')) else 0,
                carbohydrates=float(row.get('carbohydrates', 0)) if pd.notna(row.get('carbohydrates')) else 0,
                dietary_fiber=float(row.get('dietary_fiber', 0)) if pd.notna(row.get('dietary_fiber')) else 0,
                water=float(row.get('water', 0)) if pd.notna(row.get('water')) else 0,
                vitamin_a=float(row.get('vitamin_a', 0)) if pd.notna(row.get('vitamin_a')) else 0,
                vitamin_c=float(row.get('vitamin_c', 0)) if pd.notna(row.get('vitamin_c')) else 0,
                vitamin_d=float(row.get('vitamin_d', 0)) if pd.notna(row.get('vitamin_d')) else 0,
                calcium=float(row.get('calcium', 0)) if pd.notna(row.get('calcium')) else 0,
                iron=float(row.get('iron', 0)) if pd.notna(row.get('iron')) else 0,
                zinc=float(row.get('zinc', 0)) if pd.notna(row.get('zinc')) else 0,
                sodium=float(row.get('sodium', 0)) if pd.notna(row.get('sodium')) else 0,
                potassium=float(row.get('potassium', 0)) if pd.notna(row.get('potassium')) else 0,
                min_age=int(row.get('min_age', 0)) if pd.notna(row.get('min_age')) else 0,
                max_age=int(row.get('max_age', 0)) if pd.notna(row.get('max_age')) else 0,
                preg_month_min=int(row.get('preg_month_min', 0)) if pd.notna(row.get('preg_month_min')) else 0,
                preg_month_max=int(row.get('preg_month_max', 0)) if pd.notna(row.get('preg_month_max')) else 0,
                bf_month_min=int(row.get('bf_month_min', 0)) if pd.notna(row.get('bf_month_min')) else 0,
                bf_month_max=int(row.get('bf_month_max', 0)) if pd.notna(row.get('bf_month_max')) else 0,
            )
            db.add(akg_obj)
            imported += 1
            
        db.commit()
        print(f"Successfully imported {imported} AKG records.")
    except Exception as e:
        db.rollback()
        print(f"Error migrating AKG: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_foods()
    migrate_akg()
