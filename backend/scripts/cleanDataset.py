import os
import re
import sys
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT_DIR / "data" / "raw"
PROCESSED_DIR = ROOT_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

NUMERIC_HINTS = [
    "calorie",
    "protein",
    "fat",
    "carbohydrate",
    "carb",
    "fiber",
    "fibre",
    "sugar",
    "sodium",
    "calcium",
    "iron",
    "potassium",
    "vitamin",
    "water",
    "zinc",
    "cholesterol",
]


def normalize_columns(columns):
    normalized = []
    for col in columns:
        name = str(col).strip().lower()
        name = re.sub(r"[\s\-/\\]+", "_", name)
        name = re.sub(r"[^0-9a-z_]+", "", name)
        name = re.sub(r"_+", "_", name).strip("_")
        normalized.append(name)
    return normalized


def get_numeric_columns(columns):
    return [col for col in columns if any(hint in col for hint in NUMERIC_HINTS)]


def clean_foods():
    path = RAW_DIR / "opennutritionclean_foods.csv"
    if not path.exists():
        print(f"Missing foods file: {path}")
        return

    df = pd.read_csv(path, low_memory=False)
    df.columns = normalize_columns(df.columns)

    if "id" in df.columns and "source_food_id" not in df.columns:
        df = df.rename(columns={"id": "source_food_id"})
    
    if "foodname_100g" in df.columns and "food_name_en" not in df.columns:
        df = df.rename(columns={"foodname_100g": "food_name_en"})

    if "source_food_id" not in df.columns:
        print("Warning: source_food_id not found in foods dataset")

    # Use food_name_en as fallback for food_name_id if not present
    if "food_name_id" not in df.columns and "food_name_en" in df.columns:
        df["food_name_id"] = df["food_name_en"].astype(str)
    elif "food_name_id" not in df.columns:
        df["food_name_id"] = ""

    numeric_columns = [col for col in get_numeric_columns(df.columns) if col in df.columns]
    df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors="coerce")

    if "source_food_id" in df.columns:
        df = df.drop_duplicates(subset=["source_food_id"], keep="first")
    elif "food_name_en" in df.columns:
        df = df.drop_duplicates(subset=["food_name_en"], keep="first")

    # Remove rows where food_name_en is missing
    if "food_name_en" in df.columns:
        df = df[df["food_name_en"].notna() & (df["food_name_en"] != "")]

    output = PROCESSED_DIR / "foods_cleaned.csv"
    df.to_csv(output, index=False)
    print(f"Cleaned foods saved to {output} ({len(df)} rows)")


def clean_translations():
    path = RAW_DIR / "food_translation_id.csv"
    if not path.exists():
        print(f"Missing translation file: {path}")
        return

    df = pd.read_csv(path, low_memory=False)
    df.columns = normalize_columns(df.columns)
    if "english_name" not in df.columns or "indonesian_name" not in df.columns:
        print("Warning: translation dataset requires english_name and indonesian_name")

    df["english_name"] = df["english_name"].astype(str).str.strip()
    df["indonesian_name"] = df["indonesian_name"].astype(str).str.strip()
    df = df.drop_duplicates(subset=["english_name"], keep="first")

    output = PROCESSED_DIR / "food_translation_cleaned.csv"
    df.to_csv(output, index=False)
    print(f"Cleaned translations saved to {output}")


def clean_akg():
    path = RAW_DIR / "akg.csv"
    if not path.exists():
        print(f"Missing AKG file: {path}")
        return

    df = pd.read_csv(path, low_memory=False)
    df.columns = normalize_columns(df.columns)

    numeric_columns = [col for col in get_numeric_columns(df.columns) if col in df.columns]
    df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors="coerce")

    possible_keys = ["age_category", "age_group", "gender", "pregnancy_month", "breastfeeding_month"]
    for key in possible_keys:
        if key in df.columns:
            df[key] = df[key].astype(str).str.strip()

    dedupe_keys = [key for key in ["age_category", "age_group"] if key in df.columns]
    if dedupe_keys:
        df = df.drop_duplicates(subset=dedupe_keys, keep="first")

    output = PROCESSED_DIR / "akg_cleaned.csv"
    df.to_csv(output, index=False)
    print(f"Cleaned AKG saved to {output}")


def main():
    clean_foods()
    clean_translations()
    clean_akg()


if __name__ == "__main__":
    main()
