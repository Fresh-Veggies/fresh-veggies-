'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, calculateTax } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any vegetables to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Link href="/">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-24 relative overflow-hidden rounded-lg">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 96px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatPrice(item.product.pricePerKg)}/kg</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.product.category}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600 mb-2">
                          {formatPrice(item.product.pricePerKg * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.quantity}kg × {formatPrice(item.product.pricePerKg)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= item.product.minOrder}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium min-w-[3rem] text-center">
                              {item.quantity}kg
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.maxOrder}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>

                      {/* Bulk Increment Controls */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">Quick add:</div>
                            <div className="flex gap-1">  
                              {[5, 10, 25].map((bulkAmount) => {
                                const newQuantity = item.quantity + bulkAmount;
                                const isDisabled = newQuantity > item.product.maxOrder;
                                
                                return (
                                  <Button
                                    key={bulkAmount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.product.id, newQuantity)}
                                    disabled={isDisabled}
                                    className="h-7 px-2 text-xs"
                                  >
                                    +{bulkAmount}kg
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            Min: {item.product.minOrder}kg<br />
                            Max: {item.product.maxOrder}kg
                          </div>
                        </div>

                        {/* Quick Set Amounts */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">Set to:</div>
                            <div className="flex gap-1">
                              {[10, 25, 50, 100].filter(setAmount => setAmount >= item.product.minOrder && setAmount <= item.product.maxOrder).map((setAmount) => {
                                return (
                                  <Button
                                    key={setAmount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.product.id, setAmount)}
                                    className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                  >
                                    {setAmount}kg
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {/* Order Details */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} ({item.quantity}kg)
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.pricePerKg * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                </div>

                <hr />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 text-center">
                    You need to login to place an order
                  </p>
                )}

                {/* Continue Shopping */}
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 