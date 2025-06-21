'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, calculateTax, generateOrderId, saveOrder, validateEmail, validateMobile, validatePincode } from '@/lib/utils';
import { Address, Order } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface FormErrors {
  fullName?: string;
  mobile?: string;
  email?: string;
  street?: string;
  city?: string;
  pincode?: string;
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    street: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Load saved address from user data if available
    if (user?.address) {
      setAddress(user.address);
    }
  }, [isAuthenticated, cart.length, router, user]);

  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!address.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(address.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!address.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(address.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(address.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const order: Order = {
        id: generateOrderId(),
        userId: user!.id,
        items: [...cart],
        subtotal,
        taxes: tax,
        totalAmount: total,
        deliveryAddress: address,
        status: 'In Progress',
        orderDate: new Date().toISOString(),
      };

      // Save order
      saveOrder(order);

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-success?orderId=${order.id}`);
    } catch {
      alert('Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart" className="text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Address Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    name="mobile"
                    value={address.mobile}
                    onChange={handleInputChange}
                    error={errors.mobile}
                    required
                    maxLength={10}
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={address.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />

                <Input
                  label="Street Address"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  error={errors.street}
                  required
                  placeholder="Building, street, area"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    error={errors.pincode}
                    required
                    maxLength={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Cash on Delivery</p>
                    <p className="text-sm text-blue-700">Pay when your order is delivered</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Online payment methods will be available in the full version
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity}kg × {formatPrice(item.product.pricePerKg)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">
                          {formatPrice(item.product.pricePerKg * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  loading={isProcessing}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing Order...' : `Place Order - ${formatPrice(total)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 