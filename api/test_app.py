from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create simple test app
app = FastAPI(
    title="Fresh Veggies API - Local Test",
    description="Local test version without database dependencies",
    version="1.0.0-test"
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
        "message": "🥬 Fresh Veggies API - Local Test Version",
        "status": "running",
        "version": "1.0.0-test",
        "environment": "local",
        "note": "Database features disabled for local testing"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0-test",
        "message": "Local test API is running successfully",
        "database": "disabled"
    }

@app.get("/test")
async def test_endpoint():
    """Test endpoint"""
    return {
        "message": "Local test successful",
        "imports": "working",
        "fastapi": "✅",
        "auth": "ready",
        "database": "mocked for local testing"
    }

@app.post("/api/auth/test")
async def test_auth():
    """Test auth endpoint without database"""
    return {
        "message": "Auth endpoint test",
        "status": "working",
        "note": "Database authentication disabled for local testing"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Local Test Server...")
    print("📝 Database features are disabled")
    print("✅ Testing core FastAPI functionality")
    uvicorn.run("test_app:app", host="0.0.0.0", port=8000, reload=True) 