import pandas as pd
import json
import os

def audit_csv():
    csv_path = 'data/processed/foods_cleaned.csv'
    if not os.path.exists(csv_path):
        print(f"CSV not found at {csv_path}")
        return

    # Load only necessary columns to save memory
    cols = ['food_name_en', 'food_name_id', 'calories', 'protein', 'carbohydrates', 'total_fat', 'vitamin_a', 'vitamin_c']
    df = pd.read_csv(csv_path)
    
    total_foods = len(df)
    
    # Missing values
    missing_pct = {
        "Calories": (df['calories'].isna().sum() / total_foods) * 100,
        "Protein": (df['protein'].isna().sum() / total_foods) * 100,
        "Carbs": (df['carbohydrates'].isna().sum() / total_foods) * 100,
        "Fat": (df['total_fat'].isna().sum() / total_foods) * 100,
    }
    
    # Indonesian Translation Coverage
    # Check rows where food_name_id is different from food_name_en
    id_coverage = df[df['food_name_id'].notna() & (df['food_name_id'] != df['food_name_en'])].shape[0]
    
    # Check for local staples
    indonesian_staples = ['nasi', 'goreng', 'rendang', 'sate', 'bakso', 'tempe', 'tahu', 'sambal', 'ayam']
    found_staples = {}
    for staple in indonesian_staples:
        # Check both en and id names
        match_count = df[df['food_name_id'].str.contains(staple, case=False, na=False) | 
                         df['food_name_en'].str.contains(staple, case=False, na=False)].shape[0]
        found_staples[staple] = match_count
            
    report = {
        "summary": {
            "total_records": int(total_foods),
            "indonesian_translation_coverage_pct": round((id_coverage / total_foods) * 100, 2)
        },
        "missing_nutrition_pct": {k: round(v, 2) for k, v in missing_pct.items()},
        "indonesian_keyword_matches": found_staples,
        "recommendations": []
    }
    
    # Logic for recommendations
    if report['summary']['indonesian_translation_coverage_pct'] < 20:
        report['recommendations'].append("Cakupan nama Indonesia sangat rendah. Banyak makanan masih dalam Bahasa Inggris.")
    
    if report['missing_nutrition_pct']['Calories'] > 5:
        report['recommendations'].append("Banyak data kalori yang kosong. Perlu pembersihan data lebih lanjut.")
        
    if found_staples['nasi'] < 10:
        report['recommendations'].append("Data makanan pokok Indonesia (Nasi) sangat minim.")

    print(json.dumps(report, indent=4))

if __name__ == "__main__":
    audit_csv()
