# backend/fastapi/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from gpt4all import GPT4All
from fastapi.middleware.cors import CORSMiddleware

# App
app = FastAPI(title="Typing AI Backend")

# Allow cross-origin requests (for Express or React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load local LLM model once
llm_model = GPT4All("models/gpt4all-j-v1.3-groovy")  # Path to your local model

# Request schema
class AIRequest(BaseModel):
    letters: list[str]
    words: list[str]

# Endpoint
@app.post("/generate")
def generate_sentence(request: AIRequest):
    letters = ", ".join(request.letters)
    words = ", ".join(request.words)
    prompt = (
        f"Generate a typing sentence containing letters: {letters} "
        f"and words: {words}. 10-15 words."
    )
    result = llm_model.generate(prompt)
    return {"text": result.strip()}
