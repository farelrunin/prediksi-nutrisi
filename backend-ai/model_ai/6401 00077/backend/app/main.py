from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict_route import router as predict_router

app = FastAPI(
    title="NutriVision AI Backend",
    description="REST API untuk prediksi makanan, estimasi nutrisi, AKG, dan rekomendasi gizi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # untuk development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api", tags=["Prediction"])

@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "NutriVision AI Backend aktif"
    }