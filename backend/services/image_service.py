import urllib.parse
import time
import httpx

async def generate_image(prompt: str) -> str:
    """
    Generate an image using Pollinations.ai (completely free, no API key).
    
    Args:
        prompt: The user's creative prompt
        
    Returns:
        URL of the generated image
    """

    enhanced_prompt = (
        f"{prompt}, "
        "masterpiece, best quality, highly detailed, "
        "professional photography, stunning composition, "
        "8k resolution, sharp focus"
    )

    encoded_prompt = urllib.parse.quote(enhanced_prompt)

    seed = int(time.time())

    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:

            response = await client.get(image_url)
            response.raise_for_status()
        except Exception as e:
            print(f"[WARN] Failed to pre-warm image: {e}")

            
    return image_url
