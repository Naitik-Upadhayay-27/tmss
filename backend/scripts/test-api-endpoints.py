#!/usr/bin/env python
"""
FatakPay TMS Backend — API Endpoint Testing Script
==================================================
Comprehensive test of all API endpoints to verify functionality.

Usage:
  python test-api-endpoints.py [--host HOST] [--verbose]
  
Examples:
  python test-api-endpoints.py --host https://api.yourdomain.com
  python test-api-endpoints.py --host http://localhost:8000 --verbose
"""

import argparse
import json
import requests
import sys
import time
from datetime import datetime

class APITester:
    def __init__(self, base_url, verbose=False):
        self.base_url = base_url.rstrip('/')
        self.verbose = verbose
        self.session = requests.Session()
        self.access_token = None
        self.test_results = []
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        if level == "ERROR":
            print(f"[{timestamp}] ❌ {message}")
        elif level == "SUCCESS":
            print(f"[{timestamp}] ✅ {message}")
        elif level == "WARN":
            print(f"[{timestamp}] ⚠️  {message}")
        else:
            if self.verbose:
                print(f"[{timestamp}] ℹ️  {message}")
    
    def test_endpoint(self, method, endpoint, data=None, files=None, expected_status=200, auth_required=True):
        """Test a single API endpoint"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers)
            elif method.upper() == 'POST':
                if files:
                    # Remove Content-Type for file uploads
                    headers.pop('Content-Type', None)
                    response = self.session.post(url, headers=headers, files=files)
                else:
                    response = self.session.post(url, headers=headers, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, headers=headers, json=data)
            elif method.upper() == 'PATCH':
                response = self.session.patch(url, headers=headers, json=data)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                self.log(f"Unsupported method: {method}", "ERROR")
                return False
                
            success = response.status_code == expected_status
            result = {
                'endpoint': endpoint,
                'method': method.upper(),
                'status_code': response.status_code,
                'expected_status': expected_status,
                'success': success,
                'response_time': response.elapsed.total_seconds()
            }
            
            if success:
                self.log(f"{method.upper()} {endpoint} - {response.status_code} ({response.elapsed.total_seconds():.2f}s)", "SUCCESS")
            else:
                self.log(f"{method.upper()} {endpoint} - Expected {expected_status}, got {response.status_code}", "ERROR")
                if self.verbose:
                    self.log(f"Response: {response.text[:200]}...")
            
            self.test_results.append(result)
            return success, response
            
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed for {endpoint}: {e}", "ERROR")
            self.test_results.append({
                'endpoint': endpoint,
                'method': method.upper(),
                'success': False,
                'error': str(e)
            })
            return False, None
    
    def authenticate(self):
        """Authenticate and get access token"""
        self.log("Authenticating with test credentials...")
        
        # Try default admin credentials
        auth_data = {
            "email": "admin@fatakpay.com",
            "password": "Admin@1234"
        }
        
        success, response = self.test_endpoint('POST', '/api/v1/auth/login/', 
                                             data=auth_data, auth_required=False)
        
        if success and response:
            try:
                data = response.json()
                self.access_token = data.get('access')
                if self.access_token:
                    self.log("Authentication successful", "SUCCESS")
                    return True
                else:
                    self.log("No access token in response", "ERROR")
                    return False
            except json.JSONDecodeError:
                self.log("Invalid JSON in auth response", "ERROR")
                return False
        
        self.log("Authentication failed - testing with sample credentials", "WARN")
        return False
    
    def test_health_endpoints(self):
        """Test health and status endpoints"""
        self.log("\n=== Testing Health Endpoints ===")
        
        # Health check (no auth required)
        self.test_endpoint('GET', '/api/v1/health/', auth_required=False)
        
        # Try alternative health endpoints
        self.test_endpoint('GET', '/health/', auth_required=False, expected_status=404)
        self.test_endpoint('GET', '/ping/', auth_required=False, expected_status=404)
    
    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        self.log("\n=== Testing Authentication Endpoints ===")
        
        # Login (already tested in authenticate())
        
        # Try invalid login
        self.test_endpoint('POST', '/api/v1/auth/login/', 
                          data={"email": "invalid@test.com", "password": "wrong"}, 
                          auth_required=False, expected_status=400)
        
        # Refresh token (if we have one)
        if self.access_token:
            # This will likely fail without a refresh token, but we test the endpoint
            self.test_endpoint('POST', '/api/v1/auth/refresh/', 
                              data={"refresh": "invalid_token"}, 
                              auth_required=False, expected_status=401)
    
    def test_user_endpoints(self):
        """Test user-related endpoints"""
        self.log("\n=== Testing User Endpoints ===")
        
        # List users
        self.test_endpoint('GET', '/api/v1/users/')
        
        # Current user
        self.test_endpoint('GET', '/api/v1/users/me/')
        
        # User details (try user ID 1)
        self.test_endpoint('GET', '/api/v1/users/1/')
    
    def test_department_endpoints(self):
        """Test department endpoints"""
        self.log("\n=== Testing Department Endpoints ===")
        
        # List departments
        self.test_endpoint('GET', '/api/v1/departments/')
        
        # Department details (try department ID 1)
        self.test_endpoint('GET', '/api/v1/departments/1/')
    
    def test_ticket_endpoints(self):
        """Test ticket endpoints"""
        self.log("\n=== Testing Ticket Endpoints ===")
        
        # List tickets
        success, response = self.test_endpoint('GET', '/api/v1/tickets/')
        
        # Try to get first ticket ID for further testing
        ticket_id = None
        if success and response:
            try:
                data = response.json()
                results = data.get('results', [])
                if results:
                    ticket_id = results[0]['id']
            except:
                pass
        
        if ticket_id:
            # Get ticket details
            self.test_endpoint('GET', f'/api/v1/tickets/{ticket_id}/')
            
            # Test ticket comments
            self.test_endpoint('GET', f'/api/v1/tickets/{ticket_id}/comments/')
            
            # Test ticket attachments
            self.test_endpoint('GET', f'/api/v1/tickets/{ticket_id}/attachments/')
        
        # Create new ticket (may fail due to permissions)
        new_ticket_data = {
            "subject": "API Test Ticket",
            "description": "This is a test ticket created by the API test script",
            "priority": "medium",
            "ticket_type": "internal",
            "department": 1
        }
        self.test_endpoint('POST', '/api/v1/tickets/', data=new_ticket_data, expected_status=201)
    
    def test_notification_endpoints(self):
        """Test notification endpoints"""
        self.log("\n=== Testing Notification Endpoints ===")
        
        # List notifications
        self.test_endpoint('GET', '/api/v1/notifications/')
    
    def test_ai_endpoints(self):
        """Test AI engine endpoints"""
        self.log("\n=== Testing AI Engine Endpoints ===")
        
        # AI health check
        self.test_endpoint('GET', '/api/v1/ai/health/', auth_required=False)
        
        # AI usage stats
        self.test_endpoint('GET', '/api/v1/ai/usage/')
        
        # AI chat (may fail if no AI service configured)
        chat_data = {
            "message": "Hello, this is a test message",
            "context": {"department": "IT"}
        }
        self.test_endpoint('POST', '/api/v1/ai/chat/', data=chat_data, expected_status=200)
    
    def test_report_endpoints(self):
        """Test reporting endpoints"""
        self.log("\n=== Testing Report Endpoints ===")
        
        # Ticket statistics
        self.test_endpoint('GET', '/api/v1/reports/stats/')
        
        # SLA report
        self.test_endpoint('GET', '/api/v1/reports/sla/')
        
        # Agent performance
        self.test_endpoint('GET', '/api/v1/reports/performance/')
    
    def test_api_schema(self):
        """Test API documentation endpoints"""
        self.log("\n=== Testing API Documentation ===")
        
        # OpenAPI schema
        self.test_endpoint('GET', '/api/v1/schema/', auth_required=False)
        
        # Interactive docs
        self.test_endpoint('GET', '/api/v1/docs/', auth_required=False)
    
    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🧪 FatakPay TMS Backend API Test Suite")
        print("=" * 50)
        print(f"Target: {self.base_url}")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test health first (no auth required)
        self.test_health_endpoints()
        
        # Authenticate
        auth_success = self.authenticate()
        
        # Run authenticated tests
        if auth_success:
            self.test_user_endpoints()
            self.test_department_endpoints()
            self.test_ticket_endpoints()
            self.test_notification_endpoints()
            self.test_report_endpoints()
        else:
            self.log("Skipping authenticated tests due to authentication failure", "WARN")
        
        # Test other endpoints
        self.test_auth_endpoints()
        self.test_ai_endpoints()
        self.test_api_schema()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result.get('success', False))
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result.get('success', False):
                    endpoint = result.get('endpoint', 'Unknown')
                    method = result.get('method', 'Unknown')
                    status = result.get('status_code', 'Error')
                    expected = result.get('expected_status', 'N/A')
                    print(f"   {method} {endpoint} - {status} (expected {expected})")
        
        # Performance stats
        response_times = [r.get('response_time', 0) for r in self.test_results if r.get('response_time')]
        if response_times:
            avg_time = sum(response_times) / len(response_times)
            max_time = max(response_times)
            print(f"\n⚡ Performance:")
            print(f"   Average Response Time: {avg_time:.2f}s")
            print(f"   Slowest Response: {max_time:.2f}s")
        
        print("\n" + "=" * 50)
        
        if passed_tests == total_tests:
            print("🎉 All tests passed! API is functioning correctly.")
            return True
        elif passed_tests >= total_tests * 0.8:
            print("⚠️  Most tests passed. Review failed tests above.")
            return True
        else:
            print("❌ Multiple test failures. API may have issues.")
            return False

def main():
    parser = argparse.ArgumentParser(description='Test FatakPay TMS Backend API endpoints')
    parser.add_argument('--host', default='http://localhost:8000', 
                       help='API base URL (default: http://localhost:8000)')
    parser.add_argument('--verbose', action='store_true', 
                       help='Enable verbose logging')
    
    args = parser.parse_args()
    
    tester = APITester(args.host, args.verbose)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()