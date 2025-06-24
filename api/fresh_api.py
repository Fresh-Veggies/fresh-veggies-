#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import urllib.parse
import base64
import hashlib
import uuid
from datetime import datetime, timedelta
import sqlite3
import threading

# In-memory database for now (will switch to PostgreSQL later)
class SimpleDB:
    def __init__(self):
        self.users = {}
        self.products = self._init_products()
        self.orders = {}
        self.sessions = {}
        self.lock = threading.Lock()
    
    def _init_products(self):
        return {
            "1": {
                "id": "1",
                "name": "Fresh Tomatoes",
                "category": "Vegetables",
                "price": 45.00,
                "unit": "kg",
                "image": "/images/tomatoes.jpg",
                "description": "Fresh red tomatoes, perfect for cooking",
                "stock": 100,
                "featured": True
            },
            "2": {
                "id": "2", 
                "name": "Organic Carrots",
                "category": "Vegetables",
                "price": 35.00,
                "unit": "kg",
                "image": "/images/carrots.jpg",
                "description": "Organic carrots, sweet and crunchy",
                "stock": 150,
                "featured": True
            },
            "3": {
                "id": "3",
                "name": "Fresh Spinach",
                "category": "Leafy Greens",
                "price": 25.00,
                "unit": "bunch",
                "image": "/images/spinach.jpg", 
                "description": "Fresh green spinach leaves",
                "stock": 80,
                "featured": False
            },
            "4": {
                "id": "4",
                "name": "Red Onions",
                "category": "Vegetables",
                "price": 30.00,
                "unit": "kg",
                "image": "/images/onions.jpg",
                "description": "Fresh red onions for cooking",
                "stock": 200,
                "featured": True
            }
        }

# Global database instance
db = SimpleDB()

class FreshVeggiesAPI(http.server.BaseHTTPRequestHandler):
    def _send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())

    def _get_auth_user(self):
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header[7:]  # Remove 'Bearer '
        with db.lock:
            return db.sessions.get(token)

    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Health check
        if path == '/health':
            self._send_json_response({
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "database": "connected",
                "version": "2.0.0"
            })
            return
        
        # Root endpoint
        elif path == '/':
            self._send_json_response({
                "message": "Fresh Veggies API",
                "version": "2.0.0",
                "endpoints": {
                    "health": "/health",
                    "products": "/api/products",
                    "auth": "/api/auth/*",
                    "orders": "/api/orders",
                    "user": "/api/user/*"
                }
            })
            return
        
        # API Routes
        elif path == '/api/products':
            self._handle_get_products()
            return
            
        elif path.startswith('/api/products/'):
            product_id = path.split('/')[-1]
            self._handle_get_product(product_id)
            return
            
        elif path == '/api/user/profile':
            self._handle_get_profile()
            return
            
        elif path == '/api/user/orders':
            self._handle_get_user_orders()
            return
            
        # 404 for unknown routes
        else:
            self._send_json_response({"error": "Not found", "path": path}, 404)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(post_data)
        except json.JSONDecodeError:
            self._send_json_response({"error": "Invalid JSON"}, 400)
            return
            
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/auth/register':
            self._handle_register(data)
        elif path == '/api/auth/login':
            self._handle_login(data)
        elif path == '/api/orders':
            self._handle_create_order(data)
        else:
            self._send_json_response({"error": "Not found", "path": path}, 404)

    # Auth handlers
    def _handle_register(self, data):
        required_fields = ['email', 'password', 'name']
        if not all(field in data for field in required_fields):
            self._send_json_response({"error": "Missing required fields"}, 400)
            return
        
        email = data['email'].lower()
        
        with db.lock:
            if email in db.users:
                self._send_json_response({"error": "User already exists"}, 400)
                return
            
            user_id = str(uuid.uuid4())
            db.users[email] = {
                "id": user_id,
                "email": email,
                "name": data['name'],
                "password": self._hash_password(data['password']),
                "role": "customer",
                "created_at": datetime.now().isoformat()
            }
        
        self._send_json_response({
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "email": email,
                "name": data['name'],
                "role": "customer"
            }
        }, 201)

    def _handle_login(self, data):
        if 'email' not in data or 'password' not in data:
            self._send_json_response({"error": "Email and password required"}, 400)
            return
        
        email = data['email'].lower()
        password_hash = self._hash_password(data['password'])
        
        with db.lock:
            user = db.users.get(email)
            if not user or user['password'] != password_hash:
                self._send_json_response({"error": "Invalid credentials"}, 401)
                return
            
            # Create session token
            token = str(uuid.uuid4())
            db.sessions[token] = {
                "user_id": user['id'],
                "email": email,
                "name": user['name'],
                "role": user['role'],
                "expires_at": (datetime.now() + timedelta(days=7)).isoformat()
            }
        
        self._send_json_response({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "email": email,
                "name": user['name'],
                "role": user['role']
            }
        })

    # Product handlers
    def _handle_get_products(self):
        with db.lock:
            products = list(db.products.values())
        
        self._send_json_response({
            "products": products,
            "total": len(products)
        })

    def _handle_get_product(self, product_id):
        with db.lock:
            product = db.products.get(product_id)
        
        if not product:
            self._send_json_response({"error": "Product not found"}, 404)
            return
        
        self._send_json_response({"product": product})

    # User handlers
    def _handle_get_profile(self):
        user = self._get_auth_user()
        if not user:
            self._send_json_response({"error": "Authentication required"}, 401)
            return
        
        self._send_json_response({"user": user})

    def _handle_get_user_orders(self):
        user = self._get_auth_user()
        if not user:
            self._send_json_response({"error": "Authentication required"}, 401)
            return
        
        with db.lock:
            user_orders = [order for order in db.orders.values() 
                          if order.get('user_id') == user['user_id']]
        
        self._send_json_response({
            "orders": user_orders,
            "total": len(user_orders)
        })

    # Order handlers
    def _handle_create_order(self, data):
        user = self._get_auth_user()
        if not user:
            self._send_json_response({"error": "Authentication required"}, 401)
            return
        
        required_fields = ['items', 'delivery_address']
        if not all(field in data for field in required_fields):
            self._send_json_response({"error": "Missing required fields"}, 400)
            return
        
        # Calculate total
        total_amount = 0
        order_items = []
        
        with db.lock:
            for item in data['items']:
                product = db.products.get(item['product_id'])
                if not product:
                    self._send_json_response({"error": f"Product {item['product_id']} not found"}, 400)
                    return
                
                quantity = item['quantity']
                item_total = product['price'] * quantity
                total_amount += item_total
                
                order_items.append({
                    "product_id": item['product_id'],
                    "name": product['name'],
                    "price": product['price'],
                    "quantity": quantity,
                    "total": item_total
                })
            
            # Create order
            order_id = str(uuid.uuid4())
            order = {
                "id": order_id,
                "user_id": user['user_id'],
                "items": order_items,
                "total_amount": total_amount,
                "delivery_address": data['delivery_address'],
                "status": "pending",
                "created_at": datetime.now().isoformat(),
                "estimated_delivery": (datetime.now() + timedelta(days=2)).isoformat()
            }
            
            db.orders[order_id] = order
        
        self._send_json_response({
            "message": "Order created successfully",
            "order": order
        }, 201)

    def log_message(self, format, *args):
        print(f"[{datetime.now().isoformat()}] {format % args}")

if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Fresh Veggies API server on port {PORT}")
    print(f"🌐 Health: http://localhost:{PORT}/health")
    print(f"📦 Products: http://localhost:{PORT}/api/products")
    print(f"🔐 Auth: http://localhost:{PORT}/api/auth/login")
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), FreshVeggiesAPI) as httpd:
            print(f"✅ Fresh Veggies API running on 0.0.0.0:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        raise 