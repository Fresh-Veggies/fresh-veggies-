'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Order } from '@/lib/types';
import { getOrders, formatPrice, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const orders = getOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link href="/">
            <Button>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order. We&apos;ll start preparing your vegetables right away.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{order.status}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
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
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(order.taxes)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{order.deliveryAddress.fullName}</p>
                  <p className="text-gray-700">{order.deliveryAddress.street}</p>
                  <p className="text-gray-700">
                    {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
                  </p>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{order.deliveryAddress.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{order.deliveryAddress.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-blue-900">Cash on Delivery</p>
                  <p className="text-sm text-blue-700">Pay {formatPrice(order.totalAmount)} when your order is delivered</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-600">We&apos;ve received your order and will start preparing it immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium text-gray-900">Preparation</p>
                  <p className="text-sm text-gray-600">Fresh vegetables will be handpicked and packed for delivery.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-sm text-gray-600">Your order will be delivered to your address within 24 hours.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Orders
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-2">
            Questions about your order? Contact us at:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="flex items-center justify-center gap-1">
              <Phone className="h-4 w-4 text-green-600" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Mail className="h-4 w-4 text-green-600" />
              <span>support@freshveggies.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}