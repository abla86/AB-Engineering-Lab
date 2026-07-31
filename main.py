from fastapi import FastAPI

app = FastAPI(
    title="Learning API",
    version="1.0.0",
    description="Mitt forste FastAPI-prosjekt"
)

@app.get("/")
def root():
    return {"message": "Hei Anne Beth!"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Hei {name}!"}
