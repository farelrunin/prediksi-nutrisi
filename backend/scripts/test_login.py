import requests
import json

try:
    print("Testing connection to http://localhost:8000/auth/login...")
    response = requests.post(
        "http://localhost:8000/auth/login",
        json={"email": "test@example.com", "password": "password123"},
        timeout=5
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Connection failed: {e}")
