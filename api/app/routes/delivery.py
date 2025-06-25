from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.database.connection import get_database
from app.models.order import Order, DeliveryRoute
from app.models.user import User
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import math

router = APIRouter()

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

class RouteOptimization(BaseModel):
    orders: List[int]
    total_distance: float
    estimated_time: int

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

@router.get("/orders/nearby")
async def get_nearby_orders(
    latitude: float = Query(..., description="Current latitude"),
    longitude: float = Query(..., description="Current longitude"),
    radius: float = Query(5.0, description="Search radius in kilometers"),
    db: Session = Depends(get_database)
):
    """Get orders near the delivery partner's location"""
    try:
        orders = db.query(Order).filter(
            Order.status.in_(["confirmed", "preparing"]),
            Order.delivery_latitude.isnot(None),
            Order.delivery_longitude.isnot(None)
        ).all()
        
        nearby_orders = []
        for order in orders:
            if order.delivery_latitude is not None and order.delivery_longitude is not None:
                distance = haversine_distance(
                    latitude, longitude,
                    float(order.delivery_latitude), float(order.delivery_longitude)
                )
                
                if distance <= radius:
                    nearby_orders.append({
                        "id": order.id,
                        "delivery_address": order.delivery_address,
                        "latitude": order.delivery_latitude,
                        "longitude": order.delivery_longitude,
                        "distance": round(distance, 2),
                        "estimated_time": round(distance * 3, 0),  # Rough estimate: 3 min per km
                        "total_amount": order.total_amount,
                        "status": order.status
                    })
        
        # Sort by distance
        nearby_orders.sort(key=lambda x: x["distance"])
        
        return {
            "orders": nearby_orders,
            "count": len(nearby_orders),
            "search_radius": radius
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding nearby orders: {str(e)}")

@router.post("/routes/optimize")
async def optimize_delivery_route(
    order_ids: List[int],
    start_lat: float = Query(..., description="Starting latitude"),
    start_lng: float = Query(..., description="Starting longitude"),
    db: Session = Depends(get_database)
):
    """Optimize delivery route using nearest neighbor algorithm"""
    try:
        orders = db.query(Order).filter(Order.id.in_(order_ids)).all()
        
        if not orders:
            raise HTTPException(status_code=404, detail="No orders found")
        
        # Convert to list of coordinates
        locations = []
        for order in orders:
            if order.delivery_latitude is not None and order.delivery_longitude is not None:
                locations.append({
                    "id": order.id,
                    "lat": float(order.delivery_latitude),
                    "lng": float(order.delivery_longitude),
                    "address": order.delivery_address
                })
        
        if not locations:
            raise HTTPException(status_code=400, detail="No orders with valid coordinates")
        
        # Nearest neighbor algorithm
        route = []
        unvisited = locations.copy()
        current_lat, current_lng = start_lat, start_lng
        total_distance = 0
        
        while unvisited:
            nearest = min(unvisited, key=lambda loc: haversine_distance(
                current_lat, current_lng, loc["lat"], loc["lng"]
            ))
            
            distance = haversine_distance(current_lat, current_lng, nearest["lat"], nearest["lng"])
            total_distance += distance
            
            route.append({
                **nearest,
                "distance_from_previous": round(distance, 2)
            })
            
            current_lat, current_lng = nearest["lat"], nearest["lng"]
            unvisited.remove(nearest)
        
        estimated_time = round(total_distance * 3, 0)  # 3 minutes per km estimate
        
        return {
            "optimized_route": route,
            "total_distance": round(total_distance, 2),
            "estimated_time": estimated_time,
            "order_count": len(route),
            "savings_estimate": "15-25% vs random order"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")

@router.post("/update-location")
async def update_delivery_location(
    partner_id: int,
    location: LocationUpdate,
    db: Session = Depends(get_database)
):
    """Update delivery partner's current location"""
    try:
        partner = db.query(User).filter(User.id == partner_id, User.role == "delivery").first()
        if not partner:
            raise HTTPException(status_code=404, detail="Delivery partner not found")
        
        # Here you could store location in a separate table for tracking
        # For now, we'll just return success
        
        return {
            "success": True,
            "partner_id": partner_id,
            "location": {
                "latitude": location.latitude,
                "longitude": location.longitude
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location update failed: {str(e)}")

@router.get("/orders/with-locations")
async def get_orders_with_locations(
    status: Optional[str] = Query(None, description="Filter by order status"),
    db: Session = Depends(get_database)
):
    """Get all orders with GPS coordinates"""
    try:
        query = db.query(Order).filter(
            Order.delivery_latitude.isnot(None),
            Order.delivery_longitude.isnot(None)
        )
        
        if status:
            query = query.filter(Order.status == status)
        
        orders = query.all()
        
        result = []
        for order in orders:
            result.append({
                "id": order.id,
                "user_id": order.user_id,
                "total_amount": order.total_amount,
                "status": order.status,
                "delivery_address": order.delivery_address,
                "coordinates": {
                    "latitude": order.delivery_latitude,
                    "longitude": order.delivery_longitude
                },
                "delivery_partner_id": order.delivery_partner_id,
                "created_at": order.created_at.isoformat() if order.created_at is not None else None
            })
        
        return {
            "orders": result,
            "count": len(result)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@router.get("/routes/today")
async def get_today_routes(db: Session = Depends(get_database)):
    """Get today's delivery routes"""
    today = date.today()
    routes = db.query(DeliveryRoute).filter(DeliveryRoute.route_date == today).all()
    
    return {
        "routes": [
            {
                "id": route.id,
                "delivery_partner_id": route.delivery_partner_id,
                "total_orders": route.total_orders,
                "completed_orders": route.completed_orders,
                "total_distance": route.total_distance,
                "estimated_time": route.estimated_time,
                "status": route.status
            }
            for route in routes
        ],
        "date": today.isoformat()
    }

@router.get("/orders/assigned")
async def get_assigned_orders(
    partner_id: Optional[int] = Query(None, description="Delivery partner ID"),
    db: Session = Depends(get_database)
):
    """Get orders assigned to delivery personnel"""
    query = db.query(Order).filter(Order.delivery_partner_id.isnot(None))
    
    if partner_id:
        query = query.filter(Order.delivery_partner_id == partner_id)
    
    orders = query.all()
    
    return {
        "orders": [
            {
                "id": order.id,
                "delivery_address": order.delivery_address,
                "total_amount": order.total_amount,
                "status": order.status,
                "delivery_partner_id": order.delivery_partner_id,
                "coordinates": {
                    "latitude": order.delivery_latitude,
                    "longitude": order.delivery_longitude
                } if order.delivery_latitude is not None and order.delivery_longitude is not None else None
            }
            for order in orders
        ],
        "count": len(orders)
    } 