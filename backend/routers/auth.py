from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import hash_password, verify_password, create_token, decode_token
from schemas import UserCreate, UserLogin, TokenResponse, UserResponse, ProfileUpdate

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
    return TokenResponse(token=token, name=user_obj.name)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user_obj = db.query(User).filter(User.email == credentials.email).first()
    if not user_obj or not verify_password(credentials.password, user_obj.hashed_password):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_token({"sub": str(user_obj.id)})
    return TokenResponse(token=token, name=user_obj.name)


@router.get("/profile", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user)):
    return user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Update profile data
    current_profile = user.profile or {}
    updated_profile = {**current_profile, **profile_data.dict(exclude_unset=True)}
    user.profile = updated_profile
    db.commit()
    db.refresh(user)
    return user
