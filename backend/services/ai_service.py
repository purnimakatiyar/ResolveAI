import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-pro")

def generate_ai_draft(ticket):
    prompt = f"""
You are a customer support AI for a SaaS product.

Ticket:
Title: {ticket.title}
Description: {ticket.description}

Tasks:
1. Draft a professional response
2. Estimate confidence score (0-100)
3. Explain reasoning briefly

Return JSON:
{{
  "draft": "...",
  "confidence": number,
  "reasoning": "..."
}}
"""

    response = model.generate_content(prompt)
    text = response.text

    parsed = eval(text)

    return parsed
