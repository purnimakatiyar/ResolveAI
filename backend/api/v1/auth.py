from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
import uuid

from schemas.auth import SignupRequest, LoginRequest
from utils.supabase import supabase
from db.session import get_db
from models.db import Tenant, User

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # 1. Create Supabase auth user
    res = supabase.auth.sign_up({
        "email": data.email,
        "password": data.password
    })

    if res.user is None:
        raise HTTPException(status_code=400, detail="Signup failed")

    supabase_user_id = res.user.id

    # 2. Create tenant
    tenant = Tenant(
        id=uuid.uuid4(),
        name=f"{data.email.split('@')[0]}'s Workspace"
    )
    db.add(tenant)
    db.flush()  # ensures tenant.id is available

    # 3. Create user in DB
    user = User(
        supabase_user_id=supabase_user_id,
        tenant_id=tenant.id,
        email=data.email,
        role="user",  # first user is admin
    )
    db.add(user)

    db.commit()

    return {
        "message": "Signup successful",
        "user_id": supabase_user_id,
        "tenant_id": str(tenant.id),
        "role": user.role
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
        "user": {
            "id": res.user.id,
            "email": res.user.email,
            "role": res.user.role
        }
    }
