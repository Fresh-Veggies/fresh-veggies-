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

# Trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.ENVIRONMENT == "development" else ["yourdomain.com"]
)

# Database initialization
@app.on_event("startup")
async def startup_event():
    """Initialize database tables and seed data"""
    try:
        print("🚀 Initializing Fresh Veggies API...")
        create_tables()
        print("✅ Database tables created successfully")
        
        # Seed initial data
        from app.database.seed import seed_database
        await seed_database()
        print("✅ Database seeded with initial data")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Don't crash the app, let it start anyway
        print("⚠️ App will continue without full database initialization")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    try:
        # Test database connection
        db = next(get_database())
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        print(f"Database health check failed: {e}")
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
        "version": "2.0.0",
        "timestamp": "2024-06-24T23:30:00Z"
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