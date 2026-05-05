import os
import sys
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from database import engine, SessionLocal, Base
from models import FoodTranslation

Base.metadata.create_all(bind=engine)


def load_cleaned_translations():
    path = ROOT_DIR / "data" / "processed" / "food_translation_cleaned.csv"
    if not path.exists():
        raise FileNotFoundError(f"Cleaned translation file not found: {path}")

    df = pd.read_csv(path, low_memory=False)
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    return df


def import_translations():
    df = load_cleaned_translations()
    session = SessionLocal()
    imported = 0
    try:
        for _, row in df.iterrows():
            english_name = str(row.get("english_name", "")).strip()
            indonesian_name = str(row.get("indonesian_name", "")).strip()
            if not english_name or not indonesian_name:
                continue

            translation = session.query(FoodTranslation).filter(FoodTranslation.english_name == english_name).first()
            if translation:
                translation.indonesian_name = indonesian_name
                continue

            translation = FoodTranslation(
                english_name=english_name,
                indonesian_name=indonesian_name,
            )
            session.add(translation)
            imported += 1

        session.commit()
        print(f"Imported {imported} translation records.")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    import_translations()
