from datetime import datetime
from langchain_groq import ChatGroq

# Initialize the ChatGroq instance
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key='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',
    temperature=1,
    max_retries=2,
)

# In-memory storage for conversation history
conversation_history = []

# Function to store a conversation
def store_conversation(user_message, bot_response):
    conversation_history.append({
        'user_message': user_message,
        'bot_response': bot_response,
        'timestamp': datetime.now()
    })

# Function to get a response from the model
def get_response(prompt: str) -> str:
    # Create the messages list including the entire conversation history
    messages = [
        ("system", "You are a helpful assistant. Respond to the user's message and resolve basic queries of the user."),
    ]

    for conversation in conversation_history:
        messages.append(("human", conversation['user_message']))
        messages.append(("assistant", conversation['bot_response']))

    messages.append(("human", prompt))

    response = ""
    
    for chunk in llm.stream(messages):
        response += chunk.text()
    
    # Store the conversation in memory
    store_conversation(prompt, response)

    return response