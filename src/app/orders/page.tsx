'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Clock, MapPin, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/lib/types';
import { getOrders, formatPrice, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      const userOrders = getOrders();
      // Sort orders by date (newest first)
      setOrders(userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">
            {orders.length > 0 
              ? `You have ${orders.length} order${orders.length !== 1 ? 's' : ''}`
              : 'Your order history will appear here'
            }
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link href="/">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Ordered on {formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 mb-1">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Amount
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items Ordered</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items.map((item, index) => (
                        <div key={`${order.id}-${item.product.id}-${index}`} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-gray-500">({item.quantity}kg)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{order.deliveryAddress.fullName}</p>
                      <p>{order.deliveryAddress.street}</p>
                      <p>{order.deliveryAddress.city}, {order.deliveryAddress.pincode}</p>
                      <p className="mt-1">
                        📱 {order.deliveryAddress.mobile} • 📧 {order.deliveryAddress.email}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">{formatPrice(order.subtotal)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tax</p>
                        <p className="font-medium">{formatPrice(order.taxes)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery</p>
                        <p className="font-medium text-green-600">Free</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold text-green-600">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                    <Link href={`/order-success?orderId=${order.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                    {order.status === 'Delivered' && (
                      <Button size="sm" className="w-full sm:w-auto">
                        Reorder Items
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continue Shopping CTA */}
          <div className="text-center py-8">
            <Link href="/">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 