import os
import threading
from gpt4all import GPT4All
from app.core import config
from app.utils.logger import logger

class ModelService:
    def __init__(self):
        self.model = None
        self.lock = threading.Lock() 
        self.load_model()

    def load_model(self):
        """Loads the GPT4All model, downloading it if necessary."""
        try:
            os.makedirs(config.MODEL_FOLDER, exist_ok=True)
            logger.info(f"Ensuring model is in custom path: {config.MODEL_FOLDER}")

            self.model = GPT4All(
                model_name=config.MODEL_FILENAME,
                model_path=config.MODEL_FOLDER,
                device="gpu"
            )
            logger.info("✅ Model loaded successfully.")
        except Exception as e:
            logger.error(f"FATAL: Could not load or download model. Error: {e}")
            self.model = None

    def generate(self, prompt: str) -> str:
        """Generates a sentence from a prompt, protected by a lock."""
        if not self.model:
            logger.error("Model is not loaded, cannot generate.")
            return "Error: The AI model is not available."

        try:
            with self.lock: 
                logger.info("Lock acquired, generating response...")
                with self.model.chat_session():
                    response = self.model.generate(
                        prompt,
                        max_tokens=200,
                        temp=0.7,
                    )
            
            clean_response = response.strip().split("\n")[0]
            logger.info(f"Generated response: {clean_response}")
            return clean_response
        except Exception as e:
            logger.error(f"An error occurred during model generation: {e}")
            return "The quick brown fox jumps over the lazy dog."

model_service = ModelService()