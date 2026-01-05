from fastapi import FastAPI
from api.v1.auth import router as auth_router
from api.v1.tickets import router as ticket_router

app = FastAPI(title="ResolveAI Backend")

app.include_router(auth_router)
app.include_router(ticket_router)

@app.get("/")
def health():
    return {"status": "ok"}
