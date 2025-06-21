'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Fresh Vegetables for Your Business
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Premium quality vegetables delivered in bulk to hostels, PGs, restaurants, and tiffin services. 
          Competitive prices, reliable supply, fresh guarantee.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            ✓ Minimum order 1kg
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            ✓ Fresh daily supply
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            ✓ Competitive wholesale prices
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
            ✓ Reliable delivery
          </div>
        </div>

        {/* Bulk Ordering Feature Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-2xl">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900">Fast Bulk Ordering</h3>
          </div>
          <p className="text-gray-700 mb-4 text-center">
            Speed up your ordering with our new bulk increment buttons! Perfect for commercial kitchens.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="font-medium text-green-600">Quick Add:</span> +5kg, +10kg, +25kg, +50kg
            </div>
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
              <span className="font-medium text-blue-600">Instant Set:</span> 10kg, 25kg, 50kg, 100kg
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search vegetables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Category:</span>
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          {isLoading ? (
            'Loading products...'
          ) : (
            <>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</>
          )}
          {searchQuery && (
            <span className="ml-1">
              for &quot;<strong>{searchQuery}</strong>&quot;
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="ml-1">
              in <strong>{selectedCategory}</strong>
            </span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="mt-16 bg-green-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of businesses that trust FreshVeggies for their daily vegetable needs. 
            Sign up today and get access to wholesale prices and reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Create Account
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
