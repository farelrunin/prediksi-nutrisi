import pymysql
import os
from dotenv import load_dotenv

# Load database config
load_dotenv()
db_url = os.getenv("DATABASE_URL")
# Parse mysql+pymysql://root:@localhost/nutriai_db
# Simple parsing for this specific format
parts = db_url.split("/")
db_name = parts[-1]
conn_info = parts[-2].replace("mysql+pymysql://", "")
user_pass, host = conn_info.split("@")
user = user_pass.split(":")[0]
password = user_pass.split(":")[1] if ":" in user_pass else ""

try:
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=db_name
    )
    cursor = connection.cursor()
    
    print(f"Mengupdate database {db_name}...")
    
    # List of columns to add
    columns = [
        ("target_calories", "FLOAT"),
        ("target_protein", "FLOAT"),
        ("target_carbs", "FLOAT"),
        ("target_fat", "FLOAT"),
        ("sleep_hours", "FLOAT")
    ]
    
    for col_name, col_type in columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type} NULL")
            print(f"Kolom {col_name} berhasil ditambahkan.")
        except pymysql.err.InternalError as e:
            if e.args[0] == 1060: # Column already exists
                print(f"Kolom {col_name} sudah ada.")
            else:
                print(f"Gagal menambahkan {col_name}: {e}")
                
    connection.commit()
    print("Update database selesai!")
    
except Exception as e:
    print(f"Terjadi kesalahan saat koneksi database: {e}")
finally:
    if 'connection' in locals():
        connection.close()
