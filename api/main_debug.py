import os
import sys
from fastapi import FastAPI

# Print debug info
print(f"🐍 Python version: {sys.version}")
print(f"🌐 PORT environment variable: {os.getenv('PORT', 'NOT_SET')}")
print(f"📁 Current working directory: {os.getcwd()}")
print(f"📝 Available files: {os.listdir('.')}")

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "Hello from FastAPI!",
        "port": os.getenv("PORT", "8000"),
        "cwd": os.getcwd()
    }

@app.get("/health")
def health():
    return {"status": "healthy", "port": os.getenv("PORT", "8000")}

@app.get("/debug")
def debug():
    return {
        "env_vars": dict(os.environ),
        "cwd": os.getcwd(),
        "files": os.listdir('.'),
        "python_version": sys.version
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 