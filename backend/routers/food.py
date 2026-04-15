from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, FoodEntry
from auth import decode_token
from schemas import FoodEntryCreate, FoodEntryResponse

router = APIRouter(prefix="/food", tags=["food"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_token(credentials.credentials)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Token tidak valid")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user


@router.post("/", response_model=FoodEntryResponse)
def add_food(
    food: FoodEntryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    entry = FoodEntry(
        user_id=user.id,
        meal_type=food.meal_type,
        food_name=food.food_name,
        quantity=food.quantity,
        unit=food.unit,
        calories=food.calories,
        protein=food.protein,
        carbs=food.carbs,
        fat=food.fat,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/", response_model=List[FoodEntryResponse])
def get_food_entries(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(FoodEntry).filter(FoodEntry.user_id == user.id).order_by(FoodEntry.created_at.desc()).all()
