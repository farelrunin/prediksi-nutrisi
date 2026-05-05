from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Category, Food
from schemas import CategoryResponse, FoodResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.section, Category.name).all()
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category_by_id(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    return category


@router.get("/{category_id}/foods", response_model=List[FoodResponse])
def get_foods_by_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    
    foods = db.query(Food).filter(Food.category_id == category_id).order_by(Food.food_name_en).all()
    return foods
