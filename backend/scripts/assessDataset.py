import json
import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT_DIR / "data" / "raw"
PROCESSED_DIR = ROOT_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

FILES = {
    "foods": {
        "filename": "opennutritionclean_foods.csv",
        "required_columns": ["source_food_id", "food_name_en", "food_name_id"],
    },
    "translations": {
        "filename": "food_translation_id.csv",
        "required_columns": ["english_name", "indonesian_name"],
    },
    "akg": {
        "filename": "akg.csv",
        "required_columns": ["age_category", "gender", "age_group"],
    },
}


def load_csv(path: Path):
    return Path(path).exists() and __import__("pandas").read_csv(path, low_memory=False) or None


def analyze_dataframe(df, required_columns):
    missing_by_column = df.isna().sum().to_dict()
    duplicate_count = int(df.duplicated().sum())
    required_missing = [col for col in required_columns if col not in df.columns]
    sample = df.head(5).to_dict(orient="records")
    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "missing_values": int(df.isna().sum().sum()),
        "missing_by_column": missing_by_column,
        "duplicate_rows": duplicate_count,
        "required_columns_present": len(required_missing) == 0,
        "missing_required_columns": required_missing,
        "data_types": df.dtypes.apply(lambda dt: str(dt)).to_dict(),
        "sample_rows": sample,
    }


def main():
    report = {
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "source_directory": str(RAW_DIR),
        "processed_directory": str(PROCESSED_DIR),
        "files": {},
    }

    for key, info in FILES.items():
        path = RAW_DIR / info["filename"]
        if not path.exists():
            report["files"][key] = {
                "error": "file_not_found",
                "path": str(path),
            }
            continue

        df = __import__("pandas").read_csv(path, low_memory=False)
        report["files"][key] = analyze_dataframe(df, info["required_columns"])

        if key == "foods":
            report["files"][key]["duplicate_by_source_food_id"] = int(
                df.duplicated(subset=[col for col in ["source_food_id", "food_name_en"] if col in df.columns]).sum()
            )

    out_path = PROCESSED_DIR / "assessment_report.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Assessment complete. Report saved to {out_path}")


if __name__ == "__main__":
    main()
