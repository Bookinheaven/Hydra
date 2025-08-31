import random
from fastapi import APIRouter
from app.schemas.GenerateRequest import GenerateRequest
from app.services.model_service import model_service
from app.utils.logger import logger

router = APIRouter()

RANDOM_LETTERS = list("abcdefghijklmnopqrstuvwxyz")
RANDOM_WORDS = ["sky", "river", "cloud", "light", "dream", "spark", "flow"]

@router.post("/generate", tags=["Generation"])
def generate_sentence(request: GenerateRequest):
    """
    Generates a sentence based on provided letters and words.
    """
    letters = request.letters or random.sample(RANDOM_LETTERS, k=5)
    words = request.words or random.sample(RANDOM_WORDS, k=3)

    prompt = (
        f"Write a plain sentence for a typing test. "
        f"It must contain these letters: {', '.join(letters)} "
        f"and these words: {', '.join(words)}. "
        f"The sentence should be about {request.length} words long. "
        f"Do not explain, do not add extra text, only return the sentence."
    )

    logger.info("Received request for sentence generation.")
    response_text = model_service.generate(prompt)
    
    return {"text": response_text}