# System Patterns & Architecture

## Backend Architecture
- **Framework**: FastAPI with async/await patterns
- **Database**: SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT tokens with role-based access control
- **API Structure**: Modular routes (auth, user, admin, delivery)

## Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **State Management**: React Context (Auth, Cart, Theme)
- **Styling**: Tailwind CSS with custom components
- **API Integration**: Fetch-based API client with error handling

## Key Design Patterns

### 1. Role-Based Access Control
```python
# auth.py patterns
def require_admin(current_user: User = Depends(get_current_active_user))
def require_customer(current_user: User = Depends(get_current_active_user))
```

### 2. Location-Based Operations
```python
# delivery.py patterns
def haversine_distance(lat1, lon1, lat2, lon2) -> float
# Route optimization using nearest neighbor algorithm
# GPS coordinate storage in Order model
```

### 3. Environment Configuration
```python
# config.py pattern
class Settings(BaseSettings):
    # All secrets from environment variables
    # No hardcoded credentials
```

### 4. Database Patterns
- **Models**: User, Order, Product, DeliveryRoute with relationships
- **Migration**: ALTER TABLE commands for schema updates
- **Connection**: Session dependency injection

### 5. Component Patterns
- **UI Components**: Reusable Button, Input, Card components
- **Location Components**: Google Maps integration with autocomplete
- **Context Providers**: Auth, Cart, Theme state management

## Security Patterns
- Environment-based secrets
- JWT token validation
- Input sanitization
- CORS configuration
- Password hashing

## Testing Patterns
- **Unit Tests**: Private function testing via imports
- **Integration Tests**: Full API endpoint testing
- **Mocking**: Database and external service mocking

## Deployment Patterns
- **Railway**: Backend with environment variables
- **Vercel**: Frontend with build optimization
- **Database**: PostgreSQL with automatic migrations
- **Secrets**: Platform-specific environment variable management 