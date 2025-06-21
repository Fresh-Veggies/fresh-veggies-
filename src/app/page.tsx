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

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6
                         bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent 
                         dark:bg-gradient-to-r dark:from-primary dark:via-success dark:to-info dark:bg-clip-text dark:text-transparent">
            Fresh Vegetables for Your Business
          </h1>
          <p className="text-xl text-gray-700 dark:text-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Premium quality vegetables delivered in bulk to hostels, PGs, restaurants, and tiffin services. 
            Competitive prices, reliable supply, fresh guarantee.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="bg-gradient-to-r from-green-200 to-emerald-300 dark:bg-gradient-to-r dark:from-success/20 dark:to-primary/10 
                            px-6 py-4 rounded-2xl shadow-lg border-2 border-green-400 dark:border-success/50 
                            hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-green-800 dark:text-success font-bold text-lg">✓</span> 
              <span className="font-semibold text-green-900 dark:text-success ml-2">Minimum order 1kg</span>
            </div>
            <div className="bg-gradient-to-r from-blue-200 to-sky-300 dark:bg-gradient-to-r dark:from-info/15 dark:to-primary/5 
                            px-6 py-4 rounded-2xl shadow-lg border-2 border-blue-400 dark:border-info/40 
                            hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-blue-800 dark:text-info font-bold text-lg">✓</span> 
              <span className="font-semibold text-blue-900 dark:text-info ml-2">Fresh daily supply</span>
            </div>
            <div className="bg-gradient-to-r from-purple-200 to-violet-300 dark:bg-gradient-to-r dark:from-purple/15 dark:to-purple/5 
                            px-6 py-4 rounded-2xl shadow-lg border-2 border-purple-400 dark:border-purple/40 
                            hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-purple-800 dark:text-purple font-bold text-lg">✓</span> 
              <span className="font-semibold text-purple-900 dark:text-purple ml-2">Competitive wholesale prices</span>
            </div>
            <div className="bg-gradient-to-r from-orange-200 to-amber-300 dark:bg-gradient-to-r dark:from-orange/15 dark:to-warning/10 
                            px-6 py-4 rounded-2xl shadow-lg border-2 border-orange-400 dark:border-orange/40 
                            hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-orange-800 dark:text-orange font-bold text-lg">✓</span> 
              <span className="font-semibold text-orange-900 dark:text-orange ml-2">Reliable delivery</span>
            </div>
          </div>

          {/* Bulk Ordering Feature Highlight */}
          <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-slate-100 
                          dark:bg-gradient-to-r dark:from-card dark:via-card/80 dark:to-muted/50 
                          rounded-3xl p-10 max-w-5xl mx-auto shadow-xl 
                          border-2 border-gray-300 dark:border-border">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl">⚡</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent
                             dark:bg-gradient-to-r dark:from-primary dark:to-success dark:bg-clip-text dark:text-transparent">
                Fast Bulk Ordering
              </h3>
            </div>
            <p className="text-lg text-gray-700 dark:text-foreground/70 mb-8 text-center leading-relaxed">
              Speed up your ordering with our new bulk increment buttons! Perfect for commercial kitchens.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="bg-white dark:bg-card/90 px-6 py-4 rounded-2xl shadow-lg 
                              border-2 border-green-500 dark:border-success/50 
                              hover:shadow-xl transition-all">
                <span className="font-bold text-green-800 dark:text-success">Quick Add:</span> 
                <span className="ml-3 text-gray-700 dark:text-foreground/70">+5kg, +10kg, +25kg</span>
              </div>
              <div className="bg-white dark:bg-card/90 px-6 py-4 rounded-2xl shadow-lg 
                              border-2 border-blue-500 dark:border-info/40 
                              hover:shadow-xl transition-all">
                <span className="font-bold text-blue-800 dark:text-info">Instant Set:</span> 
                <span className="ml-3 text-gray-700 dark:text-foreground/70">10kg, 25kg, 50kg, 100kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-2xl border-2 border-gray-300 dark:border-border 
                           focus:border-green-600 dark:focus:border-primary/80 
                           shadow-sm hover:shadow-md transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
              <span className="text-sm font-semibold text-gray-800 dark:text-foreground/80">Category:</span>
              {CATEGORIES.map((category, index) => {
                const categoryColors = [
                  'hover:bg-green-100 dark:hover:bg-success/10 border-green-400 dark:border-success/30 text-green-800 dark:text-success',
                  'hover:bg-blue-100 dark:hover:bg-info/10 border-blue-400 dark:border-info/30 text-blue-800 dark:text-info',
                  'hover:bg-orange-100 dark:hover:bg-orange/10 border-orange-400 dark:border-orange/30 text-orange-800 dark:text-orange',
                  'hover:bg-purple-100 dark:hover:bg-purple/10 border-purple-400 dark:border-purple/30 text-purple-800 dark:text-purple',
                  'hover:bg-pink-100 dark:hover:bg-pink/10 border-pink-400 dark:border-pink/30 text-pink-800 dark:text-pink'
                ];
                
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 font-medium
                               hover:shadow-md transition-all duration-200
                               ${selectedCategory !== category ? categoryColors[index % categoryColors.length] : ''}`}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-700 dark:text-foreground/70 text-lg font-medium">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery && (
              <span className="ml-1">
                for &quot;<strong className="text-gray-900 dark:text-foreground font-bold">{searchQuery}</strong>&quot;
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="ml-1">
                in <strong className="text-gray-900 dark:text-foreground font-bold">{selectedCategory}</strong>
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-muted-foreground mb-6">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">No products found</h3>
            <p className="text-gray-700 dark:text-foreground/70 mb-8 text-lg">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 
                        dark:bg-gradient-to-r dark:from-success/20 dark:via-primary/15 dark:to-info/10 
                        rounded-3xl p-12 shadow-xl border-2 border-green-400 dark:border-success/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-900 dark:text-success mb-4">
              Ready to Start Your Bulk Order?
            </h2>
            <p className="text-lg text-green-800 dark:text-success/80 mb-8">
              Join hundreds of satisfied customers who trust us for their daily vegetable needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg font-bold rounded-2xl
                           bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800
                           dark:bg-gradient-to-r dark:from-primary dark:to-success dark:hover:from-primary/90 dark:hover:to-success
                           shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-bold rounded-2xl
                           border-2 border-green-700 dark:border-success text-green-700 dark:text-success
                           hover:bg-green-100 dark:hover:bg-success/10
                           shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
