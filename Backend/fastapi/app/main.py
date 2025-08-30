import logging
import os
import sys
from fastapi import FastAPI
from pydantic import BaseModel
from gpt4all import GPT4All
from fastapi.middleware.cors import CORSMiddleware

# --- CONFIGURATION ---
MODEL_FOLDER = "models"  # Define your custom folder name
MODEL_FILENAME = "Phi-3-mini-4k-instruct.Q4_0.gguf"
logging.basicConfig(level=logging.INFO)

# --- APP SETUP ---
app = FastAPI(title="Typing AI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None  
try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_directory = os.path.join(script_dir, MODEL_FOLDER)

    os.makedirs(model_directory, exist_ok=True)
    logging.info(f"Ensuring model is in custom path: {model_directory}")

    model = GPT4All(
        MODEL_FILENAME,
        model_path=model_directory,
        device='gpu'
    )
    logging.info("✅ Model loaded successfully.")
except Exception as e:
    logging.error(f"FATAL: Could not load or download model. Error: {e}")

class AIRequest(BaseModel):
    letters: list[str]
    words: list[str]

@app.post("/generate")
def generate_sentence(request: AIRequest):
    if model is None:
        return {"text": "Error: Model is not available. Please check server logs."}
    
    letters = ", ".join(request.letters)
    words = ", ".join(request.words)
    
    prompt = (
        f"Generate a short, single typing sentence for a typing test that includes "
        f"the letters: {letters} and the words: {words}. The sentence must be "
        f"between 10 and 15 words long. Only output the sentence itself."
    )
    logging.info(f"Generating with prompt: '{prompt}'")
    
    with model.chat_session():
        response = model.generate(prompt, max_tokens=100)
    
    logging.info(f"Generated response: {response.strip()}")
    return {"text": response.strip()}