from fastapi import APIRouter
from schemas import NutritionInput, PredictionResponse

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("/", response_model=PredictionResponse)
def predict_nutrition(data: NutritionInput):
    if data.quantity > 100:
        risk_level = "High"
        score = 0.8
        suggestion = "Kurangi porsi"
    elif data.quantity < 50:
        risk_level = "Low"
        score = 0.2
        suggestion = "Tambah porsi"
    else:
        risk_level = "Medium"
        score = 0.5
        suggestion = "Porsi cukup"

    return PredictionResponse(
        risk_level=risk_level,
        score=score,
        suggestion=suggestion
    )
