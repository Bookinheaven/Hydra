import os

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_FOLDER = os.path.join(APP_DIR, "models")

MODEL_FILENAME = "Phi-3-mini-4k-instruct.Q4_0.gguf"
MODEL_PATH = os.path.join(MODEL_FOLDER, MODEL_FILENAME)

API_PREFIX = "/api"