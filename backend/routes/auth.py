from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter(prefix="/auth", tags=["Auth"])

CLIENT_ID = "525708452903-dcktg2s01kmqqofgf49uplo07k8stvdg.apps.googleusercontent.com"

class TokenRequest(BaseModel):
    token: str

@router.post("/google")
async def verify_google_token(payload: TokenRequest):
    try:
        idinfo = id_token.verify_oauth2_token(payload.token, requests.Request(), CLIENT_ID)
        return {
            "email": idinfo["email"],
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
        }
    except Exception as e:
        print("❌ Verifikasi gagal:", e)
        raise HTTPException(status_code=400, detail="Token tidak valid")
