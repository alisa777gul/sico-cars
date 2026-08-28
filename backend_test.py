#!/usr/bin/env python3
"""
Backend API Tests for SICO Cars
Tests all backend endpoints: /api/cars, /api/cars/{id}, /api/inquiries
"""

import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://sico-digital-garage.preview.emergentagent.com/api"

def test_get_cars():
    """Test GET /api/cars - should return 30 cars with UUID ids, no _id field"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/cars - List all cars")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/cars", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        cars = response.json()
        print(f"Number of cars returned: {len(cars)}")
        
        # Check if we have exactly 30 cars
        if len(cars) != 30:
            print(f"❌ FAILED: Expected 30 cars, got {len(cars)}")
            return False
        
        # Check first car structure
        if cars:
            first_car = cars[0]
            print(f"\nFirst car sample:")
            print(f"  - id: {first_car.get('id', 'MISSING')}")
            print(f"  - brand: {first_car.get('brand', 'MISSING')}")
            print(f"  - name: {first_car.get('name', 'MISSING')}")
            print(f"  - fuel: {first_car.get('fuel', 'MISSING')}")
            print(f"  - power: {first_car.get('power', 'MISSING')}")
            print(f"  - transmission: {first_car.get('transmission', 'MISSING')}")
            print(f"  - year: {first_car.get('year', 'MISSING')}")
            print(f"  - mileage: {first_car.get('mileage', 'MISSING')}")
            print(f"  - price: {first_car.get('price', 'MISSING')}")
            print(f"  - dph: {first_car.get('dph', 'MISSING')}")
            print(f"  - image: {first_car.get('image', 'MISSING')}")
            print(f"  - image2: {first_car.get('image2', 'MISSING')}")
            
            # Check for UUID id field
            if 'id' not in first_car:
                print(f"❌ FAILED: Missing 'id' field")
                return False
            
            # Check that _id is NOT present
            if '_id' in first_car:
                print(f"❌ FAILED: MongoDB _id field is leaking")
                return False
            
            # Verify all required fields
            required_fields = ['id', 'brand', 'name', 'fuel', 'power', 'transmission', 
                             'year', 'mileage', 'dph', 'image', 'image2']
            missing_fields = [f for f in required_fields if f not in first_car]
            if missing_fields:
                print(f"❌ FAILED: Missing required fields: {missing_fields}")
                return False
        
        # Check all cars for _id leak
        for i, car in enumerate(cars):
            if '_id' in car:
                print(f"❌ FAILED: Car at index {i} has _id field leaking")
                return False
            if 'id' not in car:
                print(f"❌ FAILED: Car at index {i} missing UUID id field")
                return False
        
        print(f"\n✅ PASSED: GET /api/cars returns 30 cars with UUID ids, no _id leak")
        return cars  # Return cars for next test
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_get_cars_no_duplicate():
    """Test that calling GET /api/cars multiple times doesn't duplicate data"""
    print("\n" + "="*80)
    print("TEST 2: GET /api/cars - Verify no duplication on multiple calls")
    print("="*80)
    
    try:
        # First call
        response1 = requests.get(f"{BASE_URL}/cars", timeout=10)
        cars1 = response1.json()
        count1 = len(cars1)
        print(f"First call: {count1} cars")
        
        # Second call
        response2 = requests.get(f"{BASE_URL}/cars", timeout=10)
        cars2 = response2.json()
        count2 = len(cars2)
        print(f"Second call: {count2} cars")
        
        # Third call
        response3 = requests.get(f"{BASE_URL}/cars", timeout=10)
        cars3 = response3.json()
        count3 = len(cars3)
        print(f"Third call: {count3} cars")
        
        if count1 == count2 == count3 == 30:
            print(f"\n✅ PASSED: Multiple calls return consistent 30 cars (no duplication)")
            return True
        else:
            print(f"❌ FAILED: Inconsistent counts: {count1}, {count2}, {count3}")
            return False
            
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_get_single_car(cars):
    """Test GET /api/cars/{id} - valid and invalid ids"""
    print("\n" + "="*80)
    print("TEST 3: GET /api/cars/{id} - Single car by ID")
    print("="*80)
    
    if not cars or len(cars) == 0:
        print("❌ FAILED: No cars available for testing")
        return False
    
    try:
        # Test with valid ID
        test_car = cars[0]
        car_id = test_car['id']
        print(f"\nTesting with valid ID: {car_id}")
        
        response = requests.get(f"{BASE_URL}/cars/{car_id}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        car = response.json()
        print(f"Returned car: {car.get('brand')} {car.get('name')}")
        
        # Verify it's the correct car
        if car.get('id') != car_id:
            print(f"❌ FAILED: Wrong car returned")
            return False
        
        # Check no _id leak
        if '_id' in car:
            print(f"❌ FAILED: MongoDB _id field is leaking")
            return False
        
        print(f"✅ Valid ID test passed")
        
        # Test with invalid ID
        print(f"\nTesting with invalid ID: nonexistent-uuid-12345")
        response = requests.get(f"{BASE_URL}/cars/nonexistent-uuid-12345", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 404:
            print(f"❌ FAILED: Expected 404, got {response.status_code}")
            return False
        
        error_data = response.json()
        print(f"Error response: {error_data}")
        
        if 'error' not in error_data:
            print(f"❌ FAILED: Expected error message in response")
            return False
        
        print(f"✅ Invalid ID test passed")
        print(f"\n✅ PASSED: GET /api/cars/{{id}} works correctly for valid and invalid IDs")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_inquiry_valid_car_lead():
    """Test POST /api/inquiries with valid car lead"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/inquiries - Valid car lead")
    print("="*80)
    
    try:
        # Get a real car ID first
        response = requests.get(f"{BASE_URL}/cars", timeout=10)
        cars = response.json()
        if not cars:
            print("❌ FAILED: No cars available to get ID")
            return False
        
        car_id = cars[0]['id']
        car_name = f"{cars[0]['brand']} {cars[0]['name']}"
        
        payload = {
            "name": "Ján Novák",
            "phone": "+421900123456",
            "type": "car",
            "carId": car_id,
            "carName": car_name
        }
        
        print(f"Sending payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/inquiries",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 201:
            print(f"❌ FAILED: Expected 201, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        inquiry = response.json()
        print(f"Created inquiry: {json.dumps(inquiry, indent=2)}")
        
        # Verify UUID id
        if 'id' not in inquiry:
            print(f"❌ FAILED: Missing UUID id in response")
            return False
        
        # Check no _id leak
        if '_id' in inquiry:
            print(f"❌ FAILED: MongoDB _id field is leaking")
            return False
        
        # Verify fields
        if inquiry.get('name') != payload['name']:
            print(f"❌ FAILED: Name mismatch")
            return False
        
        if inquiry.get('phone') != payload['phone']:
            print(f"❌ FAILED: Phone mismatch")
            return False
        
        if inquiry.get('carId') != payload['carId']:
            print(f"❌ FAILED: carId mismatch")
            return False
        
        print(f"\n✅ PASSED: POST /api/inquiries with valid car lead")
        return inquiry['id']
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_inquiry_valid_general_lead():
    """Test POST /api/inquiries with valid general lead"""
    print("\n" + "="*80)
    print("TEST 5: POST /api/inquiries - Valid general lead")
    print("="*80)
    
    try:
        payload = {
            "name": "Mária Kováčová",
            "email": "maria.kovacova@example.sk",
            "message": "Mám záujem o financovanie vozidla"
        }
        
        print(f"Sending payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/inquiries",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 201:
            print(f"❌ FAILED: Expected 201, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        inquiry = response.json()
        print(f"Created inquiry: {json.dumps(inquiry, indent=2)}")
        
        # Verify UUID id
        if 'id' not in inquiry:
            print(f"❌ FAILED: Missing UUID id in response")
            return False
        
        # Check no _id leak
        if '_id' in inquiry:
            print(f"❌ FAILED: MongoDB _id field is leaking")
            return False
        
        print(f"\n✅ PASSED: POST /api/inquiries with valid general lead")
        return inquiry['id']
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_inquiry_invalid():
    """Test POST /api/inquiries with invalid data (missing name and contact)"""
    print("\n" + "="*80)
    print("TEST 6: POST /api/inquiries - Invalid data (missing name and contact)")
    print("="*80)
    
    try:
        payload = {
            "message": "Chcem auto ale nemám meno ani kontakt"
        }
        
        print(f"Sending payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/inquiries",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        error_data = response.json()
        print(f"Error response: {json.dumps(error_data, indent=2)}")
        
        if 'error' not in error_data:
            print(f"❌ FAILED: Expected error message in response")
            return False
        
        print(f"\n✅ PASSED: POST /api/inquiries correctly rejects invalid data with 400")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_get_inquiries():
    """Test GET /api/inquiries - should return array of inquiries"""
    print("\n" + "="*80)
    print("TEST 7: GET /api/inquiries - List all inquiries")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/inquiries", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        inquiries = response.json()
        print(f"Number of inquiries returned: {len(inquiries)}")
        
        if len(inquiries) < 2:
            print(f"❌ FAILED: Expected at least 2 inquiries (from previous tests)")
            return False
        
        # Check structure of first inquiry
        if inquiries:
            first = inquiries[0]
            print(f"\nFirst inquiry sample:")
            print(f"  - id: {first.get('id', 'MISSING')}")
            print(f"  - name: {first.get('name', 'MISSING')}")
            print(f"  - type: {first.get('type', 'MISSING')}")
            
            # Check for UUID id
            if 'id' not in first:
                print(f"❌ FAILED: Missing 'id' field")
                return False
            
            # Check no _id leak
            if '_id' in first:
                print(f"❌ FAILED: MongoDB _id field is leaking")
                return False
        
        # Check all inquiries for _id leak
        for i, inq in enumerate(inquiries):
            if '_id' in inq:
                print(f"❌ FAILED: Inquiry at index {i} has _id field leaking")
                return False
        
        print(f"\n✅ PASSED: GET /api/inquiries returns inquiries with UUID ids, no _id leak")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("SICO CARS BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    
    results = {}
    
    # Test 1: GET /api/cars
    cars = test_get_cars()
    results['GET /api/cars'] = bool(cars)
    
    # Test 2: No duplication
    results['GET /api/cars (no duplication)'] = test_get_cars_no_duplicate()
    
    # Test 3: GET /api/cars/{id}
    if cars:
        results['GET /api/cars/{id}'] = test_get_single_car(cars)
    else:
        print("\n⚠️  Skipping single car test - no cars available")
        results['GET /api/cars/{id}'] = False
    
    # Test 4: POST valid car lead
    results['POST /api/inquiries (car lead)'] = bool(test_post_inquiry_valid_car_lead())
    
    # Test 5: POST valid general lead
    results['POST /api/inquiries (general lead)'] = bool(test_post_inquiry_valid_general_lead())
    
    # Test 6: POST invalid
    results['POST /api/inquiries (invalid)'] = test_post_inquiry_invalid()
    
    # Test 7: GET inquiries
    results['GET /api/inquiries'] = test_get_inquiries()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASSED" if passed_test else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
