# 🚀 Fresh Veggies Backend Architecture

## 📋 Overview
Backend system for bulk vegetable e-commerce with three main flows:
1. **User Flow** - Customer ordering system
2. **Admin Flow** - Analytics and order management 
3. **Delivery Personnel Flow** - Route optimization and delivery management

---

## 🗄️ Database Entities & Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Addresses Table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  street TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  price_per_kg DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  min_order_kg INTEGER NOT NULL,
  max_order_kg INTEGER NOT NULL,
  step_kg INTEGER NOT NULL,
  seasonal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  delivery_address_id UUID REFERENCES addresses(id),
  status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cod', 'online', 'wallet') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  delivery_personnel_id UUID REFERENCES users(id),
  expected_delivery_date DATE,
  actual_delivery_date TIMESTAMP,
  order_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6. Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity_kg INTEGER NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Delivery Routes Table
```sql
CREATE TABLE delivery_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_personnel_id UUID REFERENCES users(id),
  route_date DATE NOT NULL,
  warehouse_location POINT NOT NULL, -- PostGIS point type for coordinates
  total_distance_km DECIMAL(8, 2),
  estimated_time_hours DECIMAL(4, 2),
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8. Route Orders Table (Junction Table)
```sql
CREATE TABLE route_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES delivery_routes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  sequence_number INTEGER NOT NULL,
  estimated_arrival_time TIMESTAMP,
  actual_arrival_time TIMESTAMP,
  delivery_status ENUM('pending', 'arrived', 'delivered', 'failed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Inventory Logs Table
```sql
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  change_type ENUM('stock_in', 'stock_out', 'order_placed', 'order_cancelled', 'adjustment') NOT NULL,
  quantity_change INTEGER NOT NULL, -- positive for in, negative for out
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reference_id UUID, -- order_id or other reference
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Order Status History Table
```sql
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 API Endpoints

## 🔐 Authentication APIs

### POST /api/auth/register
```json
{
  "name": "string",
  "email": "string",
  "mobile": "string",
  "password": "string",
  "role": "customer" // default
}
```

### POST /api/auth/login
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /api/auth/logout
```json
{
  "refresh_token": "string"
}
```

### POST /api/auth/refresh
```json
{
  "refresh_token": "string"
}
```

---

## 👤 USER FLOW APIs

### Products APIs

#### GET /api/products
```
Query Parameters:
- category_id?: string
- search?: string
- in_stock?: boolean
- page?: number (default: 1)
- limit?: number (default: 20)
- sort_by?: 'name' | 'price' | 'created_at'
- sort_order?: 'asc' | 'desc'
```

#### GET /api/products/:id
Returns single product details with availability

#### GET /api/categories
Returns all active categories

### Cart APIs (In-Memory/Session based)

#### POST /api/cart/add
```json
{
  "product_id": "string",
  "quantity_kg": "number"
}
```

#### PUT /api/cart/update
```json
{
  "product_id": "string",
  "quantity_kg": "number"
}
```

#### DELETE /api/cart/remove/:product_id

#### GET /api/cart
Returns current cart with calculated totals

### Order APIs

#### POST /api/orders
```json
{
  "delivery_address_id": "string",
  "items": [
    {
      "product_id": "string",
      "quantity_kg": "number"
    }
  ],
  "payment_method": "cod",
  "order_notes": "string"
}
```

#### GET /api/orders
```
Query Parameters:
- status?: string
- page?: number
- limit?: number
```

#### GET /api/orders/:id
Returns detailed order information

#### PUT /api/orders/:id/cancel
Cancels an order if status allows

### Address APIs

#### POST /api/addresses
```json
{
  "full_name": "string",
  "mobile": "string",
  "email": "string",
  "street": "string",
  "city": "string",
  "pincode": "string",
  "is_default": "boolean"
}
```

#### GET /api/addresses
Returns user's addresses

#### PUT /api/addresses/:id
Updates address

#### DELETE /api/addresses/:id

---

## 👨‍💼 ADMIN FLOW APIs

### Dashboard Analytics

#### GET /api/admin/dashboard/stats
```json
{
  "today_orders": "number",
  "today_revenue": "number",
  "pending_orders": "number",
  "total_customers": "number",
  "inventory_alerts": "number",
  "delivery_in_progress": "number"
}
```

#### GET /api/admin/dashboard/revenue
```
Query Parameters:
- period: 'daily' | 'weekly' | 'monthly'
- start_date?: string
- end_date?: string
```

#### GET /api/admin/dashboard/top-products
```
Query Parameters:
- period?: 'week' | 'month' | 'year'
- limit?: number (default: 10)
```

### Order Management

#### GET /api/admin/orders
```
Query Parameters:
- status?: string
- date_from?: string
- date_to?: string
- customer_id?: string
- page?: number
- limit?: number
```

#### PUT /api/admin/orders/:id/status
```json
{
  "status": "confirmed",
  "notes": "string",
  "delivery_personnel_id": "string" // for out_for_delivery
}
```

#### GET /api/admin/orders/export
```
Query Parameters:
- format: 'csv' | 'excel'
- date_from?: string
- date_to?: string
```

### Product Management

#### POST /api/admin/products
```json
{
  "name": "string",
  "price_per_kg": "number",
  "category_id": "string",
  "description": "string",
  "min_order_kg": "number",
  "max_order_kg": "number",
  "step_kg": "number",
  "stock_quantity": "number"
}
```

#### PUT /api/admin/products/:id

#### DELETE /api/admin/products/:id

#### POST /api/admin/products/:id/stock
```json
{
  "quantity_change": "number", // positive for add, negative for reduce
  "notes": "string"
}
```

### Customer Management

#### GET /api/admin/customers
```
Query Parameters:
- search?: string
- page?: number
- limit?: number
```

#### GET /api/admin/customers/:id/orders
Customer order history

---

## 🚚 DELIVERY PERSONNEL FLOW APIs

### Route Management

#### GET /api/delivery/routes/today
Returns today's assigned delivery route with optimized sequence

#### GET /api/delivery/routes/:route_id
Detailed route information with all orders

#### PUT /api/delivery/routes/:route_id/start
Marks route as started

#### PUT /api/delivery/routes/:route_id/complete
Marks entire route as completed

### Order Delivery

#### GET /api/delivery/orders/assigned
Returns orders assigned to delivery personnel

#### PUT /api/delivery/orders/:order_id/arrive
```json
{
  "arrival_time": "timestamp",
  "notes": "string"
}
```

#### PUT /api/delivery/orders/:order_id/deliver
```json
{
  "delivery_time": "timestamp",
  "delivery_status": "delivered" | "failed",
  "notes": "string",
  "customer_feedback": "string"
}
```

#### GET /api/delivery/orders/:order_id/customer-info
Returns customer contact and delivery address

### Route Optimization

#### POST /api/delivery/routes/optimize
```json
{
  "delivery_personnel_id": "string",
  "date": "string",
  "warehouse_location": {
    "latitude": "number",
    "longitude": "number"
  },
  "order_ids": ["string"]
}
```
Returns optimized delivery sequence using routing algorithms

---

## 🛠️ Technical Implementation Stack

### Backend Framework
- **Node.js + Express.js** or **Node.js + Fastify**
- **TypeScript** for type safety
- **JWT** for authentication
- **bcrypt** for password hashing

### Database
- **PostgreSQL** with **PostGIS** extension for location data
- **Redis** for session management and caching
- **Prisma** or **TypeORM** for database ORM

### Key Features
- **Route Optimization**: Using Google Maps API or Mapbox for distance calculation
- **Real-time Updates**: WebSocket for order status updates
- **Background Jobs**: Bull Queue for email notifications, inventory updates
- **File Upload**: Multer + AWS S3 for product images
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: Express-rate-limit
- **Validation**: Joi or Zod for request validation

### Deployment
- **Docker** containerization
- **AWS/GCP** cloud deployment
- **GitHub Actions** for CI/CD
- **Monitoring**: Prometheus + Grafana

---

## 🔄 Business Logic

### Order Processing Flow
1. User places order → Inventory check → Order created (pending)
2. Admin confirms order → Inventory reserved → Order confirmed
3. Order assigned to delivery route → Status: preparing
4. Delivery personnel picks up → Status: out_for_delivery
5. Order delivered → Status: delivered → Inventory updated

### Route Optimization Algorithm
1. Collect all orders for a delivery date
2. Group by delivery area/pincode
3. Use TSP (Traveling Salesman Problem) algorithm for optimal route
4. Consider traffic patterns and delivery time windows
5. Generate sequential delivery order (10-20 stops max)

### Inventory Management
1. Real-time stock tracking
2. Automatic low-stock alerts
3. Order-based inventory reservation
4. Batch inventory updates with audit logs

This architecture provides a solid foundation for all three user flows while being scalable and maintainable! 