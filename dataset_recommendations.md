# Dataset Recommendations untuk NutriAI

## 🎯 Dataset Prioritas Tinggi

### 1. **USDA FoodData Central** ⭐⭐⭐⭐⭐
- **Link**: https://fdc.nal.usda.gov/
- **Ukuran**: 900,000+ makanan
- **Data**: Kalori, protein, karbohidrat, lemak, vitamin, mineral per 100g
- **Format**: JSON/CSV
- **Penggunaan**: Database nutrisi makanan utama

### 2. **USDA SR Legacy** ⭐⭐⭐⭐⭐
- **Link**: https://www.ars.usda.gov/northeast-area/beltsville-md-bhnrc/beltsville-human-nutrition-research-center/nutrient-data-laboratory/docs/usda-national-nutrient-database-for-standard-reference/
- **Ukuran**: 8,000+ makanan
- **Data**: Komposisi nutrisi lengkap
- **Format**: CSV/Access
- **Penggunaan**: Referensi nutrisi standar

### 3. **NHANES (National Health and Nutrition Examination Survey)** ⭐⭐⭐⭐⭐
- **Link**: https://www.cdc.gov/nchs/nhanes/index.htm
- **Ukuran**: 5,000+ responden per tahun
- **Data**: Profil kesehatan, pola makan, BMI, kondisi kesehatan
- **Format**: SAS/XPT files
- **Penggunaan**: Model prediksi risiko kesehatan

## 🌏 Dataset Lokal Indonesia

### 4. **Tabel Komposisi Pangan Indonesia (TKPI)** ⭐⭐⭐⭐
- **Sumber**: Kementerian Kesehatan RI
- **Ukuran**: 1,200+ makanan lokal
- **Data**: Nutrisi makanan Indonesia
- **Format**: PDF/Excel (perlu ekstrak)
- **Penggunaan**: Makanan khas Indonesia

### 5. **Data Riset Kesehatan Dasar (Riskesdas)** ⭐⭐⭐⭐
- **Sumber**: Kemenkes RI
- **Ukuran**: 300,000+ responden
- **Data**: Status gizi, penyakit, pola makan masyarakat Indonesia
- **Format**: Excel/CSV
- **Penggunaan**: Benchmark kesehatan Indonesia

## 📊 Dataset untuk Machine Learning

### 6. **Nutrition Facts Dataset** ⭐⭐⭐⭐
- **Link**: Kaggle - "Nutrition Facts for McDonald's Menu"
- **Ukuran**: 260+ item menu
- **Data**: Kalori, lemak, sodium, karbohidrat
- **Format**: CSV
- **Penggunaan**: Training model klasifikasi makanan

### 7. **Open Food Facts** ⭐⭐⭐⭐
- **Link**: https://world.openfoodfacts.org/data
- **Ukuran**: 2.5M+ produk makanan
- **Data**: Nutrisi, ingredients, alergen
- **Format**: CSV/JSON
- **Penggunaan**: Database global makanan

### 8. **WHO Global Health Observatory** ⭐⭐⭐⭐
- **Link**: https://www.who.int/data/gho
- **Ukuran**: Data global
- **Data**: Rekomendasi nutrisi WHO, BMI standards
- **Format**: CSV/Excel
- **Penggunaan**: Target nutrisi harian

## 🏥 Dataset Medis/Kesehatan

### 9. **CDC Nutrition Data** ⭐⭐⭐⭐
- **Link**: https://www.cdc.gov/nutrition/data-statistics/index.html
- **Ukuran**: Berbagai ukuran
- **Data**: Rekomendasi nutrisi, data epidemiologi
- **Format**: PDF/Excel
- **Penggunaan**: Guidelines nutrisi

### 10. **Body Mass Index Dataset** ⭐⭐⭐
- **Link**: Kaggle - "BMI Dataset"
- **Ukuran**: 400+ sampel
- **Data**: Height, weight, BMI category
- **Format**: CSV
- **Penggunaan**: Model klasifikasi BMI

## 📋 Struktur Dataset yang Dibutuhkan

### Food Nutrition Dataset:
```csv
food_name,calories,protein_g,carbs_g,fat_g,fiber_g,sugar_g,sodium_mg,potassium_mg,vitamin_c_mg,calcium_mg,iron_mg
Nasi Putih,130,2.7,28,0.3,0.4,0.1,1,35,0,10,0.8
Ayam Goreng,165,31,0,3.6,0,0,74,256,0,15,1.3
```

### User Profile Dataset:
```csv
age,gender,height_cm,weight_kg,activity_level,bmi_category,health_conditions
25,Male,175,70,moderate,normal,none
30,Female,160,55,light,normal,diabetes
```

### Nutrition Targets Dataset:
```csv
age,gender,activity_level,calories_target,protein_target_g,carbs_target_g,fat_target_g
25,Male,moderate,2500,125,300,83
30,Female,light,2000,100,250,67
```

## 🔧 Implementasi Dataset

### 1. **Database Setup**
```sql
-- Food nutrition table
CREATE TABLE food_nutrition (
  id INT PRIMARY KEY AUTO_INCREMENT,
  food_name VARCHAR(255) UNIQUE,
  calories_per_100g DECIMAL(8,2),
  protein_g DECIMAL(8,2),
  carbs_g DECIMAL(8,2),
  fat_g DECIMAL(8,2),
  fiber_g DECIMAL(8,2),
  sodium_mg DECIMAL(8,2),
  category VARCHAR(100)
);

-- User nutrition targets
CREATE TABLE nutrition_targets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  age_min INT,
  age_max INT,
  gender VARCHAR(10),
  activity_level VARCHAR(20),
  calories_target INT,
  protein_target DECIMAL(8,2),
  carbs_target DECIMAL(8,2),
  fat_target DECIMAL(8,2)
);
```

### 2. **ML Model Training Data**
```python
# Features untuk prediksi risiko
features = [
    'age', 'gender', 'bmi', 'activity_level',
    'daily_calories', 'protein_ratio', 'carb_ratio', 'fat_ratio',
    'health_conditions', 'meal_frequency'
]

# Target
target = 'health_risk_score'  # 0-1 scale
```

## 📈 Model Prediksi yang Bisa Dibangun

1. **Food Nutrition Estimator** - Estimasi nutrisi berdasarkan nama makanan
2. **Personal Nutrition Target Calculator** - Target harian berdasarkan profil
3. **Health Risk Predictor** - Prediksi risiko kesehatan berdasarkan pola makan
4. **Meal Recommendation System** - Rekomendasi makanan personal
5. **Nutrition Deficiency Detector** - Deteksi kekurangan nutrisi

## 🚀 Next Steps

1. **Download dataset prioritas** (USDA + TKPI)
2. **Setup database** untuk menyimpan data nutrisi
3. **Train ML model** untuk estimasi nutrisi makanan
4. **Implement recommendation engine** berdasarkan profil user
5. **Add health risk prediction** dengan data historis

## 💡 Tips Penggunaan Dataset

- **Mulai kecil**: Gunakan 500-1000 makanan populer dulu
- **Validasi data**: Cross-check dengan sumber terpercaya
- **Update berkala**: Nutrisi data perlu diupdate
- **Localization**: Prioritaskan makanan lokal Indonesia
- **User feedback**: Collect data real usage untuk improve model