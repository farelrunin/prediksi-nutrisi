import os
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AKG_NORMAL_PATH = os.path.join(BASE_DIR, "artifacts", "akg_normal.csv")
AKG_PREGNANT_PATH = os.path.join(BASE_DIR, "artifacts", "akg_pregnant.csv")
AKG_BREASTFEEDING_PATH = os.path.join(BASE_DIR, "artifacts", "akg_breastfeeding.csv")

akg_normal_df = pd.read_csv(AKG_NORMAL_PATH)
akg_pregnant_df = pd.read_csv(AKG_PREGNANT_PATH)
akg_breastfeeding_df = pd.read_csv(AKG_BREASTFEEDING_PATH)

AKG_MAP = {
    "calories_kcal": "calories",
    "protein_g": "protein",
    "carbs_g": "carbohydrates",
    "fat_g": "total_fat",
    "fiber_g": "dietary_fiber",
    "calcium_mg": "calcium",
    "iron_mg": "iron",
    "vitamin_c_mg": "vitamin_c",
}


def get_akg_target(age, sex, condition, pregnancy_month, breastfeeding_month):
    sex = sex.lower().strip()
    condition = condition.lower().strip()

    if age < 10:
        base = akg_normal_df[
            (akg_normal_df["age_category"] == "infants_children") &
            (akg_normal_df["min_age"] <= age) &
            (akg_normal_df["max_age"] >= age)
        ]
    else:
        base = akg_normal_df[
            (akg_normal_df["age_category"] == sex) &
            (akg_normal_df["min_age"] <= age) &
            (akg_normal_df["max_age"] >= age)
        ]

    if base.empty:
        raise ValueError("AKG tidak ditemukan untuk profil tersebut.")

    target = base.iloc[0].copy()

    if condition == "pregnant":
        inc = akg_pregnant_df[
            (akg_pregnant_df["age_category"] == "pregnant") &
            (akg_pregnant_df["preg_month_min"] <= pregnancy_month) &
            (akg_pregnant_df["preg_month_max"] >= pregnancy_month)
        ]

        if not inc.empty:
            for akg_col in AKG_MAP.values():
                target[akg_col] = float(target[akg_col]) + float(inc.iloc[0][akg_col])

    elif condition == "breastfeeding":
        inc = akg_breastfeeding_df[
            (akg_breastfeeding_df["age_category"] == "breastfeeding") &
            (akg_breastfeeding_df["bf_month_min"] <= breastfeeding_month) &
            (akg_breastfeeding_df["bf_month_max"] >= breastfeeding_month)
        ]

        if not inc.empty:
            for akg_col in AKG_MAP.values():
                target[akg_col] = float(target[akg_col]) + float(inc.iloc[0][akg_col])

    selected_target = {}

    for pred_col, akg_col in AKG_MAP.items():
        if akg_col in target.index:
            selected_target[pred_col] = float(target[akg_col])

    return selected_target


def compare_nutrition_with_akg(nutrition_dict, akg_target):
    rows = []

    for nutrient, predicted_amount in nutrition_dict.items():
        target_val = float(akg_target.get(nutrient, np.nan))
        predicted_amount = float(predicted_amount)

        percent = (
            predicted_amount / target_val * 100.0
            if target_val and not np.isnan(target_val)
            else np.nan
        )

        rows.append({
            "nutrient": nutrient,
            "predicted_amount": predicted_amount,
            "daily_target_akg": target_val,
            "percent_of_daily_need": percent,
        })

    return rows