from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_database

router = APIRouter()

@router.get("/products")
async def get_products(db: Session = Depends(get_database)):
    """Get all products for customers"""
    return {"products": [], "message": "Products endpoint working"}

@router.post("/orders")
async def create_order(db: Session = Depends(get_database)):
    """Create new order"""
    return {"message": "Order creation endpoint working"} 