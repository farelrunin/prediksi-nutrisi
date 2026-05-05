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
    food_name: Optional[str] = None
    quantity: Optional[float] = None
    age: Optional[int] = None
    condition: Optional[str] = None
    story: Optional[str] = None  # New field for natural language input

class PredictionResponse(BaseModel):
    risk_level: str
    score: float
    suggestion: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    foods: Optional[List[dict]] = None
    parsed_data: Optional[dict] = None  # Additional data from NLP parsing

class FoodResponse(BaseModel):
    id: int
    source_food_id: Optional[str] = None
    food_name_en: str
    food_name_id: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None
    total_fat: Optional[float] = None
    dietary_fiber: Optional[float] = None
    total_sugars: Optional[float] = None
    sodium: Optional[float] = None
    calcium: Optional[float] = None
    iron: Optional[float] = None
    potassium: Optional[float] = None

    class Config:
        orm_mode = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    section: str
    description: Optional[str] = None
    item_count: int

    class Config:
        orm_mode = True
