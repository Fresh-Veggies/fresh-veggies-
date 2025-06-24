# 🥬 Fresh Veggies API

Modern FastAPI backend for bulk vegetable e-commerce platform with three main flows:
- **User Flow**: Customer ordering system
- **Admin Flow**: Analytics and order management
- **Delivery Flow**: Route optimization and delivery management

## 🚀 Quick Deploy to Railway (FREE)

1. **Fork this repository**

2. **Deploy to Railway** (1-Click):
   ```bash
   https://railway.app/new/template/FastAPI
   ```
   Or manually:
   - Connect your GitHub repo to Railway
   - Railway will auto-detect Python and use Dockerfile

3. **Add Environment Variables** in Railway dashboard:
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/db
   SECRET_KEY=your-super-secret-key-here
   FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Database Setup**:
   - Railway automatically provisions PostgreSQL
   - Copy the DATABASE_URL from Railway dashboard
   - Tables are created automatically on first run

## 🏃‍♂️ Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL

### Setup
```bash
# Clone repository
git clone <repo-url>
cd api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp env.example .env
# Edit .env with your database credentials

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 📊 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user info

### 👤 User Flow (`/api/user`) 
- `GET /products` - Get all products
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `POST /addresses` - Add delivery address

### 👨‍💼 Admin Flow (`/api/admin`)
- `GET /dashboard/stats` - Dashboard analytics
- `GET /orders` - All orders management
- `POST /products` - Add new products
- `GET /customers` - Customer management

### 🚚 Delivery Flow (`/api/delivery`)
- `GET /routes/today` - Today's delivery routes
- `GET /orders/assigned` - Assigned orders
- `PUT /orders/{id}/deliver` - Mark order delivered
- `POST /routes/optimize` - Optimize delivery routes

## 🗄️ Database Schema

The API uses PostgreSQL with the following main entities:
- **Users** (customers, admins, delivery personnel)
- **Products** & **Categories**
- **Orders** & **Order Items**
- **Delivery Routes** & **Route Orders**
- **Addresses**

Tables are automatically created when the app starts.

## 🔧 Key Features

- **JWT Authentication** with role-based access
- **Automatic API Documentation** (Swagger/OpenAPI)
- **Database Migrations** with SQLAlchemy
- **Input Validation** with Pydantic
- **CORS Support** for frontend integration
- **Production Ready** with proper error handling
- **Optimized for Deployment** (Docker, Railway, Render)

## 📦 Deployment Options

### Railway (Recommended - FREE)
- $5 monthly credit (enough for small apps)
- PostgreSQL included
- Auto-deploys from GitHub
- Custom domains

### Render (Alternative)
- Free tier available
- PostgreSQL free for 90 days
- Easy deployment

### Local PostgreSQL
For local development:
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb fresh_veggies

# Update .env with local database URL
DATABASE_URL=postgresql://username:password@localhost:5432/fresh_veggies
```

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Test specific endpoint
curl http://localhost:8000/health
```

## 🔄 Frontend Integration

Update your Next.js frontend to use the new API:
```typescript
// In your frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Authentication
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

## 🚀 What's Next?

1. **Deploy to Railway** (5 minutes)
2. **Update frontend** to use new API endpoints
3. **Add more features**:
   - Email notifications
   - Payment integration
   - Advanced analytics
   - Route optimization algorithms

## 📞 Support

The API is designed to be:
- ✅ **Easy to deploy** (1-click Railway deployment)
- ✅ **Free to run** (Railway free tier)
- ✅ **Scalable** (FastAPI + PostgreSQL)
- ✅ **Well documented** (Auto-generated docs)

Happy coding! 🎉 