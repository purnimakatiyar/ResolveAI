from fastapi import Depends
from fastapi import Header, HTTPException
from utils.supabase import supabase

from uuid import UUID

def get_tenant_id(x_tenant_id: str = Header(..., alias="X-Tenant-ID")) -> UUID:
    """
    Extract and validate tenant ID from X-Tenant-ID header.
    
    Args:
        x_tenant_id: The tenant ID from the request header
        
    Returns:
        UUID: The validated tenant ID
        
    Raises:
        HTTPException: If the tenant ID is missing or invalid
    """
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID header is required")
    
    try:
        return UUID(x_tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tenant ID format")

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")

    token = authorization.split(" ")[1]

    res = supabase.auth.get_user(token)

    if res.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "sub": res.user.id,
        "email": res.user.email,
        "role": res.user.role,
        # "tenant_id": res.user.tenant_id,
        "user_metadata": res.user.user_metadata,
    }

# def get_tenant_id(user=Depends(get_current_user)):
#     return user["tenant_id"]
