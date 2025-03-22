from typing import Optional
from pydantic import BaseModel

class Prompt(BaseModel):
    prompt: Optional[str] = None