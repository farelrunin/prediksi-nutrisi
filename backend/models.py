from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    birth_date = Column(String(50), nullable=True)
    gender = Column(String(20), nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    activity_level = Column(String(50), nullable=True)
    nutrition_goal = Column(String(100), nullable=True)
    target_calories = Column(Float, nullable=True)
    target_protein = Column(Float, nullable=True)
    target_carbs = Column(Float, nullable=True)
    target_fat = Column(Float, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    is_pregnant = Column(Boolean, default=False)
    pregnancy_month = Column(Integer, nullable=True)
    is_breastfeeding = Column(Boolean, default=False)
    breastfeeding_month = Column(Integer, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    profile = Column(JSON, nullable=True, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    food_entries = relationship("FoodEntry", back_populates="owner")
    nutrition_history = relationship("NutritionHistory", back_populates="user")
    predictions = relationship("Prediction", back_populates="user")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    section = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    item_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    foods = relationship("Food", back_populates="category")


class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True, index=True)
    source_food_id = Column(String(50), unique=True, index=True, nullable=True)
    food_name_en = Column(String(255), nullable=False, index=True)
    food_name_id = Column(String(255), nullable=False, index=True)
    alternate_names = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    serving_unit = Column(String(50), nullable=True)
    serving_quantity = Column(Float, nullable=True)
    serving_metric_unit = Column(String(50), nullable=True)
    serving_metric_quantity = Column(Float, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # Nutrisi utama (kolom penting)
    calories = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    total_fat = Column(Float, nullable=True)
    dietary_fiber = Column(Float, nullable=True)
    total_sugars = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    calcium = Column(Float, nullable=True)
    iron = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    vitamin_a = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    
    # Nutrisi tambahan disimpan dalam JSON
    nutrients_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("Category", back_populates="foods")


class FoodTranslation(Base):
    __tablename__ = "food_translations"
    id = Column(Integer, primary_key=True, index=True)
    english_name = Column(String(255), nullable=False, unique=True, index=True)
    indonesian_name = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AkgReference(Base):
    __tablename__ = "akg_references"
    id = Column(Integer, primary_key=True, index=True)
    age_category = Column(String(50), nullable=False, index=True)
    age_group = Column(String(100), nullable=True)
    body_weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    
    # Nutrisi utama
    calories = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    total_fat = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    dietary_fiber = Column(Float, nullable=True)
    water = Column(Float, nullable=True)
    vitamin_a = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    calcium = Column(Float, nullable=True)
    iron = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    
    # Age range
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    
    # Pregnancy
    preg_month_min = Column(Integer, nullable=True)
    preg_month_max = Column(Integer, nullable=True)
    
    # Breastfeeding
    bf_month_min = Column(Integer, nullable=True)
    bf_month_max = Column(Integer, nullable=True)
    
    # Nutrisi tambahan dalam JSON
    nutrients_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FoodEntry(Base):
    __tablename__ = "food_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    meal_type = Column(String(50), default="breakfast")
    food_name = Column(String(100), nullable=False)
    quantity = Column(Float, default=0.0)
    unit = Column(String(50), default="gram")
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="food_entries")


class NutritionHistory(Base):
    __tablename__ = "nutrition_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=True)
    food_name = Column(String(255), nullable=False)
    meal_type = Column(String(50), nullable=False)
    quantity = Column(Float, nullable=False)
    serving_multiplier = Column(Float, default=1.0)
    
    # Nutrisi
    calories = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    total_fat = Column(Float, nullable=True)
    dietary_fiber = Column(Float, nullable=True)
    total_sugars = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="nutrition_history")


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    input_data = Column(JSON, nullable=False)
    prediction_result = Column(String(50), nullable=True)
    risk_score = Column(Float, nullable=True)
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="predictions")
