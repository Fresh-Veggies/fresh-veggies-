# 🥬 Fresh Veggies Backend API

Complete backend system for Fresh Veggies e-commerce platform with three distinct user flows: Customer, Admin, and Delivery.

## 🚀 Live Deployment

**API Base URL:** `https://fresh-veggies-production.up.railway.app`

- **API Documentation:** [/docs](https://fresh-veggies-production.up.railway.app/docs)
- **Health Check:** [/health](https://fresh-veggies-production.up.railway.app/health)
- **OpenAPI Schema:** [/openapi.json](https://fresh-veggies-production.up.railway.app/openapi.json)

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Three Main Flows](#three-main-flows)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication & Security](#authentication--security)
- [Deployment](#deployment)
- [Development Setup](#development-setup)
- [Testing](#testing)

## 🏗️ Architecture Overview

### Technology Stack

- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **Deployment:** Railway.app with Docker
- **Documentation:** Automatic OpenAPI/Swagger generation

### Key Features

- **Role-based Access Control** (Customer, Admin, Delivery)
- **Real-time Order Tracking**
- **Route Optimization** for delivery
- **Analytics Dashboard** for admin
- **RESTful API Design**
- **Comprehensive Error Handling**
- **CORS Support** for frontend integration

## 👥 Three Main Flows

### 1. 🛒 Customer Flow

**Target Users:** End customers buying vegetables

**Core Features:**
- User registration and authentication
- Browse products by category
- Add items to cart and place orders
- Track order status and delivery
- View order history
- Manage account details

**Key Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/products` - Browse products
- `POST /api/user/orders` - Place order
- `GET /api/user/orders` - Order history
- `GET /api/user/profile` - User profile

### 2. ⚙️ Admin Flow

**Target Users:** Business administrators and managers

**Core Features:**
- Dashboard with analytics and insights
- Product management (CRUD operations)
- Order management and processing
- Customer management
- Inventory tracking
- Revenue and sales reports
- Delivery partner management

**Key Endpoints:**
- `GET /api/admin/dashboard/stats` - Analytics dashboard
- `GET /api/admin/orders` - All orders management
- `POST /api/admin/products` - Add new products
- `PUT /api/admin/products/{id}` - Update products
- `GET /api/admin/customers` - Customer management
- `GET /api/admin/revenue` - Revenue reports

### 3. 🚚 Delivery Flow

**Target Users:** Delivery partners and drivers

**Core Features:**
- Delivery partner authentication
- View assigned delivery routes
- Real-time status updates
- Route optimization and navigation
- Delivery history and earnings
- Sequential delivery management
- GPS tracking integration

**Key Endpoints:**
- `GET /api/delivery/routes/today` - Today's delivery routes
- `GET /api/delivery/orders/assigned` - Assigned orders
- `PUT /api/delivery/orders/{id}/status` - Update delivery status
- `GET /api/delivery/history` - Delivery history
- `GET /api/delivery/earnings` - Earnings summary

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'delivery') NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Categories Table
```sql
categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Products Table
```sql
products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Orders Table
```sql
orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20),
    delivery_partner_id INTEGER REFERENCES users(id),
    delivery_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Order Items Table
```sql
order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
)
```

#### Delivery Routes Table
```sql
delivery_routes (
    id SERIAL PRIMARY KEY,
    delivery_partner_id INTEGER REFERENCES users(id),
    route_date DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2),
    estimated_time INTEGER, -- minutes
    status ENUM('pending', 'in_progress', 'completed'),
    created_at TIMESTAMP DEFAULT NOW()
)
```

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Customer Flow Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/products` | Get all products | No |
| GET | `/api/user/products/{id}` | Get product details | No |
| GET | `/api/user/categories` | Get all categories | No |
| POST | `/api/user/orders` | Place new order | Yes |
| GET | `/api/user/orders` | Get user orders | Yes |
| GET | `/api/user/orders/{id}` | Get order details | Yes |
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update user profile | Yes |

### Admin Flow Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard/stats` | Dashboard analytics | Yes (Admin) |
| GET | `/api/admin/orders` | Get all orders | Yes (Admin) |
| PUT | `/api/admin/orders/{id}/status` | Update order status | Yes (Admin) |
| GET | `/api/admin/products` | Get all products | Yes (Admin) |
| POST | `/api/admin/products` | Create new product | Yes (Admin) |
| PUT | `/api/admin/products/{id}` | Update product | Yes (Admin) |
| DELETE | `/api/admin/products/{id}` | Delete product | Yes (Admin) |
| GET | `/api/admin/customers` | Get all customers | Yes (Admin) |
| GET | `/api/admin/revenue` | Revenue analytics | Yes (Admin) |

### Delivery Flow Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/delivery/routes/today` | Get today's routes | Yes (Delivery) |
| GET | `/api/delivery/orders/assigned` | Get assigned orders | Yes (Delivery) |
| PUT | `/api/delivery/orders/{id}/status` | Update delivery status | Yes (Delivery) |
| GET | `/api/delivery/history` | Get delivery history | Yes (Delivery) |
| GET | `/api/delivery/earnings` | Get earnings summary | Yes (Delivery) |

## 🔐 Authentication & Security

### JWT Token System

- **Access Tokens:** Short-lived tokens (30 minutes) for API access
- **Refresh Tokens:** Long-lived tokens (7 days) for token renewal
- **Role-based Access:** Different permissions for customer, admin, delivery roles

### Security Features

- **Password Hashing:** bcrypt with salt rounds
- **CORS Protection:** Configured for frontend domains
- **Input Validation:** Pydantic models for request validation
- **SQL Injection Protection:** SQLAlchemy ORM with parameterized queries
- **Rate Limiting:** Built-in FastAPI rate limiting

### Usage Example

```bash
# Register a new user
curl -X POST "https://fresh-veggies-production.up.railway.app/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "secure_password",
    "name": "John Doe"
  }'

# Login and get token
curl -X POST "https://fresh-veggies-production.up.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "secure_password"
  }'

# Use token for authenticated requests
curl -X GET "https://fresh-veggies-production.up.railway.app/api/user/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment

### Railway.app Deployment

The backend is deployed on Railway.app with the following configuration:

- **Platform:** Railway.app
- **Build:** Docker-based deployment
- **Database:** PostgreSQL (Railway-managed)
- **Environment:** Production
- **Auto-Deploy:** Enabled on `theme` branch

### Environment Variables

```bash
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-for-jwt
FRONTEND_URL=https://your-frontend-domain.com
ENVIRONMENT=production
DEBUG=false
```

### Health Monitoring

- **Health Check Endpoint:** `/health`
- **Uptime Monitoring:** Railway built-in monitoring
- **Logs:** Available in Railway dashboard

## 💻 Development Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip or poetry

### Local Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Fresh-Veggies/fresh-veggies-.git
cd fresh-veggies-/api
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your database credentials
```

4. **Run database migrations:**
```bash
alembic upgrade head
```

5. **Start the development server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. **Access the API:**
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Database Setup

```bash
# Create database
createdb fresh_veggies_dev

# Run migrations
alembic upgrade head

# Seed initial data
python -c "from app.database.seed import seed_database; import asyncio; asyncio.run(seed_database())"
```

## 🧪 Testing

### Test Users (Seeded Data)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | `admin@freshveggies.com` | `admin123` | Full admin access |
| Delivery | `delivery@freshveggies.com` | `delivery123` | Delivery partner |
| Customer | `customer@example.com` | `customer123` | Sample customer |

### Sample Products

The database is seeded with 8 sample products across 4 categories:
- **Vegetables:** Tomatoes, Carrots, Onions, Capsicum
- **Fruits:** Apples, Bananas
- **Leafy Greens:** Spinach
- **Herbs:** Coriander

### Testing Endpoints

```bash
# Get all products
curl https://fresh-veggies-production.up.railway.app/api/user/products

# Login as admin
curl -X POST https://fresh-veggies-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@freshveggies.com", "password": "admin123"}'

# Get admin dashboard (requires admin token)
curl -X GET https://fresh-veggies-production.up.railway.app/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## 🔄 Workflow Integration

### Customer Journey
1. **Registration/Login** → JWT token
2. **Browse Products** → Categories and products
3. **Add to Cart** → Session management
4. **Place Order** → Order creation
5. **Track Delivery** → Real-time updates

### Admin Workflow
1. **Dashboard Overview** → Analytics
2. **Order Management** → Process orders
3. **Product Management** → CRUD operations
4. **Customer Support** → User management

### Delivery Workflow
1. **Route Assignment** → Daily routes
2. **Order Pickup** → Status updates
3. **Navigation** → GPS integration
4. **Delivery Completion** → Final status

## 🚦 Status Codes & Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## 📝 Changelog

### Version 2.0.0 (Current)
- Complete three-flow architecture
- PostgreSQL database integration
- JWT authentication system
- Role-based access control
- Railway.app deployment
- Comprehensive API documentation

### Version 1.0.0
- Basic FastAPI setup
- Simple HTTP server
- Health check endpoint

---

## 📞 Support

For any issues or questions:
- **GitHub Issues:** [Create an issue](https://github.com/Fresh-Veggies/fresh-veggies-/issues)
- **API Documentation:** [Live Docs](https://fresh-veggies-production.up.railway.app/docs)

---

**Built with ❤️ by the Fresh Veggies Team** 