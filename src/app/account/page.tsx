'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Edit3, Save, X, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validateMobile } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
}

export default function AccountPage() {
  const { user, isAuthenticated, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    mobile: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      });
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(profileData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      updateUser(profileData);
      setIsEditing(false);
    } catch {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setProfileData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Manage your profile and account settings</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <p className="text-sm text-gray-600">Update your personal details</p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isEditing ? (
                /* Edit Mode */
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={profileData.mobile}
                    onChange={handleInputChange}
                    error={errors.mobile}
                    required
                    maxLength={10}
                  />
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      loading={isSaving}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile Number</p>
                      <p className="font-medium">{user.mobile}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <p className="text-sm text-gray-600">Your default delivery address</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user.address ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{user.address.fullName}</p>
                <p className="text-gray-700">{user.address.street}</p>
                <p className="text-gray-700">{user.address.city}, {user.address.pincode}</p>
                <div className="mt-2 text-sm text-gray-600">
                  📱 {user.address.mobile} • 📧 {user.address.email}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No delivery address saved yet</p>
                <p className="text-sm text-gray-500">
                  Your delivery address will be saved automatically when you place your first order
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/orders" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Order History
                </Button>
              </Link>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Password management will be available in the full version of the application.
                </p>
                <Button variant="outline" disabled className="w-full sm:w-auto">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                View Orders
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 