from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from redis import Redis
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Connect to Redis
redis = Redis(host="redis", port=6379, db=0)

# Pydantic model for POST request
class Item(BaseModel):
    key: str
    value: str

@app.get("/data/{key}")
def get_data(key: str):
    value = redis.get(key)
    if value:
        return {"key": key, "value": value.decode("utf-8")}
    raise HTTPException(status_code=404, detail="Key not found")

@app.post("/data")
def post_data(item: Item):
    redis.set(item.key, item.value)
    return {"message": "Data stored successfully", "key": item.key, "value": item.value}
