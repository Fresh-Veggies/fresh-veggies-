from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create minimal FastAPI app
app = FastAPI(
    title="Fresh Veggies API - Minimal",
    description="Minimal version for testing Railway deployment",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🥬 Fresh Veggies API - Minimal Version",
        "status": "running",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "port": os.getenv("PORT", "8000")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "message": "API is running successfully"
    }

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    return {
        "message": "API test successful",
        "endpoints": {
            "root": "/",
            "health": "/health",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main_minimal:app", host="0.0.0.0", port=port) 