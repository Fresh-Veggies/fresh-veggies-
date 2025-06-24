from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order
from passlib.context import CryptContext
import asyncio

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    """Seed the database with initial data"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first() or db.query(Product).first():
            print("📊 Database already seeded, skipping...")
            return
        
        print("🌱 Seeding database with initial data...")
        
        # Create categories
        categories = [
            Category(name="Vegetables", description="Fresh vegetables"),
            Category(name="Fruits", description="Fresh seasonal fruits"),
            Category(name="Leafy Greens", description="Fresh leafy vegetables"),
            Category(name="Herbs", description="Fresh herbs and spices")
        ]
        
        for category in categories:
            db.add(category)
        db.commit()
        
        # Create admin user
        admin_user = User(
            email="admin@freshveggies.com",
            name="Admin User",
            password=pwd_context.hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin_user)
        
        # Create delivery user
        delivery_user = User(
            email="delivery@freshveggies.com",
            name="Delivery Partner",
            password=pwd_context.hash("delivery123"),
            role="delivery",
            is_active=True
        )
        db.add(delivery_user)
        
        # Create sample customer
        customer_user = User(
            email="customer@example.com",
            name="Sample Customer",
            password=pwd_context.hash("customer123"),
            role="customer",
            is_active=True
        )
        db.add(customer_user)
        db.commit()
        
        # Create products
        products = [
            Product(
                name="Fresh Tomatoes",
                description="Fresh red tomatoes, perfect for cooking and salads",
                price=45.00,
                unit="kg",
                category_id=1,
                stock_quantity=100,
                is_featured=True,
                image_url="/images/tomatoes.jpg"
            ),
            Product(
                name="Organic Carrots",
                description="Organic carrots, sweet and crunchy",
                price=35.00,
                unit="kg",
                category_id=1,
                stock_quantity=150,
                is_featured=True,
                image_url="/images/carrots.jpg"
            ),
            Product(
                name="Fresh Spinach",
                description="Fresh green spinach leaves, rich in iron",
                price=25.00,
                unit="bunch",
                category_id=3,
                stock_quantity=80,
                is_featured=False,
                image_url="/images/spinach.jpg"
            ),
            Product(
                name="Red Onions",
                description="Fresh red onions for cooking",
                price=30.00,
                unit="kg",
                category_id=1,
                stock_quantity=200,
                is_featured=True,
                image_url="/images/onions.jpg"
            ),
            Product(
                name="Fresh Apples",
                description="Crisp and sweet apples",
                price=80.00,
                unit="kg",
                category_id=2,
                stock_quantity=120,
                is_featured=True,
                image_url="/images/apples.jpg"
            ),
            Product(
                name="Green Capsicum",
                description="Fresh green bell peppers",
                price=60.00,
                unit="kg",
                category_id=1,
                stock_quantity=90,
                is_featured=False,
                image_url="/images/capsicum.jpg"
            ),
            Product(
                name="Fresh Coriander",
                description="Fresh coriander leaves for garnishing",
                price=15.00,
                unit="bunch",
                category_id=4,
                stock_quantity=50,
                is_featured=False,
                image_url="/images/coriander.jpg"
            ),
            Product(
                name="Bananas",
                description="Fresh ripe bananas",
                price=40.00,
                unit="dozen",
                category_id=2,
                stock_quantity=200,
                is_featured=True,
                image_url="/images/bananas.jpg"
            )
        ]
        
        for product in products:
            db.add(product)
        
        db.commit()
        print("✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close() 