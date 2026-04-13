from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data model for input
class NutritionInput(BaseModel):
    food_name: str
    quantity: float
    age: int  # Usia anak or kondisi ibu hamil
    condition: str  # e.g., "anak" or "ibu hamil"

# Mock prediction response
class PredictionResponse(BaseModel):
    risk_level: str
    score: float
    suggestion: str

@app.get("/")
def read_root():
    return {"message": "Prediksi Nutrisi API"}

@app.post("/predict", response_model=PredictionResponse)
def predict_nutrition(data: NutritionInput):
    # Mock logic - replace with actual AI model later
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)