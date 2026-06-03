# API Documentation

## Endpoint: POST /predict

### Request Body
```json
{
  "food_name": "string",
  "quantity": "number (gram)",
  "age": "number",
  "condition": "string" // "anak" or "ibu hamil"
}
```

### Response
```json
{
  "risk_level": "string", // "Low", "Medium", "High"
  "score": "number", // 0.0 - 1.0
  "suggestion": "string"
}
```

## Development Notes

- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:8000
- CORS enabled for frontend-backend communication