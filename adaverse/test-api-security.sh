#!/bin/bash

# Test API Security - Run this script to test your API authentication

BASE_URL="http://localhost:3000"
API_KEY="96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae"

echo "🧪 Testing API Security..."
echo "=========================="
echo ""

# Test 1: Valid API Key
echo "✅ Test 1: Valid API Key (Should succeed)"
echo "Request: GET /api/ada-project with valid API key"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "x-api-key: $API_KEY" \
  "$BASE_URL/api/ada-project" | head -n 20
echo ""
echo "---"
echo ""

# Test 2: No API Key
echo "❌ Test 2: No API Key (Should fail with 401)"
echo "Request: GET /api/ada-project without API key"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  "$BASE_URL/api/ada-project"
echo ""
echo "---"
echo ""

# Test 3: Invalid API Key
echo "❌ Test 3: Invalid API Key (Should fail with 403)"
echo "Request: GET /api/ada-project with wrong API key"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "x-api-key: invalid-key-12345" \
  "$BASE_URL/api/ada-project"
echo ""
echo "---"
echo ""

# Test 4: Test all endpoints
echo "✅ Test 4: All Endpoints with Valid Key"
echo ""

endpoints=(
  "/api/ada-project"
  "/api/ada-promotion"
  "/api/student"
  "/api/student-project"
)

for endpoint in "${endpoints[@]}"; do
  echo "Testing: $endpoint"
  status=$(curl -s -o /dev/null -w "%{http_code}" -H "x-api-key: $API_KEY" "$BASE_URL$endpoint")
  if [ "$status" -eq 200 ]; then
    echo "  ✅ Status: $status (Success)"
  else
    echo "  ❌ Status: $status (Failed)"
  fi
done

echo ""
echo "=========================="
echo "🎉 Testing Complete!"
