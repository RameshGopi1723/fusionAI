from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key='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',
    temperature=0.0,
    max_retries=2,
    # other params...
)

messages = [
    ("system", "You are a helpful translator. Translate the user sentence to French."),
    ("human", "I love programming."),
]


# print(llm.invoke(messages))


for chunk in llm.stream(messages):
    print(chunk.text(), end="")


