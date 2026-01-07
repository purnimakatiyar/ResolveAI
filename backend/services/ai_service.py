from google import genai
import os
import json
import re
import logging

logger = logging.getLogger(__name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
def generate_ai_draft(ticket):
    prompt = f"""
You are a customer support AI for a SaaS product.

Ticket:
Title: {ticket.title}
Description: {ticket.description}

Return ONLY valid JSON.
Do NOT wrap in markdown.
Do NOT add commentary.

{{
  "draft": "...",
  "confidence": 85,
  "reasoning": "..."
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()
    logger.info("Raw Gemini response:\n%s", raw_text)

    match = re.search(r"\{[\s\S]*\}", raw_text)
    if not match:
        raise ValueError(f"No JSON found in Gemini response:\n{raw_text}")

    json_text = match.group(0)

    return json.loads(json_text)
