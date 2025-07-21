import requests
import json
import sys
from datetime import datetime

class CapinhaAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.design_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys())}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_phone_models(self):
        """Test phone models endpoint"""
        success, data = self.run_test("Phone Models", "GET", "api/phone-models", 200)
        if success and 'models' in data:
            print(f"   Found {len(data['models'])} phone models")
            for model in data['models'][:2]:  # Show first 2
                print(f"   - {model['name']} ({model['brand']})")
        return success

    def test_popular_phone_models(self):
        """Test popular phone models endpoint"""
        success, data = self.run_test("Popular Phone Models", "GET", "api/phone-models/popular", 200)
        if success and 'models' in data:
            print(f"   Found {len(data['models'])} popular models")
        return success

    def test_gallery(self):
        """Test gallery endpoint"""
        success, data = self.run_test("Gallery", "GET", "api/gallery", 200)
        if success and 'items' in data:
            print(f"   Found {len(data['items'])} gallery items")
            for item in data['items'][:2]:  # Show first 2
                print(f"   - {item['title']} ({item['category']})")
        return success

    def test_gallery_trending(self):
        """Test trending gallery endpoint"""
        success, data = self.run_test("Trending Gallery", "GET", "api/gallery/trending", 200)
        if success and 'items' in data:
            print(f"   Found {len(data['items'])} trending items")
        return success

    def test_gallery_category(self):
        """Test gallery by category"""
        success, data = self.run_test("Gallery by Category", "GET", "api/gallery/category/romantic", 200)
        if success and 'items' in data:
            print(f"   Found {len(data['items'])} romantic items")
        return success

    def test_create_design(self):
        """Test design creation"""
        design_data = {
            "phone_model": "iphone15-pro",
            "design_type": "gallery",
            "image_url": "/static/gallery/hearts-floating.png",
            "position": {"x": 0, "y": 0, "scale": 1, "rotation": 0},
            "text_overlay": None
        }
        
        success, data = self.run_test("Create Design", "POST", "api/create-design", 200, design_data)
        if success and 'design' in data:
            self.design_id = data['design']['id']
            print(f"   Created design with ID: {self.design_id}")
        return success

    def test_get_design(self):
        """Test getting a specific design"""
        if not self.design_id:
            print("❌ Skipping - No design ID available")
            return False
            
        success, data = self.run_test("Get Design", "GET", f"api/design/{self.design_id}", 200)
        if success and 'design' in data:
            design = data['design']
            print(f"   Retrieved design: {design['phone_model']} - {design['design_type']}")
        return success

    def test_create_order(self):
        """Test order creation"""
        if not self.design_id:
            print("❌ Skipping - No design ID available")
            return False
            
        order_data = {
            "design_id": self.design_id,
            "customer_info": {
                "name": "Test Customer",
                "email": "test@example.com",
                "phone": "11999999999",
                "address": "Test Address, 123"
            }
        }
        
        success, data = self.run_test("Create Order", "POST", "api/create-order", 200, order_data)
        if success and 'order' in data:
            order_id = data['order']['id']
            print(f"   Created order with ID: {order_id}")
        return success

    def test_stats(self):
        """Test stats endpoint"""
        success, data = self.run_test("Stats", "GET", "api/stats", 200)
        if success:
            print(f"   Stats: {data}")
        return success

    def test_upload_image_without_file(self):
        """Test upload endpoint without file (should fail)"""
        success, data = self.run_test("Upload Image (No File)", "POST", "api/upload-image", 422)
        # This should fail with 422, so success means it failed as expected
        return success

def main():
    print("🚀 Starting Capinha Personalizada API Tests")
    print("=" * 50)
    
    # Initialize tester
    tester = CapinhaAPITester("http://localhost:8001")
    
    # Run all tests
    test_methods = [
        tester.test_root_endpoint,
        tester.test_phone_models,
        tester.test_popular_phone_models,
        tester.test_gallery,
        tester.test_gallery_trending,
        tester.test_gallery_category,
        tester.test_create_design,
        tester.test_get_design,
        tester.test_create_order,
        tester.test_stats,
        tester.test_upload_image_without_file
    ]
    
    print(f"\n📋 Running {len(test_methods)} API tests...")
    
    for test_method in test_methods:
        test_method()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())