import os
from pathlib import Path
from sqlalchemy import create_engine, inspect, text
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in .env")

engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

if "users" not in inspector.get_table_names():
    raise RuntimeError("The users table does not exist in the database.")

existing_columns = {col["name"] for col in inspector.get_columns("users")}
print("Existing users columns:", sorted(existing_columns))

columns_to_add = [
    ("phone", "VARCHAR(20) NULL"),
    ("birth_date", "VARCHAR(50) NULL"),
    ("gender", "VARCHAR(20) NULL"),
    ("height", "FLOAT NULL"),
    ("weight", "FLOAT NULL"),
    ("bmi", "FLOAT NULL"),
    ("activity_level", "VARCHAR(50) NULL"),
    ("nutrition_goal", "VARCHAR(100) NULL"),
    ("is_pregnant", "TINYINT(1) NOT NULL DEFAULT 0"),
    ("pregnancy_month", "INT NULL"),
    ("is_breastfeeding", "TINYINT(1) NOT NULL DEFAULT 0"),
    ("breastfeeding_month", "INT NULL"),
    ("avatar_url", "VARCHAR(255) NULL"),
    ("profile", "JSON NULL"),
    ("created_at", "DATETIME NULL"),
    ("updated_at", "DATETIME NULL"),
]

with engine.connect() as conn:
    for name, ddl in columns_to_add:
        if name in existing_columns:
            print(f"Already present: {name}")
            continue
        sql = f"ALTER TABLE users ADD COLUMN {name} {ddl}"
        try:
            conn.execute(text(sql))
            print(f"Added column: {name}")
        except Exception as err:
            print(f"Failed to add {name}: {err}")

print("Schema migration finished. Restart Uvicorn after this.")
