import fastapi
from superheroes.req2test.api import register_req2test_api

app = fastapi.FastAPI()

@app.get("/")
def read_root():
    return {"The cake": "is a lie!"}

# Get target repository
@app.get("/repos/{repository}")
def read_item(repository: str):
    return {"repository": repository}

# Go to target assistant
@app.get("/assistant/{assistant}")
def read_item(assistant: str):
    return {"assistant": assistant}

register_req2test_api(app)