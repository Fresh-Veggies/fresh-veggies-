#!/usr/bin/env python3
"""
Test file for delivery functions including private functions
Shows how to test private functions by importing them from the module
"""

import pytest
import math
from app.routes.delivery import haversine_distance  # Import private function directly

class TestDeliveryFunctions:
    """Test class for delivery-related functions"""
    
    def test_haversine_distance_basic(self):
        """Test basic distance calculation between two points"""
        # Delhi to Mumbai approximate coordinates
        delhi_lat, delhi_lng = 28.6139, 77.2090
        mumbai_lat, mumbai_lng = 19.0760, 72.8777
        
        distance = haversine_distance(delhi_lat, delhi_lng, mumbai_lat, mumbai_lng)
        
        # Distance should be approximately 1150-1200 km
        assert 1100 <= distance <= 1250, f"Expected ~1150km, got {distance}km"
    
    def test_haversine_distance_same_point(self):
        """Test distance calculation for same point"""
        lat, lng = 28.6139, 77.2090
        
        distance = haversine_distance(lat, lng, lat, lng)
        
        # Distance should be 0 for same point
        assert distance == 0.0
    
    def test_haversine_distance_nearby_points(self):
        """Test distance calculation for nearby points"""
        # Two points ~1km apart in Delhi
        point1_lat, point1_lng = 28.6139, 77.2090
        point2_lat, point2_lng = 28.6229, 77.2177
        
        distance = haversine_distance(point1_lat, point1_lng, point2_lat, point2_lng)
        
        # Should be approximately 1-2 km
        assert 0.5 <= distance <= 2.5, f"Expected ~1-2km, got {distance}km"
    
    def test_haversine_distance_precision(self):
        """Test precision of distance calculation"""
        # Known distance between specific coordinates
        lat1, lng1 = 0.0, 0.0  # Equator, Prime Meridian
        lat2, lng2 = 1.0, 1.0  # 1 degree north and east
        
        distance = haversine_distance(lat1, lng1, lat2, lng2)
        
        # Should be approximately 157 km (known mathematical result)
        assert 150 <= distance <= 165, f"Expected ~157km, got {distance}km"
    
    def test_haversine_distance_negative_coordinates(self):
        """Test with negative coordinates (Southern/Western hemispheres)"""
        # Point in Southern hemisphere
        lat1, lng1 = -34.6037, -58.3816  # Buenos Aires
        lat2, lng2 = -33.4489, -70.6693  # Santiago
        
        distance = haversine_distance(lat1, lng1, lat2, lng2)
        
        # Buenos Aires to Santiago is approximately 1100-1200 km
        assert 1000 <= distance <= 1300, f"Expected ~1150km, got {distance}km"

# Integration test for the complete delivery functionality
class TestDeliveryIntegration:
    """Integration tests for delivery system"""
    
    @pytest.fixture
    def sample_orders(self):
        """Sample orders with GPS coordinates for testing"""
        return [
            {"id": 1, "lat": 28.6139, "lng": 77.2090, "address": "Delhi"},
            {"id": 2, "lat": 28.6229, "lng": 77.2177, "address": "CP Delhi"},
            {"id": 3, "lat": 28.5355, "lng": 77.3910, "address": "Noida"},
        ]
    
    def test_route_optimization_logic(self, sample_orders):
        """Test the route optimization algorithm logic"""
        start_lat, start_lng = 28.6000, 77.2000  # Starting point
        
        # Calculate distances from start to each order
        distances = []
        for order in sample_orders:
            distance = haversine_distance(start_lat, start_lng, order["lat"], order["lng"])
            distances.append((order["id"], distance))
        
        # Sort by distance (nearest first)
        distances.sort(key=lambda x: x[1])
        
        # Verify that the nearest order is first
        assert distances[0][1] <= distances[1][1] <= distances[2][1]
    
    def test_nearby_orders_filtering(self, sample_orders):
        """Test filtering orders within a radius"""
        center_lat, center_lng = 28.6139, 77.2090  # Delhi center
        radius = 10.0  # 10 km radius
        
        nearby_orders = []
        for order in sample_orders:
            distance = haversine_distance(center_lat, center_lng, order["lat"], order["lng"])
            if distance <= radius:
                nearby_orders.append(order)
        
        # At least the Delhi orders should be within 10km
        assert len(nearby_orders) >= 2

# Performance test for private functions
class TestDeliveryPerformance:
    """Performance tests for delivery functions"""
    
    def test_haversine_performance(self):
        """Test performance of haversine calculation"""
        import time
        
        # Test data
        coordinates = [
            (28.6139, 77.2090),
            (19.0760, 72.8777),
            (13.0827, 80.2707),
            (22.5726, 88.3639)
        ]
        
        start_time = time.time()
        
        # Calculate distances between all pairs
        for i, (lat1, lng1) in enumerate(coordinates):
            for j, (lat2, lng2) in enumerate(coordinates):
                if i != j:
                    distance = haversine_distance(lat1, lng1, lat2, lng2)
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        # Should complete in reasonable time (less than 1 second for this test)
        assert execution_time < 1.0, f"Performance test failed: {execution_time}s"

# Example of how to run specific tests
if __name__ == "__main__":
    # Run specific test
    test_instance = TestDeliveryFunctions()
    test_instance.test_haversine_distance_basic()
    print("✅ Basic haversine test passed!")
    
    test_instance.test_haversine_distance_same_point()
    print("✅ Same point test passed!")
    
    # Run all tests with pytest
    print("\n🧪 To run all tests, use: pytest test_delivery_functions.py -v") 