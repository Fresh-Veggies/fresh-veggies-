#!/usr/bin/env python3
"""
Fresh Veggies Production Secrets Generator
Generates secure environment variables for production deployment
"""

import secrets
import string
import sys

def generate_secret_key(length=32):
    """Generate a secure secret key for JWT"""
    return secrets.token_urlsafe(length)

def generate_password(length=16):
    """Generate a secure password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def main():
    print("🔐 Fresh Veggies Production Secrets Generator")
    print("=" * 50)
    
    # Generate secrets
    jwt_secret = generate_secret_key(32)
    db_password = generate_password(16)
    
    print("\n📋 Copy these to your deployment platform:")
    print("-" * 50)
    
    # Essential variables
    print(f"SECRET_KEY={jwt_secret}")
    print(f"DATABASE_PASSWORD={db_password}")
    print("ENVIRONMENT=production")
    print("DEBUG=false")
    
    # Placeholders for user to fill
    print("\n🔧 Fill these with your actual values:")
    print("-" * 50)
    print("DATABASE_URL=postgresql://username:PASSWORD@host:5432/fresh_veggies")
    print("GOOGLE_MAPS_API_KEY=your-google-maps-api-key")
    print("FRONTEND_URL=https://your-frontend-domain.com")
    print("SMS_PROVIDER=free_sms")
    
    # Platform-specific instructions
    print("\n🚀 Platform Setup Commands:")
    print("-" * 50)
    
    print("\n💎 Railway:")
    print(f"railway variables set SECRET_KEY={jwt_secret}")
    print("railway variables set DATABASE_URL=postgresql://...")
    print("railway variables set GOOGLE_MAPS_API_KEY=your-key")
    print("railway variables set FRONTEND_URL=https://your-app.vercel.app")
    print("railway variables set SMS_PROVIDER=free_sms")
    print("railway variables set ENVIRONMENT=production")
    print("railway variables set DEBUG=false")
    
    print("\n🟣 Heroku:")
    print(f"heroku config:set SECRET_KEY={jwt_secret}")
    print("heroku config:set DATABASE_URL=postgresql://...")
    print("heroku config:set GOOGLE_MAPS_API_KEY=your-key")
    print("heroku config:set FRONTEND_URL=https://your-app.vercel.app")
    print("heroku config:set SMS_PROVIDER=free_sms")
    
    print("\n📝 Vercel (Frontend):")
    print("NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app")
    print("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key")
    
    print("\n⚠️  Security Notes:")
    print("-" * 50)
    print("• Never commit these secrets to version control")
    print("• Use different secrets for development/staging/production")
    print("• Rotate secrets regularly (every 3-6 months)")
    print("• Store secrets securely in your deployment platform")
    print("• Enable 2FA on all service accounts")
    
    print("\n✅ Next Steps:")
    print("-" * 50)
    print("1. Set up your database (PostgreSQL recommended)")
    print("2. Get Google Maps API key from Google Cloud Console")
    print("3. Configure your deployment platform variables")
    print("4. Deploy and test the application")
    print("5. Run database migrations if needed")
    
    print(f"\n🔑 Save this SECRET_KEY safely: {jwt_secret}")

if __name__ == "__main__":
    main() 