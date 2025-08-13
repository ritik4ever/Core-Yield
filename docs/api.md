# API Documentation

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header.

### POST /api/auth/nonce
Generate nonce for wallet signature.

**Request:**
```json
{
  "address": "0x742d35Cc6644C102532321c3b8a9C6F"
}