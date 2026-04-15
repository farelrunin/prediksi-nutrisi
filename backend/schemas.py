from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    profile: Optional[dict] = None

    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    token: str
    name: str

class ProfileUpdate(BaseModel):
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    activityLevel: Optional[str] = None
    conditions: Optional[List[str]] = None

class FoodEntryCreate(BaseModel):
    meal_type: str
    food_name: str
    quantity: float
    unit: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class FoodEntryResponse(FoodEntryCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class NutritionInput(BaseModel):
    food_name: str
    quantity: float
    age: int
    condition: str

class PredictionResponse(BaseModel):
    risk_level: str
    score: float
    suggestion: str
