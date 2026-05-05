from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import NutritionInput, PredictionResponse
from nlp_parser import parse_food_story
from services.gemini_service import get_ai_advice
from services import gemini_service
from auth import decode_token

router = APIRouter(prefix="/predict", tags=["predict"])
optional_security = HTTPBearer(auto_error=False)


@router.post("/recommendations")
async def get_recommendations(
    data: dict,
    db: Session = Depends(get_db)
):
    history = data.get("history", [])
    profile = data.get("profile", {})
    
    recommendations = gemini_service.get_ai_recommendations(history, profile)
    return recommendations


@router.post("/", response_model=PredictionResponse)
def predict_nutrition(
    data: NutritionInput, 
    db: Session = Depends(get_db),
    token: Optional[HTTPAuthorizationCredentials] = Depends(optional_security)
):
    parsed_data = None
    user_profile = {}
    
    # Try to get user profile for better AI advice
    if token:
        try:
            payload = decode_token(token.credentials)
            user_id = int(payload.get("sub"))
            user_obj = db.query(User).filter(User.id == user_id).first()
            if user_obj:
                user_profile = {
                    "name": user_obj.name,
                    "gender": user_obj.gender,
                    "height": user_obj.height,
                    "weight": user_obj.weight,
                    "healthNotes": user_obj.profile.get("healthNotes", "") if user_obj.profile else "",
                    "nutritionGoal": user_obj.nutrition_goal or "Menjaga kesehatan"
                }
        except Exception as e:
            print(f"Auth error in predict: {e}")
            pass

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

    # Get Gemini Advice
    ai_advice_text = None
    if parsed_data:
        food_info = {
            "food_name": ", ".join([f["name"] for f in parsed_data["parsed_foods"]]),
            "calories": parsed_data["total_nutrition"]["calories"],
            "protein": parsed_data["total_nutrition"]["protein"],
            "carbs": parsed_data["total_nutrition"]["carbs"],
            "fat": parsed_data["total_nutrition"]["fat"]
        }
        ai_advice_text = get_ai_advice(food_info, user_profile)

    return PredictionResponse(
        risk_level=risk_level,
        score=score,
        suggestion=suggestion,
        ai_advice=ai_advice_text,
        calories=parsed_data["total_nutrition"]["calories"] if parsed_data else None,
        protein=parsed_data["total_nutrition"]["protein"] if parsed_data else None,
        carbs=parsed_data["total_nutrition"]["carbs"] if parsed_data else None,
        fat=parsed_data["total_nutrition"]["fat"] if parsed_data else None,
        foods=parsed_data["parsed_foods"] if parsed_data else None,
        parsed_data=parsed_data
    )
