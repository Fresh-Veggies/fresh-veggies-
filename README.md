# FreshVeggies - Bulk Vegetable E-commerce MVP

A modern, responsive e-commerce platform for bulk vegetable supply targeting hostels, PGs, restaurants, and tiffin services. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core E-commerce Functionality
- **Product Catalog**: Browse vegetables with search and category filtering
- **Shopping Cart**: Add, remove, and modify quantities with real-time updates
- **User Authentication**: Email-based login/signup with client-side validation
- **Checkout Process**: Address collection and payment simulation
- **Order Management**: Order history and detailed order tracking
- **User Profile**: Account management with editable profile information

### Technical Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Context API**: Global state management for auth and cart
- **Local Storage**: Persistent cart and user data
- **Form Validation**: Comprehensive client-side validation
- **Loading States**: User-friendly loading indicators and error handling
- **Mock Data**: Complete simulation of backend services

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component with Unsplash
- **Data Persistence**: Local Storage
- **Deployment Ready**: Vercel optimized

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fresh-veggies
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
fresh-veggies/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── account/           # User account management
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   ├── login/             # Authentication
│   │   ├── signup/            # User registration
│   │   ├── orders/            # Order history
│   │   ├── order-success/     # Order confirmation
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── Header.tsx        # Navigation header
│   │   └── ProductCard.tsx   # Product display component
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── CartContext.tsx   # Shopping cart state
│   └── lib/                  # Utilities and data
│       ├── types.ts          # TypeScript interfaces
│       ├── utils.ts          # Helper functions
│       └── mockData.ts       # Mock product data
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

## 🎯 Key Pages & Features

### Homepage (`/`)
- Product catalog with grid layout
- Search functionality (real-time filtering)
- Category-based filtering
- Responsive product cards with images and pricing
- Call-to-action sections for user engagement

### Authentication (`/login`, `/signup`)
- Email and mobile number-based registration
- Form validation with real-time error feedback
- Password strength requirements
- Demo credentials provided for testing

### Shopping Cart (`/cart`)
- Real-time cart updates
- Quantity modification with min/max constraints
- Price calculations with tax breakdown
- Empty state handling
- Responsive layout for mobile and desktop

### Checkout (`/checkout`)
- Multi-step checkout process
- Delivery address collection with validation
- Payment method selection (Cash on Delivery)
- Order summary with itemized pricing
- Order confirmation workflow

### Order Management (`/orders`, `/order-success`)
- Comprehensive order history
- Order status tracking
- Detailed order information
- Reorder functionality
- Order success confirmation with next steps

### User Account (`/account`)
- Profile information management
- Editable user details with validation
- Delivery address display
- Account actions and settings

## 🛠️ Development Features

### State Management
- **AuthContext**: User authentication and profile management
- **CartContext**: Shopping cart operations and persistence
- **Local Storage**: Automatic data persistence across sessions

### Form Validation
- Email format validation
- Mobile number validation (Indian format)
- Password strength requirements
- Pincode validation
- Real-time error feedback

### Responsive Design
- Mobile-first approach
- Adaptive layouts for tablet and desktop
- Touch-friendly interactions
- Optimized for various screen sizes

### Loading & Error States
- Loading spinners for async operations
- Skeleton loading for better UX
- Error handling with user-friendly messages
- Form validation feedback

## 🧪 Demo Credentials

For testing purposes, use these credentials:

```
Email: demo@freshveggies.com
Password: demo123
```

Or create a new account with any valid email format.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔧 Configuration

### Environment Variables
Currently, no environment variables are required for the MVP. All data is mocked and stored locally.

### Image Configuration
External images from Unsplash are configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## 🔮 Future Enhancements

### Backend Integration
- Real API endpoints for products, orders, and user management
- Database integration (MongoDB, PostgreSQL)
- Authentication with JWT or OAuth
- Payment gateway integration (Razorpay, Stripe)

### Advanced Features
- Real-time inventory management
- Order tracking with delivery updates
- Push notifications
- Admin dashboard
- Analytics and reporting
- Multi-vendor support
- Bulk pricing tiers

### Technical Improvements
- Server-side rendering for SEO
- Performance optimization
- Image optimization and CDN
- Caching strategies
- Error monitoring
- Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, contact:
- Email: support@freshveggies.com
- Phone: +91 98765 43210

---

Built with ❤️ for the fresh produce industry
