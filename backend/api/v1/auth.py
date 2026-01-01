from fastapi import APIRouter, HTTPException, Depends
from schemas.auth import SignupRequest, LoginRequest
from utils.supabase import supabase
from dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: SignupRequest):
    res = supabase.auth.sign_up({
        "email": data.email,
        "password": data.password
    })

    if res.user is None:
        raise HTTPException(status_code=400, detail="Signup failed")

    return {
        "message": "Signup successful",
        "user_id": res.user.id
    }


@router.post("/login")
def login(data: LoginRequest):
    res = supabase.auth.sign_in_with_password({
        "email": data.email,
        "password": data.password
    })

    if res.user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": res.session.access_token,
        "refresh_token": res.session.refresh_token,
        "user": res.user
    }

@router.get("/me")
def me(user=Depends(get_current_user)):
    return {
        "user_id": user["sub"],
        "email": user.get("email"),
        "role": user.get("role")
    }
