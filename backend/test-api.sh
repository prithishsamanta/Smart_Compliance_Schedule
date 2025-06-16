#!/bin/bash

echo "🚀 Testing Smart Compliance Schedule API"
echo "========================================"

# Check if application is running
echo "1. Checking if application is running..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Application is running on port 8080"
else
    echo "❌ Application is not running. Please start it with: ./mvnw spring-boot:run"
    exit 1
fi

echo ""
echo "2. Testing OpenAI Task Creation Endpoint..."
echo "Request: POST /api/ai/create-task"
echo "Body: 'Schedule a meeting with john@example.com tomorrow at 2 PM about project review'"
echo ""

# Test the OpenAI endpoint
response=$(curl -s -X POST http://localhost:8080/api/ai/create-task \
  -H "Content-Type: application/json" \
  -d "Schedule a meeting with john@example.com tomorrow at 2 PM about project review" \
  -w "HTTP_CODE:%{http_code}")

http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
response_body=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')

echo "Response Code: $http_code"
echo "Response Body:"
echo "$response_body" | jq . 2>/dev/null || echo "$response_body"

if [ "$http_code" = "200" ]; then
    echo ""
    echo "✅ API test successful!"
else
    echo ""
    echo "❌ API test failed with HTTP code: $http_code"
fi

echo ""
echo "�� Test completed!" 