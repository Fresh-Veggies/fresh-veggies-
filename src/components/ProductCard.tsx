'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getCartItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(product.minOrder);
  const [isLoading, setIsLoading] = useState(false);

  const cartItem = getCartItem(product.id);
  const isInCart = !!cartItem;

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.min(Math.max(newQuantity, product.minOrder), product.maxOrder);
    setQuantity(validQuantity);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      addToCart(product, quantity);
      setQuantity(product.minOrder);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.pricePerKg)}/kg
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Min order: {product.minOrder}kg • Max order: {product.maxOrder}kg
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isInCart ? (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-medium">In Cart: {cartItem.quantity}kg</span>
              <span className="text-sm font-semibold text-green-600">
                {formatPrice(cartItem.product.pricePerKg * cartItem.quantity)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateCartQuantity(cartItem.quantity - 1)}
                disabled={cartItem.quantity <= product.minOrder}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {cartItem.quantity}kg
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateCartQuantity(cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.maxOrder}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {product.inStock && (
              <>
                {/* Quantity Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= product.minOrder}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[3rem] text-center">
                        {quantity}kg
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.maxOrder}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.pricePerKg * quantity)}
                    </span>
                  </div>

                  {/* Bulk Increment Buttons */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 text-center">Quick add:</div>
                    <div className="flex gap-1 justify-center">
                      {[5, 10, 25, 50].map((bulkAmount) => {
                        const newQuantity = quantity + bulkAmount;
                        const isDisabled = newQuantity > product.maxOrder;
                        
                        return (
                          <Button
                            key={bulkAmount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(newQuantity)}
                            disabled={isDisabled}
                            className="h-7 px-2 text-xs"
                          >
                            +{bulkAmount}kg
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Set Amounts */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 text-center">Set to:</div>
                    <div className="flex gap-1 justify-center">
                      {[10, 25, 50, 100].filter(setAmount => setAmount >= product.minOrder && setAmount <= product.maxOrder).map((setAmount) => {
                        return (
                          <Button
                            key={setAmount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(setAmount)}
                            className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                          >
                            {setAmount}kg
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bulk Order Benefits */}
                  {quantity >= 25 && (
                    <div className="text-xs text-center p-2 bg-green-50 text-green-700 rounded-md">
                      🎉 Great choice! Bulk orders help reduce packaging waste and delivery costs.
                    </div>
                  )}
                </div>
              </>
            )}
            
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              loading={isLoading}
              className="w-full"
              size="sm"
            >
              {!product.inStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard; 