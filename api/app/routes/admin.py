from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_database

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_database)):
    """Get admin dashboard statistics"""
    return {
        "today_orders": 0,
        "today_revenue": 0,
        "pending_orders": 0,
        "total_customers": 0,
        "message": "Admin dashboard working"
    }

@router.get("/orders")
async def get_all_orders(db: Session = Depends(get_database)):
    """Get all orders for admin"""
    return {"orders": [], "message": "Admin orders endpoint working"} 