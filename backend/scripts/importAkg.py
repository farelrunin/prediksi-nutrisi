import os
import sys
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from database import engine, SessionLocal, Base
from models import AkgReference

Base.metadata.create_all(bind=engine)

PRIMARY_FIELDS = {
    "calories": "calories",
    "protein": "protein",
    "total_fat": "total_fat",
    "fat": "total_fat",
    "carbohydrates": "carbohydrates",
    "carb": "carbohydrates",
    "dietary_fiber": "dietary_fiber",
    "fiber": "dietary_fiber",
    "water": "water",
    "vitamin_a": "vitamin_a",
    "vitamin_c": "vitamin_c",
    "vitamin_d": "vitamin_d",
    "calcium": "calcium",
    "iron": "iron",
    "zinc": "zinc",
    "sodium": "sodium",
    "potassium": "potassium",
}


def parse_float(value):
    try:
        return float(value)
    except Exception:
        return None


def load_cleaned_akg():
    path = ROOT_DIR / "data" / "processed" / "akg_cleaned.csv"
    if not path.exists():
        raise FileNotFoundError(f"Cleaned AKG file not found: {path}")
    df = pd.read_csv(path, low_memory=False)
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    return df


def build_akg_data(row):
    extras = {}
    mapped = {}
    for key, value in row.items():
        if key in {"age_category", "age_group", "gender", "body_weight", "height", "preg_month_min", "preg_month_max", "bf_month_min", "bf_month_max"}:
            continue
        target = PRIMARY_FIELDS.get(key)
        if target:
            fval = parse_float(value)
            if fval is not None and not pd.isna(fval):
                mapped[target] = fval
            continue
        if not pd.isna(value):
            extras[key] = value

    return {
        "age_category": str(row.get("age_category", "")).strip(),
        "age_group": str(row.get("age_group", "")).strip(),
        "body_weight": parse_float(row.get("body_weight")) if not pd.isna(row.get("body_weight")) else None,
        "height": parse_float(row.get("height")) if not pd.isna(row.get("height")) else None,
        "calories": mapped.get("calories"),
        "protein": mapped.get("protein"),
        "total_fat": mapped.get("total_fat"),
        "carbohydrates": mapped.get("carbohydrates"),
        "dietary_fiber": mapped.get("dietary_fiber"),
        "water": mapped.get("water"),
        "vitamin_a": mapped.get("vitamin_a"),
        "vitamin_c": mapped.get("vitamin_c"),
        "vitamin_d": mapped.get("vitamin_d"),
        "calcium": mapped.get("calcium"),
        "iron": mapped.get("iron"),
        "zinc": mapped.get("zinc"),
        "sodium": mapped.get("sodium"),
        "potassium": mapped.get("potassium"),
        "min_age": int(parse_float(row.get("min_age"))) if parse_float(row.get("min_age")) is not None and not pd.isna(row.get("min_age")) else None,
        "max_age": int(parse_float(row.get("max_age"))) if parse_float(row.get("max_age")) is not None and not pd.isna(row.get("max_age")) else None,
        "preg_month_min": int(parse_float(row.get("preg_month_min"))) if parse_float(row.get("preg_month_min")) is not None and not pd.isna(row.get("preg_month_min")) else None,
        "preg_month_max": int(parse_float(row.get("preg_month_max"))) if parse_float(row.get("preg_month_max")) is not None and not pd.isna(row.get("preg_month_max")) else None,
        "bf_month_min": int(parse_float(row.get("bf_month_min"))) if parse_float(row.get("bf_month_min")) is not None and not pd.isna(row.get("bf_month_min")) else None,
        "bf_month_max": int(parse_float(row.get("bf_month_max"))) if parse_float(row.get("bf_month_max")) is not None and not pd.isna(row.get("bf_month_max")) else None,
        "nutrients_json": {k: v for k, v in extras.items() if v is not None},
    }


def import_akg():
    session = SessionLocal()
    data = load_cleaned_akg()
    imported = 0

    try:
        for _, row in data.iterrows():
            record = build_akg_data(row)
            if not record["age_category"]:
                continue

            existing = session.query(AkgReference).filter(
                AkgReference.age_category == record["age_category"],
                AkgReference.age_group == record["age_group"],
            ).first()
            if existing:
                continue

            reference = AkgReference(**record)
            session.add(reference)
            imported += 1

        session.commit()
        print(f"Imported {imported} AKG reference records.")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    import_akg()
