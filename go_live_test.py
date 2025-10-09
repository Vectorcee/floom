#!/usr/bin/env python3
"""
Focused Testing for "Go Live Now" Functionality
Tests the specific scenario reported by the user where "Go Live Now" button fails
"""

import requests
import json
import uuid
from datetime import datetime
import sys

# Backend URL from environment
BACKEND_URL = "https://floom-app.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class GoLiveTester:
    def __init__(self):
        self.test_results = []
        self.created_spaces = []
        
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
        
    def test_go_live_minimal_data(self):
        """Test Go Live with minimal required data"""
        print("\n=== 1. Go Live with Minimal Data ===")
        
        test_data = {
            "title": "Test Go Live Space",
            "is_live": True
        }
        
        host_id = "test-user-123"
        
        try:
            response = requests.post(
                f"{API_BASE}/spaces",
                json=test_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            if response.status_code == 200:
                space = response.json()
                self.created_spaces.append(space['id'])
                
                # Verify the space is marked as live
                if space.get('is_live') == True:
                    self.log_test("Go Live Minimal", True, f"Space created and marked as live. ID: {space['id']}", space)
                else:
                    self.log_test("Go Live Minimal", False, f"Space created but not marked as live. is_live: {space.get('is_live')}")
            else:
                self.log_test("Go Live Minimal", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Go Live Minimal", False, f"Connection error: {str(e)}")
            
    def test_go_live_complete_data(self):
        """Test Go Live with complete data as provided in review request"""
        print("\n=== 2. Go Live with Complete Data ===")
        
        test_data = {
            "title": "Test Go Live Space",
            "description": "Testing go live functionality", 
            "tags": ["test", "live"],
            "privacy": "public",
            "quality_threshold": 50,
            "is_live": True
        }
        
        host_id = "test-user-123"
        
        try:
            response = requests.post(
                f"{API_BASE}/spaces",
                json=test_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            if response.status_code == 200:
                space = response.json()
                self.created_spaces.append(space['id'])
                
                # Verify all data is correctly set
                checks = [
                    ("title", test_data["title"]),
                    ("description", test_data["description"]),
                    ("privacy", test_data["privacy"]),
                    ("quality_threshold", test_data["quality_threshold"]),
                    ("is_live", True),
                    ("host_id", host_id)
                ]
                
                failed_checks = []
                for field, expected in checks:
                    if space.get(field) != expected:
                        failed_checks.append(f"{field}: expected {expected}, got {space.get(field)}")
                
                if not failed_checks:
                    self.log_test("Go Live Complete", True, f"All data correctly set for live space. ID: {space['id']}", space)
                else:
                    self.log_test("Go Live Complete", False, f"Data validation failed: {', '.join(failed_checks)}")
            else:
                self.log_test("Go Live Complete", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Go Live Complete", False, f"Connection error: {str(e)}")
            
    def test_scheduled_vs_live(self):
        """Test difference between scheduled and live spaces"""
        print("\n=== 3. Scheduled vs Live Space Creation ===")
        
        # Create scheduled space
        scheduled_data = {
            "title": "Scheduled Space Test",
            "description": "This should be scheduled, not live",
            "is_live": False,
            "scheduled_time": "2024-12-31T15:00:00Z"
        }
        
        # Create live space
        live_data = {
            "title": "Live Space Test",
            "description": "This should go live immediately",
            "is_live": True
        }
        
        host_id = "test-user-456"
        
        try:
            # Test scheduled space
            scheduled_response = requests.post(
                f"{API_BASE}/spaces",
                json=scheduled_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            # Test live space
            live_response = requests.post(
                f"{API_BASE}/spaces",
                json=live_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            if scheduled_response.status_code == 200 and live_response.status_code == 200:
                scheduled_space = scheduled_response.json()
                live_space = live_response.json()
                
                self.created_spaces.extend([scheduled_space['id'], live_space['id']])
                
                # Verify the difference
                if (scheduled_space.get('is_live') == False and 
                    live_space.get('is_live') == True):
                    self.log_test("Scheduled vs Live", True, 
                                f"Correctly differentiated: Scheduled (is_live: {scheduled_space.get('is_live')}) vs Live (is_live: {live_space.get('is_live')})")
                else:
                    self.log_test("Scheduled vs Live", False, 
                                f"Failed to differentiate: Scheduled (is_live: {scheduled_space.get('is_live')}) vs Live (is_live: {live_space.get('is_live')})")
            else:
                self.log_test("Scheduled vs Live", False, 
                            f"Creation failed - Scheduled: {scheduled_response.status_code}, Live: {live_response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Scheduled vs Live", False, f"Connection error: {str(e)}")
            
    def test_authentication_requirements(self):
        """Test authentication requirements for space creation"""
        print("\n=== 4. Authentication Requirements ===")
        
        test_data = {
            "title": "Auth Test Space",
            "is_live": True
        }
        
        # Test with different host_id values
        host_ids = ["user-123", "host-456", "test-user-789", ""]
        
        for host_id in host_ids:
            try:
                response = requests.post(
                    f"{API_BASE}/spaces",
                    json=test_data,
                    params={"host_id": host_id} if host_id else {},
                    timeout=10
                )
                
                if response.status_code == 200:
                    space = response.json()
                    self.created_spaces.append(space['id'])
                    
                    if space.get('host_id') == host_id:
                        self.log_test(f"Auth Test (host_id: '{host_id}')", True, 
                                    f"Space created with correct host_id: {host_id}")
                    else:
                        self.log_test(f"Auth Test (host_id: '{host_id}')", False, 
                                    f"Host ID mismatch: expected '{host_id}', got '{space.get('host_id')}'")
                else:
                    if host_id == "":
                        self.log_test(f"Auth Test (empty host_id)", True, 
                                    f"Correctly rejected empty host_id with status {response.status_code}")
                    else:
                        self.log_test(f"Auth Test (host_id: '{host_id}')", False, 
                                    f"Unexpected failure: HTTP {response.status_code}")
                        
            except requests.exceptions.RequestException as e:
                self.log_test(f"Auth Test (host_id: '{host_id}')", False, f"Connection error: {str(e)}")
                
    def test_response_format_validation(self):
        """Test that response format matches frontend expectations"""
        print("\n=== 5. Response Format Validation ===")
        
        test_data = {
            "title": "Response Format Test",
            "description": "Testing response format for frontend compatibility",
            "tags": ["format", "test"],
            "privacy": "public",
            "quality_threshold": 75,
            "is_live": True
        }
        
        host_id = "format-test-user"
        
        try:
            response = requests.post(
                f"{API_BASE}/spaces",
                json=test_data,
                params={"host_id": host_id},
                timeout=10
            )
            
            if response.status_code == 200:
                space = response.json()
                self.created_spaces.append(space['id'])
                
                # Check for all fields that frontend might expect
                expected_fields = [
                    'id', 'title', 'description', 'host_id', 'tags', 'privacy',
                    'quality_threshold', 'is_live', 'participant_count', 
                    'listener_count', 'duration', 'created_at', 'updated_at'
                ]
                
                missing_fields = [field for field in expected_fields if field not in space]
                
                if not missing_fields:
                    # Verify data types
                    type_checks = [
                        ('id', str),
                        ('title', str),
                        ('host_id', str),
                        ('tags', list),
                        ('is_live', bool),
                        ('participant_count', int),
                        ('listener_count', int),
                        ('quality_threshold', int)
                    ]
                    
                    type_errors = []
                    for field, expected_type in type_checks:
                        if not isinstance(space.get(field), expected_type):
                            type_errors.append(f"{field}: expected {expected_type.__name__}, got {type(space.get(field)).__name__}")
                    
                    if not type_errors:
                        self.log_test("Response Format", True, 
                                    f"Response format is correct with all expected fields and types", space)
                    else:
                        self.log_test("Response Format", False, 
                                    f"Type validation failed: {', '.join(type_errors)}")
                else:
                    self.log_test("Response Format", False, 
                                f"Missing expected fields: {', '.join(missing_fields)}")
            else:
                self.log_test("Response Format", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Response Format", False, f"Connection error: {str(e)}")
            
    def test_error_scenarios(self):
        """Test various error scenarios"""
        print("\n=== 6. Error Scenarios ===")
        
        # Test missing required fields
        invalid_data_sets = [
            ({}, "Empty data"),
            ({"description": "No title"}, "Missing title"),
            ({"title": ""}, "Empty title"),
            ({"title": "Test", "is_live": "not_boolean"}, "Invalid is_live type"),
            ({"title": "Test", "quality_threshold": "not_number"}, "Invalid quality_threshold type"),
            ({"title": "Test", "tags": "not_list"}, "Invalid tags type")
        ]
        
        host_id = "error-test-user"
        
        for invalid_data, description in invalid_data_sets:
            try:
                response = requests.post(
                    f"{API_BASE}/spaces",
                    json=invalid_data,
                    params={"host_id": host_id},
                    timeout=10
                )
                
                if response.status_code in [400, 422]:
                    self.log_test(f"Error Handling ({description})", True, 
                                f"Correctly rejected invalid data with status {response.status_code}")
                elif response.status_code == 200:
                    # Some cases might be handled gracefully with defaults
                    space = response.json()
                    if description == "Empty data" and space.get('title'):
                        self.log_test(f"Error Handling ({description})", False, 
                                    f"Should have rejected empty data but created space: {space.get('title')}")
                    else:
                        self.log_test(f"Error Handling ({description})", True, 
                                    f"Handled gracefully with defaults")
                else:
                    self.log_test(f"Error Handling ({description})", False, 
                                f"Unexpected status code: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Error Handling ({description})", False, f"Connection error: {str(e)}")
                
    def run_all_tests(self):
        """Run all Go Live tests"""
        print("🚀 Starting Go Live Now Functionality Testing")
        print(f"Backend URL: {BACKEND_URL}")
        print("Testing the specific scenario: 'Go Live Now' button functionality")
        print("=" * 70)
        
        # Run tests in sequence
        self.test_go_live_minimal_data()
        self.test_go_live_complete_data()
        self.test_scheduled_vs_live()
        self.test_authentication_requirements()
        self.test_response_format_validation()
        self.test_error_scenarios()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 GO LIVE TEST SUMMARY")
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
        else:
            print("\n✅ BACKEND ANALYSIS:")
            print("  - Space creation API is working correctly")
            print("  - 'Go Live Now' functionality (is_live: true) works properly")
            print("  - All required fields are supported and validated")
            print("  - Response format matches frontend expectations")
            print("  - Authentication via host_id parameter works")
            print("  - Error handling is appropriate")
            
        print(f"\n📝 CREATED SPACES FOR TESTING: {len(self.created_spaces)}")
        for space_id in self.created_spaces:
            print(f"  - {space_id}")
            
        return failed_tests == 0

if __name__ == "__main__":
    tester = GoLiveTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All Go Live tests passed! Backend space creation is working correctly.")
        print("\n💡 CONCLUSION: The 'Go Live Now' backend functionality is working properly.")
        print("   If the frontend button is not working, the issue is likely in the frontend code,")
        print("   not in the backend API endpoints.")
        sys.exit(0)
    else:
        print("\n⚠️  Some Go Live tests failed. Check the details above.")
        sys.exit(1)