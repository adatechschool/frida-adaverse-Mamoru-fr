# API Security Documentation

<details>

<summary>Table of contents</summary>

- [API Security Documentation](#api-security-documentation)
  - [🔐 Overview](#-overview)
  - [🔑 API Keys](#-api-keys)
    - [1. **API\_SECRET\_KEY** (Server-side only)](#1-api_secret_key-server-side-only)
    - [2. **NEXT\_PUBLIC\_API\_KEY** (Client-side)](#2-next_public_api_key-client-side)
  - [📡 How It Works](#-how-it-works)
    - [**Protected API Routes**](#protected-api-routes)
    - [**Request Flow**](#request-flow)
    - [**Example Request**](#example-request)
  - [✅ Already Implemented](#-already-implemented)
  - [🧪 Testing](#-testing)
    - [**Test 1: Valid API Key (Should Work)**](#test-1-valid-api-key-should-work)
    - [**Test 2: No API Key (Should Fail)**](#test-2-no-api-key-should-fail)
    - [**Test 3: Invalid API Key (Should Fail)**](#test-3-invalid-api-key-should-fail)
  - [🚀 Using the API Externally](#-using-the-api-externally)
    - [**JavaScript/Fetch**](#javascriptfetch)
    - [**Python**](#python)
    - [**cURL**](#curl)
  - [🔒 Security Levels](#-security-levels)
    - [**Current Setup: Medium Security**](#current-setup-medium-security)
    - [**For Production: High Security**](#for-production-high-security)
  - [🛡️ What's Protected](#️-whats-protected)
  - [⚠️ Important Notes](#️-important-notes)
  - [🔄 Rotating API Keys](#-rotating-api-keys)

</details>

## 🔐 Overview

Your Adaverse API is now protected with **API Key Authentication**. All API requests must include a valid API key in the request headers, or they will be rejected with a `401 Unauthorized` or `403 Forbidden` error.

## 🔑 API Keys

Your API uses two keys stored in `.env`:

### 1. **API_SECRET_KEY** (Server-side only)
- **Value**: `96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae`
- **Usage**: Validated by the API routes
- **Security**: ⚠️ **NEVER share this or commit to git!**
- **Location**: Only in `.env` (not accessible from browser)

### 2. **NEXT_PUBLIC_API_KEY** (Client-side)
- **Value**: `96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae`
- **Usage**: Used by your React app to authenticate requests
- **Security**: ⚠️ **Visible in browser** - only use for internal app
- **Location**: `.env` but accessible via `process.env.NEXT_PUBLIC_API_KEY`

## 📡 How It Works

### **Protected API Routes**
All these routes now require authentication:
- `GET /api/ada-project`
- `GET /api/ada-promotion`
- `GET /api/student`
- `GET /api/student-project`

### **Request Flow**
```
1. Client sends request with header: x-api-key: YOUR_KEY
2. API middleware checks if key matches API_SECRET_KEY
3. If valid ✅ → Return data
   If invalid ❌ → Return 401/403 error
```

### **Example Request**
```javascript
fetch('/api/ada-project', {
  headers: {
    'x-api-key': 'YOUR_API_KEY_HERE'
  }
})
```

## ✅ Already Implemented

Your app automatically sends the API key! The following files have been updated:

- ✅ `context/AdaProjectsContext.tsx` - Sends API key
- ✅ `context/AdaPromotionsContext.tsx` - Sends API key
- ✅ `context/StudentsContext.tsx` - Sends API key
- ✅ `app/page.tsx` - Sends API key for student-project

## 🧪 Testing

### **Test 1: Valid API Key (Should Work)**
```bash
curl http://localhost:3000/api/ada-project \
  -H "x-api-key: 96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae"
```
Expected: ✅ Returns project data

### **Test 2: No API Key (Should Fail)**
```bash
curl http://localhost:3000/api/ada-project
```
Expected: ❌ `401 Unauthorized - API key is required`

### **Test 3: Invalid API Key (Should Fail)**
```bash
curl http://localhost:3000/api/ada-project \
  -H "x-api-key: wrong-key-12345"
```
Expected: ❌ `403 Forbidden - Invalid API key`

## 🚀 Using the API Externally

If you want to call your API from outside the app (e.g., Postman, another website):

### **JavaScript/Fetch**
```javascript
fetch('http://192.168.7.103:3000/api/student-project', {
  headers: {
    'x-api-key': '96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### **Python**
```python
import requests

headers = {
    'x-api-key': '96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae'
}

response = requests.get('http://192.168.7.103:3000/api/ada-project', headers=headers)
print(response.json())
```

### **cURL**
```bash
curl -H "x-api-key: 96de59848dff86878c3cb99d9925b342ce409bdbf4f939abd603273099d2e7ae" \
  http://192.168.7.103:3000/api/student-project
```

## 🔒 Security Levels

### **Current Setup: Medium Security**
- ✅ Prevents unauthorized access
- ✅ API key required for all requests
- ⚠️ API key visible in browser (NEXT_PUBLIC_API_KEY)
- ⚠️ Anyone with the key can access the API

### **For Production: High Security**
1. **Use different keys for different environments**:
   ```env
   # .env.local (development)
   API_SECRET_KEY="dev-key-12345"
   
   # .env.production (production)
   API_SECRET_KEY="prod-key-67890-super-secret"
   ```

2. **Add rate limiting** (prevent spam):
   ```typescript
   // Track requests per IP
   const requestCounts = new Map();
   
   // Max 100 requests per minute
   if (requestCounts.get(ip) > 100) {
     return error('Too many requests');
   }
   ```

3. **Whitelist specific origins**:
   ```typescript
   const allowedOrigins = ['https://adaverse.com'];
   if (!allowedOrigins.includes(origin)) {
     return error('Origin not allowed');
   }
   ```

## 🛡️ What's Protected

| Route | Protected | Method | Required Header |
|-------|-----------|--------|----------------|
| `/api/ada-project` | ✅ Yes | GET | `x-api-key` |
| `/api/ada-promotion` | ✅ Yes | GET | `x-api-key` |
| `/api/student` | ✅ Yes | GET | `x-api-key` |
| `/api/student-project` | ✅ Yes | GET | `x-api-key` |

## ⚠️ Important Notes

1. **Never commit `.env` to git** - Add to `.gitignore`
2. **API key is visible in browser** - Don't use for highly sensitive data
3. **Change the key regularly** - Generate new keys for production
4. **Keep a backup** - Store the key securely (password manager)

## 🔄 Rotating API Keys

To generate a new API key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update both keys in `.env`:
```env
API_SECRET_KEY="NEW_KEY_HERE"
NEXT_PUBLIC_API_KEY="NEW_KEY_HERE"
```

Restart your server:
```bash
npm run dev
```

---

**Your API is now secured! 🎉**
