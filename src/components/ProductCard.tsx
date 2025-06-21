'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getCartItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(product.minOrder);

  const cartItem = getCartItem(product.id);
  const isInCart = !!cartItem;

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.min(Math.max(newQuantity, product.minOrder), product.maxOrder);
    setQuantity(validQuantity);
  };

  const handleStepDecrease = (currentQty: number) => {
    const newQty = currentQty - product.step;
    return Math.max(newQty, product.minOrder);
  };

  const handleStepIncrease = (currentQty: number) => {
    const newQty = currentQty + product.step;
    return Math.min(newQty, product.maxOrder);
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

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      addToCart(product, quantity);
      setQuantity(product.minOrder);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  // Generate smart quick-add buttons based on product step
  const getQuickAddButtons = () => {
    const buttons = [];
    const baseStep = product.step;
    
    // Generate 3-4 quick add options based on step size
    if (baseStep === 1) {
      buttons.push(2, 5, 10);
    } else if (baseStep === 2) {
      buttons.push(4, 8, 16);
    } else if (baseStep === 3) {
      buttons.push(6, 12, 24);
    } else if (baseStep === 5) {
      buttons.push(10, 25, 50);
    } else {
      buttons.push(baseStep * 2, baseStep * 5, baseStep * 10);
    }
    
    return buttons.filter(btn => btn <= product.maxOrder);
  };

  // Get category-specific colors with better contrast for light mode
  const getCategoryColors = () => {
    switch (product.category) {
      case 'Root Vegetables':
        return {
          light: 'from-orange-100 to-amber-200',
          dark: 'dark:from-orange-900/20 dark:to-amber-900/20',
          border: 'border-orange-500 dark:border-orange-600/30',
          text: 'text-white dark:text-orange-300',
          textOnBg: 'text-orange-900 dark:text-orange-300',
          bg: 'bg-orange-500 dark:bg-orange-900/20',
          hover: 'hover:border-orange-600 dark:hover:border-orange-500'
        };
      case 'Leafy Vegetables':
        return {
          light: 'from-green-100 to-emerald-200',
          dark: 'dark:from-green-900/20 dark:to-emerald-900/20',
          border: 'border-green-500 dark:border-green-600/30',
          text: 'text-white dark:text-green-300',
          textOnBg: 'text-green-900 dark:text-green-300',
          bg: 'bg-green-500 dark:bg-green-900/20',
          hover: 'hover:border-green-600 dark:hover:border-green-500'
        };
      case 'Fruits':
        return {
          light: 'from-red-100 to-pink-200',
          dark: 'dark:from-red-900/20 dark:to-pink-900/20',
          border: 'border-red-500 dark:border-red-600/30',
          text: 'text-white dark:text-red-300',
          textOnBg: 'text-red-900 dark:text-red-300',
          bg: 'bg-red-500 dark:bg-red-900/20',
          hover: 'hover:border-red-600 dark:hover:border-red-500'
        };
      case 'Legumes':
        return {
          light: 'from-purple-100 to-violet-200',
          dark: 'dark:from-purple-900/20 dark:to-violet-900/20',
          border: 'border-purple-500 dark:border-purple-600/30',
          text: 'text-white dark:text-purple-300',
          textOnBg: 'text-purple-900 dark:text-purple-300',
          bg: 'bg-purple-500 dark:bg-purple-900/20',
          hover: 'hover:border-purple-600 dark:hover:border-purple-500'
        };
      default:
        return {
          light: 'from-blue-100 to-indigo-200',
          dark: 'dark:from-blue-900/20 dark:to-indigo-900/20',
          border: 'border-blue-500 dark:border-blue-600/30',
          text: 'text-white dark:text-blue-300',
          textOnBg: 'text-blue-900 dark:text-blue-300',
          bg: 'bg-blue-500 dark:bg-blue-900/20',
          hover: 'hover:border-blue-600 dark:hover:border-blue-500'
        };
    }
  };

  const quickAddButtons = getQuickAddButtons();
  const categoryColors = getCategoryColors();

  return (
    <Card className="group h-full flex flex-col transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]
                     bg-white dark:bg-card 
                     border-2 border-gray-200 dark:border-border
                     shadow-lg hover:shadow-2xl
                     hover:border-green-400 dark:hover:border-primary
                     hover:shadow-green-200/30 dark:hover:shadow-primary/10
                     rounded-2xl overflow-hidden">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden
                      bg-gradient-to-br from-gray-100 to-gray-200 
                      dark:bg-gradient-to-br dark:from-muted dark:to-muted/80">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Stock Badge */}
        {product.inStock && (
          <div className={`absolute top-4 right-4 
                          bg-gradient-to-r ${categoryColors.light} ${categoryColors.dark}
                          ${categoryColors.text}
                          px-4 py-2 rounded-full text-sm font-bold 
                          shadow-xl border-2 ${categoryColors.border}
                          transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
            ✓ Fresh
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/20 
                        transition-all duration-500"></div>
      </div>

      <CardContent className="flex-1 flex flex-col p-8">
        {/* Product Info */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-card-foreground mb-4 
                         group-hover:text-green-700 dark:group-hover:text-primary 
                         transition-colors duration-300 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-gray-700 dark:text-muted-foreground mb-6 leading-relaxed line-clamp-3 text-base">
            {product.description}
          </p>
          
          {/* Price and Category Row */}
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col">
              <div className="text-4xl font-black text-green-700 dark:text-primary leading-none mb-1">
                {formatPrice(product.pricePerKg)}
              </div>
              <div className="text-sm text-gray-600 dark:text-muted-foreground font-medium">per kg</div>
            </div>
            
            <div className={`text-sm font-bold 
                           ${categoryColors.text}
                           ${categoryColors.bg}
                           px-4 py-2 rounded-full border-2 
                           ${categoryColors.border}
                           transform hover:scale-105 transition-transform duration-200`}>
              {product.category}
            </div>
          </div>
        </div>

        {/* Order Range Info */}
        <div className={`text-sm text-gray-800 dark:text-muted-foreground mb-8 
                        p-5 bg-gradient-to-r ${categoryColors.light} ${categoryColors.dark} rounded-2xl 
                        border-2 ${categoryColors.border}`}>
          <div className="font-bold text-gray-900 dark:text-card-foreground mb-1">Order Range:</div>
          <div className={`text-lg font-semibold ${categoryColors.textOnBg} mb-2`}>
            {product.minOrder}kg - {product.maxOrder}kg
          </div>
          <div className="text-xs text-gray-700 dark:text-muted-foreground">
            Increments of {product.step}kg
          </div>
        </div>
      </CardContent>

      {/* Cart Controls */}
      <div className="p-8 pt-0">
        {isInCart ? (
          <div className="w-full space-y-5">
            {/* In Cart Status */}
            <div className={`flex items-center justify-between 
                            bg-gradient-to-r ${categoryColors.light} ${categoryColors.dark}
                            rounded-2xl p-5 border-2 
                            ${categoryColors.border}`}>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${categoryColors.textOnBg}`}>
                  Added to Cart
                </span>
                <span className={`text-lg font-black ${categoryColors.textOnBg}`}>
                  {cartItem.quantity}kg
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-700 dark:text-muted-foreground">Total</div>
                <div className={`text-2xl font-black ${categoryColors.textOnBg}`}>
                  {formatPrice(cartItem.product.pricePerKg * cartItem.quantity)}
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between bg-white dark:bg-card 
                            rounded-2xl p-4 border-2 border-gray-300 dark:border-border
                            shadow-inner">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateCartQuantity(handleStepDecrease(cartItem.quantity))}
                disabled={cartItem.quantity <= product.minOrder}
                className="h-12 w-12 p-0 rounded-full border-2 border-gray-400 dark:border-border
                           hover:bg-red-100 dark:hover:bg-destructive/10 
                           hover:border-red-500 dark:hover:border-destructive
                           disabled:opacity-30 font-bold text-lg"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="text-center px-6">
                <div className="text-2xl font-black text-gray-900 dark:text-card-foreground">
                  {cartItem.quantity}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">kg</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateCartQuantity(handleStepIncrease(cartItem.quantity))}
                disabled={cartItem.quantity >= product.maxOrder}
                className={`h-12 w-12 p-0 rounded-full border-2 border-gray-400 dark:border-border
                           hover:${categoryColors.bg} dark:hover:bg-primary/10 
                           ${categoryColors.hover} dark:hover:border-primary
                           disabled:opacity-30 font-bold text-lg`}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateQuantity(cartItem.product.id, 0)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                         dark:bg-gradient-to-r dark:from-destructive dark:to-destructive/80 dark:hover:from-destructive/90 dark:hover:to-destructive
                         text-white border-0 rounded-2xl py-4 font-bold text-lg
                         transform hover:scale-[1.02] transition-all duration-200
                         shadow-lg hover:shadow-xl"
            >
              Remove from Cart
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-5">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between 
                            bg-gray-100 dark:bg-muted/50 rounded-2xl p-4 
                            border-2 border-gray-300 dark:border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(handleStepDecrease(quantity))}
                disabled={quantity <= product.minOrder}
                className="h-12 w-12 p-0 rounded-full border-2 border-gray-400 dark:border-border
                           hover:bg-red-100 dark:hover:bg-destructive/10 
                           hover:border-red-500 dark:hover:border-destructive
                           disabled:opacity-30 font-bold text-lg"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="text-center px-6">
                <div className="text-2xl font-black text-gray-900 dark:text-card-foreground">
                  {quantity}
                </div>
                <div className="text-sm text-gray-600 dark:text-muted-foreground">kg</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(handleStepIncrease(quantity))}
                disabled={quantity >= product.maxOrder}
                className={`h-12 w-12 p-0 rounded-full border-2 border-gray-400 dark:border-border
                           hover:${categoryColors.bg} dark:hover:bg-primary/10 
                           ${categoryColors.hover} dark:hover:border-primary
                           disabled:opacity-30 font-bold text-lg`}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Smart Quick Add Buttons */}
            <div className="flex gap-2">
              {quickAddButtons.map((quickAdd, index) => {
                const colors = [
                  'hover:bg-blue-100 hover:border-blue-500 text-blue-800',
                  'hover:bg-purple-100 hover:border-purple-500 text-purple-800', 
                  'hover:bg-indigo-100 hover:border-indigo-500 text-indigo-800'
                ];
                const darkColors = [
                  'dark:hover:bg-info/10 dark:hover:border-info dark:text-info',
                  'dark:hover:bg-purple/10 dark:hover:border-purple dark:text-purple',
                  'dark:hover:bg-primary/10 dark:hover:border-primary dark:text-primary'
                ];
                return (
                  <Button
                    key={quickAdd}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(Math.min(product.maxOrder, quantity + quickAdd))}
                    disabled={quantity + quickAdd > product.maxOrder}
                    className={`flex-1 text-sm font-bold py-3 rounded-xl
                               border-2 border-gray-300 dark:border-border
                               ${colors[index % colors.length]} ${darkColors[index % darkColors.length]}
                               disabled:opacity-30 transition-all duration-200`}
                  >
                    +{quickAdd}kg
                  </Button>
                );
              })}
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-5 rounded-2xl font-black text-lg
                         transform hover:scale-[1.02] transition-all duration-300
                         shadow-xl hover:shadow-2xl
                         bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800
                         dark:bg-gradient-to-r dark:from-primary dark:to-primary/80 dark:hover:from-primary/90 dark:hover:to-primary
                         text-white dark:text-primary-foreground
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {!product.inStock ? 'Out of Stock' : `Add ${quantity}kg to Cart - ${formatPrice(product.pricePerKg * quantity)}`}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard; 