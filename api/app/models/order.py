from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    delivery_address = Column(Text, nullable=False)
    delivery_latitude = Column(Float)
    delivery_longitude = Column(Float)
    delivery_phone = Column(String(20))
    delivery_partner_id = Column(Integer, ForeignKey("users.id"))
    delivery_date = Column(DateTime)
    delivery_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders", foreign_keys=[user_id])
    delivery_partner = relationship("User", foreign_keys=[delivery_partner_id])
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

class DeliveryRoute(Base):
    __tablename__ = "delivery_routes"

    id = Column(Integer, primary_key=True, index=True)
    delivery_partner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    route_date = Column(Date, nullable=False)
    total_orders = Column(Integer, default=0)
    completed_orders = Column(Integer, default=0)
    total_distance = Column(Float)  # in kilometers
    estimated_time = Column(Integer)  # in minutes
    status = Column(String(20), default="pending")  # pending, in_progress, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    delivery_partner = relationship("User", back_populates="delivery_routes") 