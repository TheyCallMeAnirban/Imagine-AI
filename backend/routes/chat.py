import os
import json
import io
import httpx
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from services.image_service import generate_image
from openai import AsyncOpenAI
from sqlalchemy.orm import Session
from database import get_db, GeneratedImage

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ChatResponse(BaseModel):
    type: str
    content: str
    image_url: Optional[str] = None

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY", "dummy_key"),
    base_url="https://api.groq.com/openai/v1"
)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "generate_image",
            "description": "Generate an image based on a user's prompt. Call this ONLY when the user explicitly asks to create, draw, paint, visualize, or generate an image.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "A highly detailed, descriptive prompt for the image generation model. Enhance the user's request with visual details, colors, and styling.",
                    }
                },
                "required": ["prompt"],
            },
        }
    }
]

SYSTEM_PROMPT = """You are ImagineAI, an advanced neural assistant embedded within an analogue brutalist design studio.
Keep your tone professional, crisp, and slightly technical. You assist the user with brainstorming, architecture, and design.
If the user explicitly asks you to generate, create, draw, visualize, or output an image, you MUST call the `generate_image` tool with a highly detailed, high-contrast brutalist or vintage analogue prompt.
If they are just chatting or asking a question, reply with text in a concise, studio-engineer tone."""

@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Process a chat message using an LLM to determine whether to reply with text or generate an image."""
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    if request.history:
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})
            
    messages.append({"role": "user", "content": message})

    async def event_generator():
        try:

            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
                stream=True
            )
            
            tool_call_name = ""
            tool_call_args = ""
            is_tool = False
            
            async for chunk in response:
                if not chunk.choices:
                    continue
                    
                delta = chunk.choices[0].delta

                if delta.tool_calls:
                    is_tool = True
                    for tc in delta.tool_calls:
                        if tc.function.name:
                            tool_call_name += tc.function.name
                        if tc.function.arguments:
                            tool_call_args += tc.function.arguments

                elif delta.content and not is_tool:
                    yield f"data: {json.dumps({'type': 'text_chunk', 'content': delta.content})}\n\n"

            if is_tool and tool_call_name == "generate_image":
                try:
                    args = json.loads(tool_call_args)
                    image_prompt = args.get("prompt", request.message)
                    
                    yield f"data: {json.dumps({'type': 'system', 'content': 'Synthesizing neural grid output...'})}\n\n"

                    image_url = await generate_image(image_prompt)

                    db_image = GeneratedImage(prompt=image_prompt, image_url=image_url)
                    db.add(db_image)
                    db.commit()

                    images = db.query(GeneratedImage).order_by(GeneratedImage.created_at.desc()).all()
                    if len(images) > 10:
                        for img in images[10:]:
                            db.delete(img)
                        db.commit()

                    yield f"data: {json.dumps({'type': 'image', 'content': f'Here is what I created for you! ✨\\n*(Prompt: {image_prompt})*', 'image_url': image_url})}\n\n"
                except Exception as e:
                    print(f"Tool execution error: {e}")
                    yield f"data: {json.dumps({'type': 'error', 'content': 'Failed to synthesize image.'})}\n\n"

        except Exception as e:
            print(f"Streaming error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': 'Neural link severed. Please try again.'})}\n\n"

    return StreamingResponse(
        event_generator(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/gallery")
def get_gallery(db: Session = Depends(get_db)):
    images = db.query(GeneratedImage).order_by(GeneratedImage.created_at.desc()).limit(10).all()
    return [{"id": img.id, "prompt": img.prompt, "image_url": img.image_url, "created_at": img.created_at} for img in images]

@router.get("/download")
async def download_image(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not download image")
        
        return StreamingResponse(
            io.BytesIO(response.content), 
            media_type="image/png",
            headers={"Content-Disposition": 'attachment; filename="imagine_ai_output.png"'}
        )
