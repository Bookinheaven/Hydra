import threading
import logging
import os
import random
from fastapi import FastAPI
from pydantic import BaseModel
from gpt4all import GPT4All
from fastapi.middleware.cors import CORSMiddleware

MODEL_FOLDER = "models"
MODEL_FILENAME = "Phi-3-mini-4k-instruct.Q4_0.gguf"
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Typing AI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
model_lock = threading.Lock()

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_directory = os.path.join(script_dir, MODEL_FOLDER)

    os.makedirs(model_directory, exist_ok=True)
    logging.info(f"Ensuring model is in custom path: {model_directory}")

    model = GPT4All(
        MODEL_FILENAME,
        model_path=model_directory,
        device="gpu"
    )
    logging.info("✅ Model loaded successfully.")
except Exception as e:
    logging.error(f"FATAL: Could not load or download model. Error: {e}")

class GenerateRequest(BaseModel):
    letters: list[str] = []
    words: list[str] = []
    length: int = 20

RANDOM_LETTERS = list("abcdefghijklmnopqrstuvwxyz")
RANDOM_WORDS = ["sky", "river", "cloud", "light", "dream", "spark", "flow"]

@app.post("/generate") 
def generate(request: GenerateRequest):
    if model is None:
        return {"text": "Error: The AI model is not loaded. Please check server logs."}

    letters = request.letters or random.sample(RANDOM_LETTERS, k=5)
    words = request.words or random.sample(RANDOM_WORDS, k=3)

    prompt = (
        f"Write a plain sentence for a typing test. "
        f"It must contain these letters: {', '.join(letters)} "
        f"and these words: {', '.join(words)}. "
        f"The sentence should be about {request.length} words long. "
        f"Do not explain, do not add extra text, only return the sentence."
    )

    logging.info(f"Generating with prompt...") 

    try:
        with model_lock:
            logging.info("Lock acquired, generating response...")
            with model.chat_session():
                response = model.generate(
                    prompt,
                    max_tokens=200,
                    temp=0.7,
                )
        
        clean_response = response.strip().split("\n")[0]
        logging.info(f"Generated response: {clean_response}")
        return {"text": clean_response} 

    except Exception as e:
        logging.error(f"An error occurred during model generation: {e}")
        return {"text": "The quick brown fox jumps over the lazy dog."}