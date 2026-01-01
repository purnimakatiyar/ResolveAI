from fastapi import FastAPI
from api.v1.auth import router as auth_router

app = FastAPI(title="ResolveAI Backend")

app.include_router(auth_router)

@app.get("/")
def health():
    return {"status": "ok"}
