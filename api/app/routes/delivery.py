from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_database

router = APIRouter()

@router.get("/routes/today")
async def get_today_routes(db: Session = Depends(get_database)):
    """Get today's delivery routes"""
    return {"routes": [], "message": "Delivery routes endpoint working"}

@router.get("/orders/assigned")
async def get_assigned_orders(db: Session = Depends(get_database)):
    """Get orders assigned to delivery personnel"""
    return {"orders": [], "message": "Assigned orders endpoint working"} 