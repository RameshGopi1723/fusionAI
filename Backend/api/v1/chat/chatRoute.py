from fastapi import HTTPException, APIRouter, Depends
from core.controllers.chat.chatController import get_response
from api.v1.chat.chatSchema import Prompt
from fastapi import Request
from utils.dependency.decorators import Protected_Route

chat_router = APIRouter()


@chat_router.post("/lumina")
@Protected_Route
async def chat(prompt: Prompt, request: Request):
    user_prompt = prompt.prompt
    print("User Prompt: ", user_prompt)
    try:
        chat_llm_response = get_response(user_prompt)
        return {"response": chat_llm_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
