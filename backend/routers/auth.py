from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import hash_password, verify_password, create_token, decode_token
import requests
import os
import uuid
import shutil
from fastapi import File, UploadFile
from schemas import UserCreate, UserLogin, TokenResponse, UserResponse, ProfileUpdate, GoogleLoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])
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


@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user_obj = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        profile={}
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    token = create_token({"sub": str(user_obj.id)})
    return TokenResponse(token=token, name=user_obj.name, email=user_obj.email)


@router.post("/google", response_model=TokenResponse)
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    # Verify token with Google
    response = requests.get(
        f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={data.access_token}"
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Token Google tidak valid")
        
    google_user = response.json()
    email = google_user.get("email")
    name = google_user.get("name", "Google User")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email Google tidak ditemukan")
        
    # Check if user exists
    user_obj = db.query(User).filter(User.email == email).first()
    
    if not user_obj:
        # Create new user for Google login
        import uuid
        user_obj = User(
            name=name,
            email=email,
            hashed_password=hash_password(str(uuid.uuid4())),
            profile={}
        )
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)
        
    token = create_token({"sub": str(user_obj.id)})
    return TokenResponse(token=token, name=user_obj.name, email=user_obj.email)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user_obj = db.query(User).filter(User.email == credentials.email).first()
    if not user_obj or not verify_password(credentials.password, user_obj.hashed_password):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_token({"sub": str(user_obj.id)})
    return TokenResponse(token=token, name=user_obj.name, email=user_obj.email)


@router.get("/profile", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user)):
    return user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Update core user fields
    if profile_data.name is not None: user.name = profile_data.name
    if profile_data.phone is not None: user.phone = profile_data.phone
    if profile_data.birth_date is not None: user.birth_date = profile_data.birth_date
    if profile_data.gender is not None: user.gender = profile_data.gender
    if profile_data.height is not None: user.height = profile_data.height
    if profile_data.weight is not None: user.weight = profile_data.weight
    if profile_data.activity_level is not None: user.activity_level = profile_data.activity_level
    if profile_data.nutrition_goal is not None: user.nutrition_goal = profile_data.nutrition_goal
    if profile_data.target_calories is not None: user.target_calories = profile_data.target_calories
    if profile_data.target_protein is not None: user.target_protein = profile_data.target_protein
    if profile_data.target_carbs is not None: user.target_carbs = profile_data.target_carbs
    if profile_data.target_fat is not None: user.target_fat = profile_data.target_fat
    if profile_data.sleep_hours is not None: user.sleep_hours = profile_data.sleep_hours
    if profile_data.is_pregnant is not None: user.is_pregnant = profile_data.is_pregnant
    if profile_data.is_breastfeeding is not None: user.is_breastfeeding = profile_data.is_breastfeeding

    # Also update the catch-all profile JSON if needed
    current_profile = user.profile or {}
    updated_profile = {**current_profile, **profile_data.dict(exclude_unset=True)}
    user.profile = updated_profile
    
    db.commit()
    db.refresh(user)
    return user

@router.post("/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Ensure directory exists
    os.makedirs("static/avatars", exist_ok=True)
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1]
    filename = f"{user.id}_{uuid.uuid4().hex}{ext}"
    filepath = os.path.join("static/avatars", filename)
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update DB
    # We use full URL for frontend convenience
    # Adjust 'http://localhost:8000' if needed
    user.avatar_url = f"http://localhost:8000/static/avatars/{filename}"
    db.commit()
    db.refresh(user)
    return user
