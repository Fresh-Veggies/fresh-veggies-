# Fresh Veggies - Project Brief

## Project Overview
Fresh Veggies is a full-stack vegetable delivery platform that connects customers with fresh produce through an efficient delivery system.

## Core Requirements
- **Customer App**: Browse vegetables, place orders with GPS location
- **Admin Panel**: Manage products, orders, delivery partners, analytics
- **Delivery System**: Route optimization, real-time tracking, location-based assignment
- **Authentication**: Role-based access (customer, admin, delivery partner)
- **Location Features**: GPS coordinates, route optimization, nearby order discovery

## Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, SQLAlchemy, SQLite/PostgreSQL
- **APIs**: Google Maps (location), SMS services (notifications)
- **Deployment**: Railway (backend), Vercel (frontend)

## Key Features Implemented
1. **Location-Based Orders**: GPS coordinate capture and storage
2. **Route Optimization**: Haversine distance calculation, nearest neighbor algorithm
3. **Real-time Tracking**: Delivery partner location updates
4. **Admin Management**: Complete order and user management
5. **Security**: Environment-based secrets, JWT authentication

## Current Status
- ✅ Core backend and frontend implemented
- ✅ Location-based delivery system operational
- ✅ Security vulnerabilities resolved
- ✅ Deployment configuration ready
- ✅ Testing infrastructure in place

## Project Goals
Create a production-ready vegetable delivery platform with smart routing and real-time tracking capabilities for efficient last-mile delivery in India. 