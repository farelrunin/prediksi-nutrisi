import logging
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.model_service import predict_food_image
from app.services.nutrition_service import (
    get_akg_target,
    compare_nutrition_with_akg
)
from app.services.gemini_service import generate_gemini_recommendation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/predict", response_model=dict)
async def analyze_food(
    file: UploadFile = File(...),
    porsi_gram: float = Form(100.0),
    age: int = Form(21),
    sex: str = Form("female"),
    condition: str = Form("normal"),
    pregnancy_month: Optional[int] = Form(0),
    breastfeeding_month: Optional[int] = Form(0)
):
    try:
        logger.info("Received image: %s", file.filename)

        image_bytes = await file.read()

        logger.info("Predicting food image")
        prediction_result = predict_food_image(
            image_bytes=image_bytes,
            porsi_gram=porsi_gram
        )

        logger.info("Calculating AKG target")
        akg_target = get_akg_target(
            age=age,
            sex=sex,
            condition=condition,
            pregnancy_month=pregnancy_month,
            breastfeeding_month=breastfeeding_month
        )

        logger.info("Comparing nutrition with AKG")
        comparison_data = compare_nutrition_with_akg(
            nutrition_dict=prediction_result["estimasi_nutrisi"],
            akg_target=akg_target
        )

        user_profile = {
            "age": age,
            "sex": sex,
            "condition": condition,
            "pregnancy_month": pregnancy_month,
            "breastfeeding_month": breastfeeding_month
        }

        logger.info("Generating recommendation with Gemini/local fallback")
        recommendation = generate_gemini_recommendation(
            user_profile=user_profile,
            prediction_result=prediction_result,
            akg_target=akg_target,
            comparison_data=comparison_data
        )

        logger.info("Returning response")
        return {
            "status": "success",
            "makanan": prediction_result["makanan"],
            "class_name": prediction_result["class_name"],
            "confidence_persen": prediction_result["confidence_persen"],
            "porsi_gram": porsi_gram,
            "profil_pengguna": user_profile,
            "estimasi_nutrisi": prediction_result["estimasi_nutrisi"],
            "target_akg": akg_target,
            "komparasi_akg": comparison_data,
            "rekomendasi_gemini": recommendation
        }

    except Exception as e:
        logger.error("Error in /predict endpoint: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )