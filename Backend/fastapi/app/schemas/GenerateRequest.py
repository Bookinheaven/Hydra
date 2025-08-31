from pydantic import BaseModel, Field
from typing import List

class GenerateRequest(BaseModel):
    letters: List[str] = Field(default_factory=list)
    words: List[str] = Field(default_factory=list)
    length: int = 20