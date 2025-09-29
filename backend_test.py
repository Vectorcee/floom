#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Space-related Functionality
Tests all space-related backend endpoints and functionality
"""

import requests
import json
import uuid
from datetime import datetime
import sys

# Backend URL from environment
BACKEND_URL = "https://floom-app.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.created_space_id = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def test_api_health(self):
        """Test basic API health check"""
        print("\n=== 1. API Health Check ===")
        
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("API Health Check", True, f"API is responsive. Response: {data}")
                else:
                    self.log_test("API Health Check", False, f"Unexpected response format: {data}")
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            
    def test_get_spaces_list(self):
        """Test GET /api/spaces endpoint"""
        print("\n=== 2. Get Spaces List ===")
        
        try:
            response = requests.get(f"{API_BASE}/spaces", timeout=10)
            
            if response.status_code == 200:
                spaces = response.json()
                if isinstance(spaces, list):
                    self.log_test("Get Spaces List", True, f"Successfully retrieved {len(spaces)} spaces", spaces)
                    
                    # Validate space structure if spaces exist
                    if spaces:
                        space = spaces[0]
                        required_fields = ['id', 'title', 'host_id', 'is_live', 'participant_count', 'listener_count']
                        missing_fields = [field for field in required_fields if field not in space]
                        
                        if missing_fields:
                            self.log_test("Space Data Structure", False, f"Missing required fields: {missing_fields}")
                        else:
                            self.log_test("Space Data Structure", True, "All required fields present in space data")
                else:
                    self.log_test("Get Spaces List", False, f"Expected list, got: {type(spaces)}")
            else:
                self.log_test("Get Spaces List", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Spaces List", False, f"Connection error: {str(e)}")
            
    def test_create_space(self):
        """Test POST /api/spaces endpoint"""
        print("\n=== 3. Create Space ===")
        
        # Test data with realistic values
        test_space_data = {
            "title": "Tech Talk: AI in 2024",
            "description": "Join us for an engaging discussion about the latest AI developments and their impact on society.",
            "tags": ["technology", "AI", "discussion"],
            "privacy": "public",
            "quality_threshold": 75,
            "is_live": True,
            "cover_image_url": "https://example.com/tech-talk-cover.jpg"
        }
        
        test_host_id = str(uuid.uuid4())
        
        try:
            response = requests.post(
                f"{API_BASE}/spaces",
                json=test_space_data,
                params={"host_id": test_host_id},
                timeout=10
            )
            
            if response.status_code == 200:
                space = response.json()
                
                # Store created space ID for later tests
                self.created_space_id = space.get('id')
                
                # Validate response structure
                required_fields = ['id', 'title', 'host_id', 'is_live', 'participant_count', 'listener_count', 'created_at']
                missing_fields = [field for field in required_fields if field not in space]
                
                if missing_fields:
                    self.log_test("Create Space", False, f"Missing fields in response: {missing_fields}")
                elif space['host_id'] != test_host_id:
                    self.log_test("Create Space", False, f"Host ID mismatch. Expected: {test_host_id}, Got: {space['host_id']}")
                elif space['title'] != test_space_data['title']:
                    self.log_test("Create Space", False, f"Title mismatch. Expected: {test_space_data['title']}, Got: {space['title']}")
                else:
                    self.log_test("Create Space", True, f"Space created successfully with ID: {space['id']}", space)
            else:
                self.log_test("Create Space", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Space", False, f"Connection error: {str(e)}")
            
    def test_get_specific_space(self):
        """Test GET /api/spaces/{space_id} endpoint"""
        print("\n=== 4. Get Specific Space ===")
        
        if not self.created_space_id:
            self.log_test("Get Specific Space", False, "No space ID available from create test")
            return
            
        try:
            response = requests.get(f"{API_BASE}/spaces/{self.created_space_id}", timeout=10)
            
            if response.status_code == 200:
                space = response.json()
                
                if space.get('id') == self.created_space_id:
                    self.log_test("Get Specific Space", True, f"Successfully retrieved space: {space['title']}", space)
                else:
                    self.log_test("Get Specific Space", False, f"ID mismatch. Expected: {self.created_space_id}, Got: {space.get('id')}")
            else:
                self.log_test("Get Specific Space", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Specific Space", False, f"Connection error: {str(e)}")
            
    def test_update_space(self):
        """Test PUT /api/spaces/{space_id} endpoint"""
        print("\n=== 5. Update Space ===")
        
        if not self.created_space_id:
            self.log_test("Update Space", False, "No space ID available from create test")
            return
            
        # Updated data
        update_data = {
            "title": "Tech Talk: AI in 2024 - Updated",
            "description": "Updated description with more details about the discussion topics.",
            "tags": ["technology", "AI", "discussion", "updated"],
            "privacy": "public",
            "quality_threshold": 80,
            "is_live": False
        }
        
        # We need the original host_id for the update
        try:
            # First get the space to get the host_id
            get_response = requests.get(f"{API_BASE}/spaces/{self.created_space_id}", timeout=10)
            if get_response.status_code != 200:
                self.log_test("Update Space", False, "Could not retrieve space for host_id")
                return
                
            original_space = get_response.json()
            host_id = original_space.get('host_id')
            
            response = requests.put(
                f"{API_BASE}/spaces/{self.created_space_id}",
                json=update_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            if response.status_code == 200:
                updated_space = response.json()
                
                if updated_space.get('title') == update_data['title']:
                    self.log_test("Update Space", True, f"Space updated successfully: {updated_space['title']}", updated_space)
                else:
                    self.log_test("Update Space", False, f"Update failed. Title not changed: {updated_space.get('title')}")
            else:
                self.log_test("Update Space", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Update Space", False, f"Connection error: {str(e)}")
            
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== 6. Error Handling Tests ===")
        
        # Test 404 for non-existent space
        fake_space_id = str(uuid.uuid4())
        try:
            response = requests.get(f"{API_BASE}/spaces/{fake_space_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_test("404 Error Handling", True, "Correctly returns 404 for non-existent space")
            else:
                self.log_test("404 Error Handling", False, f"Expected 404, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("404 Error Handling", False, f"Connection error: {str(e)}")
            
        # Test invalid space ID format
        try:
            response = requests.get(f"{API_BASE}/spaces/invalid-id-format", timeout=10)
            
            if response.status_code in [400, 404, 422]:
                self.log_test("Invalid ID Format Handling", True, f"Correctly handles invalid ID format with status {response.status_code}")
            else:
                self.log_test("Invalid ID Format Handling", False, f"Unexpected status code for invalid ID: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid ID Format Handling", False, f"Connection error: {str(e)}")
            
    def test_data_persistence(self):
        """Test that data persists correctly"""
        print("\n=== 7. Data Persistence Test ===")
        
        if not self.created_space_id:
            self.log_test("Data Persistence", False, "No space ID available for persistence test")
            return
            
        try:
            # Get the space again to verify it still exists
            response = requests.get(f"{API_BASE}/spaces/{self.created_space_id}", timeout=10)
            
            if response.status_code == 200:
                space = response.json()
                self.log_test("Data Persistence", True, f"Space data persisted correctly: {space['title']}")
            else:
                self.log_test("Data Persistence", False, f"Space not found after creation: HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Data Persistence", False, f"Connection error: {str(e)}")
            
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend Testing for Space Functionality")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 70)
        
        # Run tests in sequence
        self.test_api_health()
        self.test_get_spaces_list()
        self.test_create_space()
        self.test_get_specific_space()
        self.test_update_space()
        self.test_error_handling()
        self.test_data_persistence()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
                    
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        sys.exit(1)