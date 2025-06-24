from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.connection import get_database
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order, OrderItem
from app.routes.auth import get_current_active_user

router = APIRouter()

# Pydantic models
class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    unit: str
    category_id: int
    category_name: str
    stock_quantity: int
    is_featured: bool
    image_url: str

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    delivery_address: str
    delivery_phone: str
    delivery_notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    delivery_address: str
    delivery_phone: str
    created_at: datetime
    items: List[dict]

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Product endpoints
@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category_id: Optional[int] = None,
    featured_only: Optional[bool] = False,
    db: Session = Depends(get_database)
):
    """Get all products for customers with optional filtering"""
    query = db.query(Product).join(Category).filter(Product.is_active == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if featured_only:
        query = query.filter(Product.is_featured == True)
    
    products = query.all()
    
    return [
        ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description or "",
            price=product.price,
            unit=product.unit,
            category_id=product.category_id,
            category_name=product.category.name,
            stock_quantity=product.stock_quantity,
            is_featured=product.is_featured,
            image_url=product.image_url or ""
        )
        for product in products
    ]

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_database)):
    """Get specific product details"""
    product = db.query(Product).join(Category).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return ProductResponse(
        id=product.id,
        name=product.name,
        description=product.description or "",
        price=product.price,
        unit=product.unit,
        category_id=product.category_id,
        category_name=product.category.name,
        stock_quantity=product.stock_quantity,
        is_featured=product.is_featured,
        image_url=product.image_url or ""
    )

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_database)):
    """Get all product categories"""
    categories = db.query(Category).filter(Category.is_active == True).all()
    
    return [
        CategoryResponse(
            id=category.id,
            name=category.name,
            description=category.description or ""
        )
        for category in categories
    ]

# Order endpoints
@router.post("/orders", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_database)
):
    """Create new order for customer"""
    
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate total and validate products
    total_amount = 0
    order_items_data = []
    
    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}"
            )
        
        item_total = product.price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price,
            "total_price": item_total
        })
    
    # Create order
    db_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        delivery_address=order_data.delivery_address,
        delivery_phone=order_data.delivery_phone,
        delivery_notes=order_data.delivery_notes,
        status="pending"
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"]
        )
        db.add(db_order_item)
        
        # Update product stock
        item_data["product"].stock_quantity -= item_data["quantity"]
    
    db.commit()
    
    # Prepare response
    items = [
        {
            "product_id": item_data["product"].id,
            "product_name": item_data["product"].name,
            "quantity": item_data["quantity"],
            "unit_price": item_data["unit_price"],
            "total_price": item_data["total_price"]
        }
        for item_data in order_items_data
    ]
    
    return OrderResponse(
        id=db_order.id,
        total_amount=db_order.total_amount,
        status=db_order.status,
        delivery_address=db_order.delivery_address,
        delivery_phone=db_order.delivery_phone,
        created_at=db_order.created_at,
        items=items
    )

@router.get("/orders", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_database)
):
    """Get all orders for current user"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        items = []
        for item in order.order_items:
            items.append({
                "product_id": item.product_id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price
            })
        
        result.append(OrderResponse(
            id=order.id,
            total_amount=order.total_amount,
            status=order.status,
            delivery_address=order.delivery_address,
            delivery_phone=order.delivery_phone,
            created_at=order.created_at,
            items=items
        ))
    
    return result

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_details(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_database)
):
    """Get specific order details"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    items = []
    for item in order.order_items:
        items.append({
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        })
    
    return OrderResponse(
        id=order.id,
        total_amount=order.total_amount,
        status=order.status,
        delivery_address=order.delivery_address,
        delivery_phone=order.delivery_phone,
        created_at=order.created_at,
        items=items
    )

# Profile endpoints
@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "address": current_user.address,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }

@router.put("/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_database)
):
    """Update user profile"""
    
    if profile_data.name:
        current_user.name = profile_data.name
    if profile_data.phone:
        current_user.phone = profile_data.phone
    if profile_data.address:
        current_user.address = profile_data.address
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully",
        "profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "address": current_user.address
        }
    } 