# Technical Context

## Technology Stack

### Backend Technologies
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11+
- **Database ORM**: SQLAlchemy 2.0
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: PyJWT for JWT tokens
- **Password Hashing**: Passlib with bcrypt
- **Validation**: Pydantic v2
- **CORS**: FastAPI CORS middleware
- **Environment**: Pydantic Settings

### Frontend Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Tailwind
- **State Management**: React Context API
- **HTTP Client**: Native fetch API
- **Maps Integration**: Google Maps JavaScript API
- **Build Tool**: Turbopack (Next.js default)

### External APIs & Services
- **Google Maps**: Places API, Geocoding API, JavaScript API
- **SMS Services**: 
  - Twilio (paid option)
  - TextBee (free Android gateway)
  - Free SMS service (development)
- **Email**: SMTP with Gmail (optional)

### Development Tools
- **Package Manager**: npm/yarn (frontend), pip (backend)
- **Code Quality**: ESLint, TypeScript compiler
- **Version Control**: Git with GitHub
- **Environment Management**: .env files
- **Testing**: Basic pytest setup (backend)

## Development Setup

### Backend Setup
```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Environment Variables Required

#### Backend (.env)
```
DATABASE_URL=sqlite:///./fresh_veggies.db
SECRET_KEY=your-secret-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SMS_PROVIDER=free_sms
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Database Schema

### Core Tables
1. **users**: Authentication and user profiles
2. **products**: Vegetable catalog
3. **orders**: Customer orders with GPS coordinates
4. **order_items**: Order line items
5. **delivery_routes**: Delivery planning and optimization

### Key Fields Added
- `orders.delivery_latitude` (Float)
- `orders.delivery_longitude` (Float)
- Location-based indexing for query optimization

## API Structure

### Authentication Routes (`/api/auth`)
- POST `/login` - User authentication
- POST `/signup` - User registration
- GET `/me` - Current user profile

### User Routes (`/api/user`)
- GET `/products` - Product catalog
- POST `/orders` - Create order with location
- GET `/orders` - User order history

### Admin Routes (`/api/admin`)
- GET `/users` - User management
- POST `/products` - Product management
- GET `/orders` - All orders overview
- PUT `/orders/{id}/assign` - Assign delivery partner

### Delivery Routes (`/api/delivery`)
- GET `/orders/nearby` - Find nearby orders
- POST `/routes/optimize` - Route optimization
- POST `/update-location` - Partner location update
- GET `/orders/with-locations` - Orders with GPS data

## Security Implementation

### Authentication Flow
1. User login with email/password
2. JWT token generation with role information
3. Token validation on protected routes
4. Role-based access control (admin, customer, delivery)

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- Environment-based secrets
- CORS configuration
- Input validation with Pydantic

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Lazy loading for relationships
- Connection pooling for production

### Location Processing
- Haversine distance calculation for accuracy
- Spatial indexing considerations for scale
- Caching of frequently accessed location data

### Frontend Optimization
- Next.js automatic code splitting
- Component lazy loading
- Image optimization
- Static generation where possible

## Production Deployment

### Recommended Infrastructure
- **Backend**: Railway.app with PostgreSQL
- **Frontend**: Vercel with automatic deployment
- **Database**: Railway PostgreSQL or managed PostgreSQL
- **CDN**: Vercel edge network
- **Monitoring**: Built-in platform monitoring

### Scalability Considerations
- Horizontal scaling with load balancers
- Database read replicas for high traffic
- CDN for static assets
- Caching layer (Redis) for session management

## Dependencies

### Backend Key Dependencies
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-jose[cryptography]
passlib[bcrypt]
python-multipart
```

### Frontend Key Dependencies
```
next@14.0.0
react@18.2.0
typescript@5.0.0
tailwindcss@3.4.0
@types/google.maps
```

## Development Constraints

### Technical Limitations
- SQLite for development (single connection)
- Google Maps API quotas and billing
- SMS service rate limits
- Browser geolocation permissions

### Known Issues
- Private function testing needs proper import patterns
- Frontend-backend integration partially complete
- Real-time features need WebSocket implementation
- File upload functionality not yet implemented

## Future Technical Improvements

### Short Term
1. Implement proper testing patterns for private functions
2. Add comprehensive error handling
3. Implement caching layer
4. Add request rate limiting

### Long Term
1. Microservices architecture consideration
2. Real-time WebSocket connections
3. Advanced analytics and reporting
4. Mobile app development (React Native)
5. Progressive Web App (PWA) features 