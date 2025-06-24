from fastapi import FastAPI
import os

# Create minimal FastAPI app
app = FastAPI(title="Fresh Veggies API - Minimal")

@app.get("/")
async def root():
    return {"message": "Hello World", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "port": os.getenv("PORT", "8000")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000))
    ) 