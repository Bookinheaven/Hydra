from fastapi import FastAPI
from pydantic import BaseModel
import random
import re

app = FastAPI(title="Hydra AI Typing Engine", version="0.1.0")

class GenerateRequest(BaseModel):
    letters: str = None
    words: int = 50
    length: str = "medium"


# --- Markov-chain-based adaptive text generator ---

# A comprehensive training corpus of natural English sentences
TRAINING_CORPUS = """
The quick brown fox jumps over the lazy dog near the quiet river bank.
A clean architecture strictly separates business logic from the user interface.
Programming is not about typing fast but about thinking clearly and solving problems.
In the future adaptive algorithms will automatically detect your weak keys.
Consistent practice builds muscle memory and helps you achieve incredible speeds.
The best way to predict the future is to invent it with your own hands.
Every great developer you know got there by solving problems they were unqualified to solve.
Code is like humor and when you have to explain it then it is bad code.
Simplicity is the ultimate sophistication in both design and engineering.
Good software like wine takes time to develop and age properly.
The function of good software is to make the complex appear simple.
First solve the problem and then write the elegant code to fix it.
Experience is the name everyone gives to their collection of past mistakes.
Any fool can write code that a computer can understand but good developers write code humans understand.
Make it work first then make it right and finally make it fast.
Software is a great combination between artistry and engineering skill.
The most important property of a program is whether it accomplishes the intention.
Perfection is achieved not when there is nothing more to add but when there is nothing left.
Before software can be reusable it first has to be usable by someone.
A program that has not been tested does not work at all in production.
Walking on water and developing software from a specification are easy if both are frozen.
The computer was born to solve problems that did not exist before its creation.
Truth can only be found in one place and that is in the source code itself.
When debugging you must assume that everything you believe is possibly wrong.
If you want to go fast then go alone but if you want to go far go together.
Technology is best when it brings people together and helps them communicate.
The advance of technology is based on making it fit in so you do not notice it.
Innovation distinguishes between a leader and a follower in the market.
The only way to do great work is to love what you do every single day.
Stay hungry and stay foolish because that is how you change the world.
Real artists ship their products and do not wait for perfection to arrive.
Life is what happens when you are busy making other plans for the future.
The secret of getting ahead is getting started on the work right now.
It does not matter how slowly you go as long as you do not stop moving.
In three words I can sum up everything I learned about life and it goes on.
The greatest glory in living lies not in never falling but in rising every time.
Tell me and I forget but teach me and I may remember but involve me and I learn.
The purpose of our lives is to be happy and to find meaning in our work.
Life is really simple but we insist on making it far more complicated than needed.
You only live once but if you do it right then once is more than enough.
The way to get started is to quit talking and begin doing the actual work.
If life were predictable it would cease to be life and be without any flavor.
Spread love everywhere you go and let no one ever come to you without leaving happier.
The future belongs to those who believe in the beauty of their dreams.
It is during our darkest moments that we must focus to see the light ahead.
Do not judge each day by the harvest you reap but by the seeds that you plant.
""".strip()


def build_markov_chain(text: str, order: int = 2) -> dict:
    """Build a Markov chain dictionary from training text."""
    words = text.split()
    chain = {}
    for i in range(len(words) - order):
        key = tuple(words[i : i + order])
        next_word = words[i + order]
        if key not in chain:
            chain[key] = []
        chain[key].append(next_word)
    return chain


def generate_markov(chain: dict, word_count: int, order: int = 2) -> str:
    """Generate text using a Markov chain."""
    if not chain:
        return ""

    keys = list(chain.keys())
    # Prefer starting with a capitalized word for natural sentence starts
    cap_keys = [k for k in keys if k[0][0].isupper()]
    current = random.choice(cap_keys if cap_keys else keys)
    result = list(current)

    for _ in range(word_count - order):
        if current in chain:
            next_word = random.choice(chain[current])
            result.append(next_word)
            current = tuple(result[-order:])
        else:
            # Jump to a random key if we hit a dead end
            current = random.choice(keys)
            result.append(current[0])

    return " ".join(result[:word_count])


def apply_weak_key_focus(text: str, letters: str) -> str:
    """If specific weak letters are provided, bias the output toward words containing them."""
    if not letters:
        return text

    target_chars = set(letters.lower())
    words = text.split()
    
    # Collect words that contain at least one target letter
    corpus_words = TRAINING_CORPUS.lower().split()
    # Deduplicate and clean
    target_words = list(set(
        re.sub(r'[^a-z]', '', w) for w in corpus_words
        if any(c in w.lower() for c in target_chars) and len(re.sub(r'[^a-z]', '', w)) > 1
    ))

    if not target_words:
        return text

    # Replace ~40% of words with target-letter-containing words
    for i in range(len(words)):
        if random.random() < 0.4 and target_words:
            words[i] = random.choice(target_words)

    return " ".join(words)


# Build the chain once at startup
MARKOV_CHAIN = build_markov_chain(TRAINING_CORPUS, order=2)


@app.post("/api/generate/")
async def generate_passage(req: GenerateRequest):
    word_count = max(5, min(500, req.words))
    
    # Generate base text using Markov chain
    text = generate_markov(MARKOV_CHAIN, word_count, order=2)

    # Apply weak-key focus if the frontend requests it
    if req.letters:
        text = apply_weak_key_focus(text, req.letters)

    # Clean up: remove double spaces, normalize
    text = " ".join(text.split())
    # Make it lowercase for typing practice (cleaner)
    text = text.lower()

    return {"text": text}


@app.get("/health")
async def health():
    return {"status": "ok", "engine": "markov-v1"}
