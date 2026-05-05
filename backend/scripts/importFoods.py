import json
import os
import sys
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from database import engine, SessionLocal, Base
from models import Food, FoodTranslation

Base.metadata.create_all(bind=engine)

KNOWN_NUTRIENTS = [
    "calories",
    "protein",
    "carbohydrates",
    "total_fat",
    "fat",
    "dietary_fiber",
    "fiber",
    "total_sugars",
    "sugars",
    "sodium",
    "calcium",
    "iron",
    "potassium",
    "vitamin_a",
    "vitamin_c",
    "vitamin_d",
    "water",
    "zinc",
    "cholesterol",
]


def load_cleaned_foods():
    path = ROOT_DIR / "data" / "processed" / "foods_cleaned.csv"
    if not path.exists():
        raise FileNotFoundError(f"Cleaned foods file not found: {path}")
    df = pd.read_csv(path, low_memory=False)
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    return df


def load_translation_map():
    path = ROOT_DIR / "data" / "processed" / "food_translation_cleaned.csv"
    if not path.exists():
        return {}
    df = pd.read_csv(path, low_memory=False)
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    df = df.drop_duplicates(subset=["english_name"])
    return {str(row["english_name"]).strip(): str(row.get("indonesian_name", "")).strip() for _, row in df.iterrows()}


def parse_float(value):
    try:
        return float(value)
    except Exception:
        return None


def create_food_data(row, translation_map):
    food_name_en = str(row.get("food_name_en", "")).strip()
    food_name_id = str(row.get("food_name_id", "")).strip() or translation_map.get(food_name_en, food_name_en)
    extras = {}
    primary = {}

    for key, value in row.items():
        if key in {"source_food_id", "food_name_en", "food_name_id", "alternate_names", "description", "serving_unit", "serving_quantity", "serving_metric_unit", "serving_metric_quantity", "category_id"}:
            continue
        if key in KNOWN_NUTRIENTS:
            primary[key] = parse_float(value)
            continue
        if key.startswith("serving") or key in {"source_food_id", "food_name_en", "food_name_id"}:
            continue
        extras[key] = value if pd.notna(value) else None

    return {
        "source_food_id": str(row.get("source_food_id", "")).strip() if row.get("source_food_id") is not None else None,
        "food_name_en": food_name_en,
        "food_name_id": food_name_id,
        "alternate_names": str(row.get("alternate_names", "")).strip() if row.get("alternate_names") is not None else None,
        "description": str(row.get("description", "")).strip() if row.get("description") is not None else None,
        "serving_unit": str(row.get("serving_unit", "")).strip() if row.get("serving_unit") is not None else None,
        "serving_quantity": parse_float(row.get("serving_quantity")),
        "serving_metric_unit": str(row.get("serving_metric_unit", "")).strip() if row.get("serving_metric_unit") is not None else None,
        "serving_metric_quantity": parse_float(row.get("serving_metric_quantity")),
        **{k: primary.get(k) for k in ["calories", "protein", "carbohydrates", "total_fat", "dietary_fiber", "total_sugars", "sodium", "calcium", "iron", "potassium", "vitamin_a", "vitamin_c", "vitamin_d"]},
        "nutrients_json": {k: v for k, v in extras.items() if v is not None and k not in KNOWN_NUTRIENTS},
    }


def import_foods():
    session = SessionLocal()
    translation_map = load_translation_map()
    data = load_cleaned_foods()
    imported = 0

    try:
        for _, row in data.iterrows():
            record = create_food_data(row, translation_map)
            if not record["food_name_en"]:
                continue

            existing = None
            if record["source_food_id"]:
                existing = session.query(Food).filter(Food.source_food_id == record["source_food_id"]).first()
            if not existing:
                existing = session.query(Food).filter(Food.food_name_en == record["food_name_en"]).first()

            if existing:
                continue

            food = Food(**record)
            session.add(food)
            imported += 1

            if imported % 200 == 0:
                session.flush()

        session.commit()
        print(f"Imported {imported} food records.")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    import_foods()
