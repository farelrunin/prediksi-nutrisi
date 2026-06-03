# Data Dictionary for NutrisiAI Backend

## Foods Dataset (`foods_cleaned.csv`)
- `source_food_id`: Unique identifier from the raw nutrition source.
- `food_name_en`: English food name used as the canonical search label.
- `food_name_id`: Indonesian name for the food, either mapped or original English if missing.
- `alternate_names`: Other names or aliases for the food item.
- `description`: Optional description or notes about the food.
- `serving_unit`: Serving unit label, such as "gram" or "piece".
- `serving_quantity`: Numeric amount of the serving unit.
- `serving_metric_unit`: Metric unit for the serving, such as "g" or "ml".
- `serving_metric_quantity`: Numeric metric value for the serving.
- `calories`: Energy content in kilocalories.
- `protein`: Protein content in grams.
- `carbohydrates`: Available carbohydrate content in grams.
- `total_fat`: Total fat content in grams.
- `dietary_fiber`: Dietary fiber content in grams.
- `total_sugars`: Total sugar content in grams.
- `sodium`: Sodium content in milligrams.
- `calcium`: Calcium content in milligrams.
- `iron`: Iron content in milligrams.
- `potassium`: Potassium content in milligrams.
- `vitamin_a`: Vitamin A content in micrograms or IU as provided.
- `vitamin_c`: Vitamin C content in milligrams.
- `vitamin_d`: Vitamin D content in micrograms.
- `nutrients_json`: JSON object containing any additional nutrient fields not mapped to explicit columns.

## Translation Dataset (`food_translation_cleaned.csv`)
- `english_name`: English food name used to look up translations.
- `indonesian_name`: Indonesian translation for the food.

## AKG Reference Dataset (`akg_cleaned.csv`)
- `age_category`: General group label such as "male", "female", "pregnant", or "breastfeeding".
- `age_group`: Specific age range or lifecycle label for the AKG row.
- `body_weight`: Average body weight used for the guideline, if available.
- `height`: Average height used for the guideline, if available.
- `calories`: Recommended daily calories.
- `protein`: Recommended protein intake.
- `total_fat`: Recommended total fat intake.
- `carbohydrates`: Recommended carbohydrate intake.
- `dietary_fiber`: Recommended dietary fiber intake.
- `water`: Recommended daily water intake.
- `vitamin_a`: Recommended vitamin A intake.
- `vitamin_c`: Recommended vitamin C intake.
- `vitamin_d`: Recommended vitamin D intake.
- `calcium`: Recommended calcium intake.
- `iron`: Recommended iron intake.
- `zinc`: Recommended zinc intake.
- `sodium`: Recommended sodium intake.
- `potassium`: Recommended potassium intake.
- `min_age`: Minimum age for the guideline.
- `max_age`: Maximum age for the guideline.
- `preg_month_min`: Minimum pregnancy month range for the guideline.
- `preg_month_max`: Maximum pregnancy month range for the guideline.
- `bf_month_min`: Minimum breastfeeding month range for the guideline.
- `bf_month_max`: Maximum breastfeeding month range for the guideline.
- `nutrients_json`: JSON object containing any additional guideline values.
