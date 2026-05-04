from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

from routes.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("[START] ImagineAI backend is starting up...")
    groq_key = os.getenv("GROQ_API_KEY", "")
    if groq_key and groq_key != "your_groq_api_key_here":
        print("[OK] Groq API key found")
    else:
        print("[WARN] GROQ_API_KEY not set - chat and intent detection will fail")
        
    # Start the keep-alive task
    async def keep_alive():
        url = os.getenv("RENDER_EXTERNAL_URL", "http://localhost:8000")
        ping_url = f"{url.rstrip('/')}/api/health"
        print(f"[KEEP-ALIVE] Starting pinger for {ping_url} every 14 minutes.")
        
        while True:
            await asyncio.sleep(14 * 60)  # Ping every 14 minutes
            try:
                async with httpx.AsyncClient() as client:
                    await client.get(ping_url)
                    print(f"[KEEP-ALIVE] Successfully pinged {ping_url}")
            except Exception as e:
                print(f"[KEEP-ALIVE] Ping failed: {e}")

    pinger_task = asyncio.create_task(keep_alive())
    
    yield
    
    pinger_task.cancel()
    print("[STOP] ImagineAI backend shutting down...")

app = FastAPI(
    title="ImagineAI API",
    description="Creative AI chat backend with image generation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/api/health")
def health_check():
    """Endpoint to keep the Render free tier awake."""
    return {"status": "alive", "service": "ImagineAI"}

dist_path = os.path.join(os.path.dirname(__file__), "..", "dist")

if os.path.isdir(dist_path):

    assets_path = os.path.join(dist_path, "assets")
    if os.path.isdir(assets_path):
        app.mount(
            "/assets",
            StaticFiles(directory=assets_path),
            name="static-assets",
        )

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the React SPA for all non-API routes."""
        file_path = os.path.join(dist_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
