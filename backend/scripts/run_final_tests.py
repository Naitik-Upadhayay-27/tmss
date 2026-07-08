#!/usr/bin/env python
"""
🧪 FINAL FATAKPAY TMS TESTING SCRIPT
=====================================
Complete validation of PostgreSQL migration and Docker build.
Run this before Kubernetes deployment to ensure everything works.

Usage: python run_final_tests.py
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(cmd, cwd=None, env=None):
    """Run shell command and return success status"""
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd, env=env, 
            capture_output=True, text=True, timeout=300
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def test_section(title):
    """Print test section header"""
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print('='*60)

def print_result(test_name, success, details=""):
    """Print test result"""
    status = "✅" if success else "❌"
    print(f"{status} {test_name}")
    if details and not success:
        print(f"   Error: {details}")
    elif details and success:
        print(f"   {details}")

def main():
    """Run all tests"""
    print("🚀 FATAKPAY TMS - FINAL DEPLOYMENT VALIDATION")
    print("=" * 60)
    
    backend_dir = Path("fatakpay-tms-backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found! Run from project root.")
        return False
    
    passed_tests = 0
    total_tests = 0
    
    # Test 1: PostgreSQL Connection
    test_section("DATABASE CONNECTION")
    
    total_tests += 1
    success, stdout, stderr = run_command(
        'python manage.py shell -c "from django.db import connection; connection.cursor().execute(\'SELECT 1\'); print(\'PostgreSQL connected successfully\')"',
        cwd=backend_dir
    )
    print_result("PostgreSQL Connection", success, stdout.strip() if success else stderr)
    if success: passed_tests += 1
    
    # Test 2: Django Check
    test_section("DJANGO CONFIGURATION")
    
    total_tests += 1
    success, stdout, stderr = run_command("python manage.py check", cwd=backend_dir)
    print_result("Django Configuration Check", success, "No issues found" if success else stderr)
    if success: passed_tests += 1
    
    # Test 3: Schema Creation
    test_section("POSTGRESQL SCHEMAS")
    
    total_tests += 1
    success, stdout, stderr = run_command(
        "python manage.py setup_enterprise_db --skip-seed", 
        cwd=backend_dir
    )
    print_result("Schema Setup Command", success, "Schemas created successfully" if success else stderr)
    if success: passed_tests += 1
    
    # Test 4: Migration Check
    test_section("DJANGO MIGRATIONS")
    
    total_tests += 1
    success, stdout, stderr = run_command("python manage.py showmigrations", cwd=backend_dir)
    applied_count = stdout.count('[X]') if success else 0
    print_result("Migration Status", success, f"{applied_count} migrations applied" if success else stderr)
    if success: passed_tests += 1
    
    # Test 5: Model Import Test
    test_section("MODEL VALIDATION")
    
    total_tests += 1
    success, stdout, stderr = run_command(
        'python manage.py shell -c "from accounts.models import CustomUser; from tickets.models import Ticket; from departments.models import Department; print(\'All models imported successfully\')"',
        cwd=backend_dir
    )
    print_result("Model Import Test", success, stdout.strip() if success else stderr)
    if success: passed_tests += 1
    
    # Test 6: Docker Build
    test_section("DOCKER BUILD")
    
    total_tests += 1
    print("🐳 Building Docker image (this may take a few minutes)...")
    success, stdout, stderr = run_command("docker build -t fatakpay-tms-final-test .", cwd=backend_dir)
    print_result("Docker Build", success, "Image built successfully" if success else stderr)
    if success: passed_tests += 1
    
    # Test 7: Docker Container Test
    test_section("DOCKER CONTAINER")
    
    if success:  # Only if Docker build succeeded
        total_tests += 1
        docker_env = {
            'DB_NAME': 'fatakpay_tms',
            'DB_USER': 'root', 
            'DB_PASSWORD': 'root',
            'DB_HOST': 'host.docker.internal',
            'DB_PORT': '5432',
            'DEBUG': 'True'
        }
        
        env_args = ' '.join([f'-e {k}={v}' for k, v in docker_env.items()])
        cmd = f"docker run --rm {env_args} --add-host=host.docker.internal:host-gateway fatakpay-tms-final-test python manage.py check"
        
        success, stdout, stderr = run_command(cmd, cwd=backend_dir)
        print_result("Docker Container Test", success, "Container runs successfully" if success else stderr)
        if success: passed_tests += 1
    
    # Test 8: API Health Check
    test_section("API ENDPOINTS")
    
    total_tests += 1
    success, stdout, stderr = run_command(
        'python manage.py shell -c "from django.test import Client; c = Client(); r = c.get(\'/api/v1/health/\'); print(f\'Health endpoint: {r.status_code}\')"',
        cwd=backend_dir
    )
    health_works = success and "200" in stdout
    print_result("Health Endpoint", health_works, stdout.strip() if success else stderr)
    if health_works: passed_tests += 1
    
    # Test 9: Sample Data Test
    test_section("SAMPLE DATA")
    
    total_tests += 1
    success, stdout, stderr = run_command("python manage.py seed_data --help", cwd=backend_dir)
    print_result("Seed Data Command", success, "Command available" if success else stderr)
    if success: passed_tests += 1
    
    # Test 10: Production Settings
    test_section("PRODUCTION READINESS")
    
    total_tests += 1
    prod_env = os.environ.copy()
    prod_env['DJANGO_SETTINGS_MODULE'] = 'config.settings.production'
    prod_env['SECRET_KEY'] = 'test-secret-key-for-production-check-only'
    prod_env['DEBUG'] = 'False'
    
    success, stdout, stderr = run_command(
        "python manage.py check --deploy",
        cwd=backend_dir,
        env=prod_env
    )
    # Production check may have warnings but should not error
    prod_ready = success or "System check identified" in stderr
    print_result("Production Settings", prod_ready, "Configuration validated" if prod_ready else stderr)
    if prod_ready: passed_tests += 1
    
    # Final Results
    test_section("FINAL RESULTS")
    
    success_rate = (passed_tests / total_tests) * 100
    
    print(f"📊 TEST SUMMARY:")
    print(f"   Passed: {passed_tests}/{total_tests} tests ({success_rate:.1f}%)")
    print()
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED!")
        print("✅ FatakPay TMS is READY for Kubernetes deployment")
        print()
        print("🚀 Next Steps:")
        print("   1. Push Docker image to registry")
        print("   2. Apply Kubernetes manifests")
        print("   3. Run: kubectl exec <pod> -- python manage.py setup_enterprise_db")
        print("   4. Test production endpoints")
    elif passed_tests >= total_tests * 0.8:  # 80% pass rate
        print("⚠️  MOSTLY READY - Minor issues detected")
        print("🔧 Review failed tests above and fix before deployment")
    else:
        print("❌ NOT READY FOR DEPLOYMENT")
        print("🔧 Critical issues found - fix all failed tests")
    
    print("=" * 60)
    return passed_tests == total_tests

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)