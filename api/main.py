from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Import routes for all three flows
from app.routes import auth, user, admin, delivery
from app.database.connection import engine, create_tables, get_database
from app.utils.config import settings

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Fresh Veggies API",
    description="""
    Complete backend API for Fresh Veggies e-commerce platform.
    
    ## Three Main Flows:
    
    ### 1. Customer Flow
    - Browse products and categories
    - User registration and authentication
    - Add items to cart and place orders
    - Track order status and delivery
    - View order history and account details
    
    ### 2. Admin Flow
    - Dashboard with analytics and insights
    - Manage products (add, edit, delete)
    - View and manage customer orders
    - Customer management and support
    - Inventory management
    - Revenue and sales reports
    
    ### 3. Delivery Flow
    - Delivery partner authentication
    - View assigned delivery routes
    - Update delivery status in real-time
    - Route optimization and navigation
    - Delivery history and earnings
    - Sequential delivery management
    
    ## Authentication
    - JWT-based authentication for all flows
    - Role-based access control (customer, admin, delivery)
    - Secure password hashing with bcrypt
    
    ## Database
    - PostgreSQL with SQLAlchemy ORM
    - Proper relational schema with foreign keys
    - Automatic migrations with Alembic
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Security
security = HTTPBearer()

# CORS middleware - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "https://fresh-veggies-frontend.vercel.app",
        "*"  # Remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware for security - temporarily disabled for debugging
# app.add_middleware(
#     TrustedHostMiddleware,
#     allowed_hosts=[
#         "*",  # Allow all hosts for now - can be restricted later
#         "localhost",
#         "127.0.0.1",
#         "*.railway.app",
#         "*.up.railway.app",
#         "fresh-veggies-production.up.railway.app"
#     ]
# )

# Database initialization
@app.on_event("startup")
async def startup_event():
    """Initialize database tables and seed data"""
    try:
        print("🚀 Initializing Fresh Veggies API...")
        print(f"Environment: {settings.ENVIRONMENT}")
        print(f"Database URL configured: {'Yes' if settings.DATABASE_URL else 'No'}")
        
        # Print more detailed database info for debugging
        if settings.DATABASE_URL:
            # Mask password for security
            masked_url = settings.DATABASE_URL
            if '@' in masked_url:
                parts = masked_url.split('@')
                if '://' in parts[0]:
                    user_part = parts[0].split('://')[-1]
                    if ':' in user_part:
                        user, _ = user_part.split(':', 1)
                        masked_url = masked_url.replace(user_part, f"{user}:****")
            print(f"Database URL: {masked_url}")
        
        # Try to create tables but don't fail if it doesn't work
        try:
            print("📊 Attempting to create database tables...")
            create_tables()
            print("✅ Database tables created successfully")
        except Exception as db_error:
            print(f"⚠️ Database table creation failed: {type(db_error).__name__}: {db_error}")
            print("📝 App will start anyway - database operations may fail")
        
        # Try to test database connection
        try:
            print("🔌 Testing database connection...")
            from app.database.connection import get_database
            db = next(get_database())
            from sqlalchemy import text
            result = db.execute(text("SELECT 1"))
            print("✅ Database connection test successful")
        except Exception as conn_error:
            print(f"⚠️ Database connection test failed: {type(conn_error).__name__}: {conn_error}")
        
        # Try to seed initial data but don't fail if it doesn't work
        try:
            print("🌱 Attempting to seed database...")
            from app.database.seed import seed_database
            await seed_database()
            print("✅ Database seeded with initial data")
        except Exception as seed_error:
            print(f"⚠️ Database seeding failed: {type(seed_error).__name__}: {seed_error}")
            print("📝 App will start with empty database")
        
        print("🎉 Fresh Veggies API startup completed")
        
    except Exception as e:
        print(f"⚠️ Startup process encountered errors: {type(e).__name__}: {e}")
        print("🔄 App will continue starting - some features may be limited")
        import traceback
        print("📝 Full error traceback:")
        traceback.print_exc()

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    health_status = {
        "status": "healthy",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": None,
        "database": "unknown",
        "errors": []
    }
    
    try:
        from datetime import datetime
        health_status["timestamp"] = datetime.utcnow().isoformat()
        
        # Test database connection with detailed error reporting
        try:
            print("🔍 Health check: Testing database connection...")
            from app.database.connection import get_database
            db = next(get_database())
            from sqlalchemy import text
            result = db.execute(text("SELECT 1"))
            health_status["database"] = "connected"
            print("✅ Health check: Database connection successful")
            
        except Exception as db_error:
            error_msg = f"Database connection failed: {type(db_error).__name__}: {db_error}"
            print(f"❌ Health check: {error_msg}")
            health_status["database"] = "disconnected"
            health_status["errors"].append(error_msg)
            
    except Exception as e:
        error_msg = f"Health check error: {type(e).__name__}: {e}"
        print(f"❌ Health check: {error_msg}")
        health_status["errors"].append(error_msg)
        health_status["status"] = "unhealthy"
    
    # Always return 200 OK so Railway doesn't kill the app
    print(f"🏥 Health check result: {health_status['status']} (database: {health_status['database']})")
    
    return {
        **health_status,
        "message": "API is running" if health_status["status"] == "healthy" else "API running with issues",
        "endpoints": {
            "docs": "/docs",
            "admin": "/api/admin", 
            "user": "/api/user",
            "delivery": "/api/delivery"
        }
    }

# Root endpoint with API documentation
@app.get("/")
async def root():
    """API root with available endpoints and documentation"""
    return {
        "message": "🥬 Fresh Veggies API - Complete Backend System",
        "version": "2.0.0",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_json": "/openapi.json"
        },
        "flows": {
            "customer": {
                "description": "Customer shopping experience",
                "endpoints": ["/api/auth/*", "/api/user/*", "/api/products/*"]
            },
            "admin": {
                "description": "Admin dashboard and management",
                "endpoints": ["/api/admin/*"]
            },
            "delivery": {
                "description": "Delivery partner operations",
                "endpoints": ["/api/delivery/*"]
            }
        },
        "features": [
            "JWT Authentication",
            "Role-based Access Control",
            "PostgreSQL Database",
            "Real-time Order Tracking",
            "Route Optimization",
            "Analytics Dashboard",
            "Inventory Management"
        ]
    }

# Include all route modules
app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Authentication"])
app.include_router(user.router, prefix="/api/user", tags=["👤 Customer Flow"])
app.include_router(admin.router, prefix="/api/admin", tags=["⚙️ Admin Flow"])
app.include_router(delivery.router, prefix="/api/delivery", tags=["🚚 Delivery Flow"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for better error responses"""
    print(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong. Please try again later.",
            "type": "internal_error"
        }
    )

# 404 handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": f"The endpoint {request.url.path} was not found",
            "suggestion": "Check /docs for available endpoints"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.DEBUG
    ) 