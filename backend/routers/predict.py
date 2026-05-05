from fastapi import APIRouter
from schemas import NutritionInput, PredictionResponse
from nlp_parser import parse_food_story

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("/", response_model=PredictionResponse)
def predict_nutrition(data: NutritionInput):
    parsed_data = None

    # If story is provided, use NLP parsing
    if data.story:
        parsed_result = parse_food_story(data.story)
        parsed_data = parsed_result
        total_quantity = parsed_result["total_nutrition"]["quantity_grams"]
    else:
        # Use traditional structured input
        total_quantity = data.quantity or 100

    # Risk assessment logic
    if total_quantity > 300:
        risk_level = "High"
        score = 0.8
        suggestion = "Kurangi porsi makan untuk kesehatan yang lebih baik"
    elif total_quantity < 150:
        risk_level = "Low"
        score = 0.2
        suggestion = "Tambah porsi makan untuk nutrisi yang cukup"
    else:
        risk_level = "Medium"
        score = 0.5
        suggestion = "Porsi makan cukup seimbang, pertahankan pola makan ini"

    # Add age consideration if provided
    if data.age:
        if data.age < 5:
            suggestion += " (Perhatikan nutrisi untuk anak usia dini)"
        elif data.age > 60:
            suggestion += " (Perhatikan nutrisi untuk usia lanjut)"

    return PredictionResponse(
        risk_level=risk_level,
        score=score,
        suggestion=suggestion,
        calories=parsed_data["total_nutrition"]["calories"] if parsed_data else None,
        protein=parsed_data["total_nutrition"]["protein"] if parsed_data else None,
        carbs=parsed_data["total_nutrition"]["carbs"] if parsed_data else None,
        fat=parsed_data["total_nutrition"]["fat"] if parsed_data else None,
        foods=parsed_data["parsed_foods"] if parsed_data else None,
        parsed_data=parsed_data
    )
