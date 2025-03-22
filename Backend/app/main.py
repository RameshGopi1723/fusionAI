from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.auth.authRoute import auth_router
from api.v1.chat.chatRoute import chat_router
from utils import config

app = FastAPI()

# Configure CORS
origins = ["*"] # "http://localhost:5173",


app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


app.include_router(auth_router, prefix = config.FUSION_AI_API_PREFIX + "/auth", tags = ["auth"])
app.include_router(chat_router, prefix = config.FUSION_AI_API_PREFIX + "/chat", tags = ["chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host = "0.0.0.0", port = 8000, reload = True)