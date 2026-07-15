from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', '')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI(title="IT Architect Portfolio API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=120)
    message: str = Field(min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = ""
    message: str
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def _build_email_html(payload: ContactMessageCreate) -> str:
    safe_msg = payload.message.replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color:#0A0A0A; background:#F7F7F8; padding:24px;">
      <tr><td>
        <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border:1px solid #E5E5E5;">
          <tr><td style="padding:24px; border-bottom:1px solid #E5E5E5;">
            <div style="font-size:11px; letter-spacing:2px; color:#002FA7; font-weight:700;">NEW RECRUITER MESSAGE</div>
            <div style="font-size:22px; font-weight:800; margin-top:8px;">Portfolio Contact Form</div>
          </td></tr>
          <tr><td style="padding:24px;">
            <p style="margin:0 0 8px 0;"><strong>Name:</strong> {payload.name}</p>
            <p style="margin:0 0 8px 0;"><strong>Email:</strong> {payload.email}</p>
            <p style="margin:0 0 8px 0;"><strong>Company:</strong> {payload.company or '-'}</p>
            <p style="margin:16px 0 8px 0;"><strong>Message:</strong></p>
            <div style="padding:16px; background:#F7F7F8; border-left:3px solid #002FA7;">{safe_msg}</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def _send_contact_email(payload: ContactMessageCreate) -> bool:
    """Send email via Resend. Returns True on success, False otherwise (never raises)."""
    if not RESEND_API_KEY or not RECIPIENT_EMAIL:
        logger.info("Resend not configured; skipping email delivery")
        return False
    params = {
        "from": SENDER_EMAIL,
        "to": [RECIPIENT_EMAIL],
        "reply_to": payload.email,
        "subject": f"New portfolio inquiry from {payload.name}",
        "html": _build_email_html(payload),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Resend email sent: {result.get('id') if isinstance(result, dict) else result}")
        return True
    except Exception as e:
        logger.error(f"Resend email failed: {e}")
        return False


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "IT Architect Portfolio API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "email_configured": bool(RESEND_API_KEY and RECIPIENT_EMAIL),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    # Try sending email (non-blocking of DB save)
    sent = await _send_contact_email(payload)

    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        company=(payload.company or "").strip(),
        message=payload.message.strip(),
        email_sent=sent,
    )
    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()

    try:
        await db.contact_messages.insert_one(doc)
    except Exception as e:
        logger.error(f"Failed to save contact message: {e}")
        raise HTTPException(status_code=500, detail="Could not save your message. Please try again.")

    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(limit: int = 100):
    cursor = db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
    items = await cursor.to_list(length=limit)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except Exception:
                pass
    return items


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
