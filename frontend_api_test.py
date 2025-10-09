#!/usr/bin/env python3
"""
Test frontend API integration after fixing the backend URL issue
"""

import requests
import json
import uuid
import os

# Read the correct backend URL from frontend/.env
def get_backend_url():
    env_path = '/app/frontend/.env'
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    return 'http://localhost:8001'

BACKEND_URL = get_backend_url()
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing with Backend URL: {BACKEND_URL}")

def test_go_live_functionality():
    """Test the exact scenario from the Go Live Now button"""
    
    # Test data that matches what the frontend would send
    test_data = {
        "title": "Frontend Go Live Test",
        "description": "Testing the Go Live Now button functionality",
        "tags": ["test", "frontend", "live"],
        "privacy": "public",
        "quality_threshold": 50,
        "is_live": True,
        "cover_image_url": None
    }
    
    # Use a realistic user ID
    host_id = "frontend-test-user-" + str(uuid.uuid4())[:8]
    
    try:
        print("\n=== Testing Go Live Now Functionality ===")
        print(f"API Endpoint: {API_BASE}/spaces?host_id={host_id}")
        print(f"Request Data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            f"{API_BASE}/spaces",
            json=test_data,
            params={"host_id": host_id},
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            space = response.json()
            print(f"✅ SUCCESS: Space created successfully!")
            print(f"Space ID: {space['id']}")
            print(f"Title: {space['title']}")
            print(f"Is Live: {space['is_live']}")
            print(f"Host ID: {space['host_id']}")
            
            # Verify the space can be retrieved
            get_response = requests.get(f"{API_BASE}/spaces/{space['id']}", timeout=10)
            if get_response.status_code == 200:
                print(f"✅ Space retrieval confirmed: {get_response.json()['title']}")
                return True
            else:
                print(f"❌ Failed to retrieve created space: {get_response.status_code}")
                return False
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CONNECTION ERROR: {str(e)}")
        return False

def test_api_connectivity():
    """Test basic API connectivity"""
    try:
        print("\n=== Testing API Connectivity ===")
        response = requests.get(f"{API_BASE}/", timeout=10)
        
        if response.status_code == 200:
            print(f"✅ API is reachable: {response.json()}")
            return True
        else:
            print(f"❌ API returned {response.status_code}: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API connectivity failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Frontend API Integration After Fix")
    print("=" * 60)
    
    # Test API connectivity first
    api_ok = test_api_connectivity()
    
    if api_ok:
        # Test Go Live functionality
        go_live_ok = test_go_live_functionality()
        
        if go_live_ok:
            print("\n🎉 ALL TESTS PASSED!")
            print("The 'Go Live Now' functionality should now work correctly.")
        else:
            print("\n⚠️ Go Live functionality still has issues.")
    else:
        print("\n❌ API connectivity failed - cannot test Go Live functionality.")