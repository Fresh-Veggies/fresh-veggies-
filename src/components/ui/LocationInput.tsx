'use client';

import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface LocationInputProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSelect,
  placeholder = "Enter your delivery address",
  className = ""
}) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtbYWVa_-goPXnHJFmMjEanl4EEK90cFI&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      initializeAutocomplete();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'IN' }, // Restrict to India
        fields: ['formatted_address', 'geometry.location', 'address_components']
      }
    );

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      setError('Please select a valid address from the suggestions');
      return;
    }

    const location = {
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    };

    setAddress(location.address);
    setError('');
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          if (window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = new window.google.maps.LatLng(latitude, longitude);
            
            geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
              setIsLoading(false);
              
              if (status === 'OK' && results[0]) {
                const location = {
                  address: results[0].formatted_address,
                  latitude,
                  longitude
                };
                
                setAddress(location.address);
                onLocationSelect(location);
              } else {
                setError('Unable to get address for your location');
              }
            });
          }
        } catch (err) {
          setIsLoading(false);
          setError('Error getting your location');
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
          placeholder={placeholder}
          className="pr-20"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'GPS'}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <p className="text-xs text-gray-500">
        Start typing your address or click GPS to use your current location
      </p>
    </div>
  );
};

export default LocationInput; 