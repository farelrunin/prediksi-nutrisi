from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="NutriAI Prediction Engine")

class PredictionResponse(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    confidence: float

@app.get("/")
def read_root():
    return {"message": "NutriAI Prediction Engine is Running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # TEMPAT TIM AI MENARUH LOGIKA TENSORFLOW
    # 1. Load Model (.h5 atau .keras)
    # 2. Preprocess Gambar dari 'file'
    # 3. model.predict()
    
    # CONTOH DATA DUMMY (Nanti diganti hasil model asli)
    return {
        "food_name": "Ayam Goreng (Sample)",
        "calories": 250.0,
        "protein": 25.0,
        "carbs": 0.0,
        "fat": 15.0,
        "confidence": 0.98
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
