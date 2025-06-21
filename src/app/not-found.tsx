'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            It might have been moved, deleted, or doesn&apos;t exist.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <div className="pt-4">
            <button 
              onClick={() => window.history.back()} 
              className="text-gray-600 hover:text-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact us at support@freshveggies.com</p>
        </div>
      </div>
    </div>
  );
} 