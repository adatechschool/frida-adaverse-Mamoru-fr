# Adaverse API Documentation

<details> 

<summary> Table of Contents </summary>

- [Adaverse API Documentation](#adaverse-api-documentation)
  - [📚 Overview](#-overview)
  - [🔐 Authentication](#-authentication)
    - [Required Header](#required-header)
    - [Example Request](#example-request)
    - [Authentication Errors](#authentication-errors)
  - [📡 Endpoints](#-endpoints)
    - [1. Ada Projects](#1-ada-projects)
      - [**GET** `/api/ada-project`](#get-apiada-project)
      - [**GET** `/api/ada-project/{id}`](#get-apiada-projectid)
    - [2. Ada Promotions](#2-ada-promotions)
      - [**GET** `/api/ada-promotion`](#get-apiada-promotion)
      - [**GET** `/api/ada-promotion/{id}`](#get-apiada-promotionid)
    - [3. Students](#3-students)
      - [**GET** `/api/student`](#get-apistudent)
      - [**GET** `/api/student/{id}`](#get-apistudentid)
      - [**POST** `/api/student`](#post-apistudent)
    - [4. Student Projects](#4-student-projects)
      - [**GET** `/api/student-project`](#get-apistudent-project)
    - [5. Student-To-Project Relations](#5-student-to-project-relations)
      - [**GET** `/api/student-to-project`](#get-apistudent-to-project)
      - [**GET** `/api/student-to-project/{id}`](#get-apistudent-to-projectid)
      - [**POST** `/api/student-to-project`](#post-apistudent-to-project)
  - [📋 Quick Reference](#-quick-reference)
    - [All Endpoints](#all-endpoints)
  - [🔄 HTTP Status Codes](#-http-status-codes)
  - [📝 Naming Conventions](#-naming-conventions)
    - [Request Headers](#request-headers)
    - [JSON Fields](#json-fields)
    - [URL Parameters](#url-parameters)
    - [Date/Time Format](#datetime-format)
  - [🌐 CORS Configuration](#-cors-configuration)
  - [🔍 Response Examples](#-response-examples)
    - [Successful Response](#successful-response)
    - [Error Response (No API Key)](#error-response-no-api-key)
    - [Error Response (Invalid API Key)](#error-response-invalid-api-key)
  - [🎯 Best Practices](#-best-practices)
    - [1. **Always Include API Key**](#1-always-include-api-key)
    - [2. **Handle Errors Properly**](#2-handle-errors-properly)
    - [3. **Use Environment Variables**](#3-use-environment-variables)
    - [4. **Cache Responses When Appropriate**](#4-cache-responses-when-appropriate)
  - [📊 Data Relationships](#-data-relationships)
  - [🚀 Getting Started](#-getting-started)
  - [📞 Support](#-support)

</details>


## 📚 Overview

The Adaverse API provides access to Ada Tech School student projects, promotions, and student data. All endpoints follow RESTful conventions and require authentication via API key.

**Base URL**: `http://localhost:3000` (development)

**Authentication**: All requests require an `x-api-key` header

---

## 🔐 Authentication

### Required Header

```http
x-api-key: YOUR_API_KEY
```

### Example Request

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  http://localhost:3000/api/ada-project
```

### Authentication Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | No API key provided in request |
| `403` | Forbidden | Invalid API key provided |

**Error Response Format**:
```json
{
  "error": "Unauthorized",
  "message": "API key is required. Please provide x-api-key header."
}
```

---

## 📡 Endpoints

### 1. Ada Projects

Manage Ada project categories (e.g., "Pico-8", "Dataviz", "Extension Navigateur").

#### **GET** `/api/ada-project`

**Description**: Fetch all Ada project types/categories

**Authentication**: Required

**Request**:
```http
GET /api/ada-project HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "projectName": "Pico-8",
    "description": "Créer un jeu vidéo rétro avec Pico-8"
  },
  {
    "id": 2,
    "projectName": "Dataviz",
    "description": "Visualisation de données interactive"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique project category ID |
| `projectName` | string | Name of the project category |
| `description` | string | Project category description |

---

#### **GET** `/api/ada-project/{id}`

**Description**: Fetch a single Ada project category by ID

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Ada project category ID |

**Request**:
```http
GET /api/ada-project/1 HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "projectName": "Pico-8",
    "description": "Créer un jeu vidéo rétro avec Pico-8"
  }
]
```

**Response Fields**: Same as `GET /api/ada-project`

---

### 2. Ada Promotions

Manage Ada promotion/cohort data (year groups).

#### **GET** `/api/ada-promotion`

**Description**: Fetch all Ada promotions ordered by start date

**Authentication**: Required

**Request**:
```http
GET /api/ada-promotion HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "promotionName": "Ada 2023",
    "startDate": "2023-09-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "promotionName": "Ada 2024",
    "startDate": "2024-09-01T00:00:00.000Z"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique promotion ID |
| `promotionName` | string | Name of the promotion/cohort |
| `startDate` | string (ISO 8601) | Promotion start date |

---

#### **GET** `/api/ada-promotion/{id}`

**Description**: Fetch a single Ada promotion by ID

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Ada promotion ID |

**Request**:
```http
GET /api/ada-promotion/1 HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "promotionName": "Ada 2023",
    "startDate": "2023-09-01T00:00:00.000Z"
  }
]
```

**Response Fields**: Same as `GET /api/ada-promotion`

---

### 3. Students

Manage student data.

#### **GET** `/api/student`

**Description**: Fetch all students with their GitHub information

**Authentication**: Required

**Request**:
```http
GET /api/student HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Alice Dupont",
    "githubUsername": "alice-dev",
    "promotionId": 1
  },
  {
    "id": 2,
    "name": "Bob Martin",
    "githubUsername": "bob-codes",
    "promotionId": 1
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique student ID |
| `name` | string | Student's full name |
| `githubUsername` | string | GitHub username |
| `promotionId` | integer | Foreign key to promotion |

---

#### **GET** `/api/student/{id}`

**Description**: Fetch a single student by ID

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Student ID |

**Request**:
```http
GET /api/student/1 HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Alice Dupont",
    "githubUsername": "alice-dev",
    "promotionId": 1
  }
]
```

**Response Fields**: Same as `GET /api/student`

---

#### **POST** `/api/student`

**Description**: Create a new student

**Authentication**: Required

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Student's full name |
| `githubUsername` | string | Yes | GitHub username (must be unique) |
| `promotionId` | integer | Yes | ID of the promotion the student belongs to |

**Request**:
```http
POST /api/student HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "name": "Charlie Dubois",
  "githubUsername": "charlie-dev",
  "promotionId": 2
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "student": {
    "name": "Charlie Dubois",
    "githubUsername": "charlie-dev",
    "promotionId": 2
  },
  "message": "Student 'Charlie Dubois' has been created."
}
```

**Response** `409 Conflict` (if student already exists):
```json
{
  "success": false,
  "message": "Student 'Charlie Dubois' or GitHub username 'charlie-dev' already exists."
}
```

---

### 4. Student Projects

Get all student projects with associated students (complete project data).

#### **GET** `/api/student-project`

**Description**: Fetch all student projects with their assigned students, images, and URLs

**Authentication**: Required

**Request**:
```http
GET /api/student-project HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "title": "Mon Super Jeu Pico-8",
    "image": "/images/pico8-game.png",
    "students": [
      {
        "id": 1,
        "name": "Alice Dupont",
        "githubUsername": "alice-dev",
        "promotionId": 1
      }
    ],
    "URLName": "mon-super-jeu-pico8",
    "adaProjectID": 1,
    "githubRepoURL": "https://github.com/alice-dev/pico8-game",
    "demoURL": "https://alice-dev.github.io/pico8-game",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "publishedAt": "2024-01-20T14:30:00.000Z"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique project ID |
| `title` | string | Project title |
| `image` | string | Path to project image/thumbnail |
| `students` | array | Array of student objects assigned to this project |
| `URLName` | string | URL-friendly project name (slug) |
| `adaProjectID` | integer | Foreign key to Ada project category |
| `githubRepoURL` | string | GitHub repository URL |
| `demoURL` | string \| null | Live demo URL (if available) |
| `createdAt` | string (ISO 8601) | Project creation timestamp |
| `publishedAt` | string (ISO 8601) \| null | Publication timestamp (if published) |

**Student Object**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Student ID |
| `name` | string | Student name |
| `githubUsername` | string | GitHub username |
| `promotionId` | integer | Promotion ID |

---

### 5. Student-To-Project Relations

Manage the many-to-many relationship between students and projects.

#### **GET** `/api/student-to-project`

**Description**: Fetch all student-to-project relationships

**Authentication**: Required

**Request**:
```http
GET /api/student-to-project HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "studentId": 1,
    "projectStudentId": 1
  },
  {
    "id": 2,
    "studentId": 2,
    "projectStudentId": 1
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique relation ID |
| `studentId` | integer | Foreign key to student |
| `projectStudentId` | integer | Foreign key to project |

---

#### **GET** `/api/student-to-project/{id}`

**Description**: Fetch a single student-to-project relationship by ID

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Relationship ID |

**Request**:
```http
GET /api/student-to-project/1 HTTP/1.1
Host: localhost:3000
x-api-key: YOUR_API_KEY
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "studentId": 1,
    "projectStudentId": 1
  }
]
```

**Response Fields**: Same as `GET /api/student-to-project`

---

#### **POST** `/api/student-to-project`

**Description**: Create a new student-to-project relationship (assign a student to a project)

**Authentication**: Required

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentId` | integer | Yes | ID of the student to assign |
| `projectStudentId` | integer | Yes | ID of the project to assign the student to |

**Request**:
```http
POST /api/student-to-project HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "studentId": 3,
  "projectStudentId": 2
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "StudentToProject": {
    "studentId": 3,
    "projectStudentId": 2
  },
  "message": "Student to project relation has been created."
}
```

**Response** `409 Conflict` (if relationship already exists):
```json
{
  "success": false,
  "message": "Student to project relation already exists."
}
```
---

## 📋 Quick Reference

### All Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/ada-project` | Get all Ada project categories | ✅ Yes |
| `GET` | `/api/ada-project/{id}` | Get single Ada project category by ID | ✅ Yes |
| `GET` | `/api/ada-promotion` | Get all promotions | ✅ Yes |
| `GET` | `/api/ada-promotion/{id}` | Get single promotion by ID | ✅ Yes |
| `GET` | `/api/student` | Get all students | ✅ Yes |
| `GET` | `/api/student/{id}` | Get single student by ID | ✅ Yes |
| `POST` | `/api/student` | Create a new student | ✅ Yes |
| `GET` | `/api/student-project` | Get all student projects with students | ✅ Yes |
| `GET` | `/api/student-to-project` | Get all student-to-project relations | ✅ Yes |
| `GET` | `/api/student-to-project/{id}` | Get single relation by ID | ✅ Yes |
| `POST` | `/api/student-to-project` | Create student-to-project relation | ✅ Yes |

---

## 🔄 HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `401` | Unauthorized | Missing API key |
| `403` | Forbidden | Invalid API key |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists (duplicate) |
| `500` | Internal Server Error | Server error |

---

## 📝 Naming Conventions

### Request Headers
- **Format**: `kebab-case`
- **Example**: `x-api-key`, `content-type`

### JSON Fields
- **Format**: `camelCase`
- **Example**: `projectName`, `githubUsername`, `adaProjectID`

### URL Parameters
- **Format**: `kebab-case`
- **Example**: `/api/ada-project`, `/api/student-project`

### Date/Time Format
- **Format**: ISO 8601
- **Example**: `2024-01-15T10:00:00.000Z`
- **Timezone**: UTC

---

## 🌐 CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, x-api-key
```

**Note**: Preflight `OPTIONS` requests are automatically handled.

---

## 🔍 Response Examples

### Successful Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "projectName": "Pico-8"
  }
]
```

### Error Response (No API Key)

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Unauthorized",
  "message": "API key is required. Please provide x-api-key header."
}
```

### Error Response (Invalid API Key)

```json
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden",
  "message": "Invalid API key provided."
}
```

---

## 🎯 Best Practices

### 1. **Always Include API Key**
```javascript
// ✅ Good
fetch('/api/ada-project', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
})

// ❌ Bad - Will return 401 error
fetch('/api/ada-project')
```

### 2. **Handle Errors Properly**
```javascript
try {
  const response = await fetch('/api/student-project', {
    headers: { 'x-api-key': 'YOUR_API_KEY' }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### 3. **Use Environment Variables**
```javascript
// Store API key in environment variables
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

fetch('/api/ada-project', {
  headers: { 'x-api-key': API_KEY }
})
```

### 4. **Cache Responses When Appropriate**
```javascript
// Cache API responses to reduce requests
const cache = new Map();

async function getCachedData(endpoint) {
  if (cache.has(endpoint)) {
    return cache.get(endpoint);
  }
  
  const response = await fetch(endpoint, {
    headers: { 'x-api-key': 'YOUR_API_KEY' }
  });
  
  const data = await response.json();
  cache.set(endpoint, data);
  return data;
}
```

---

## 📊 Data Relationships

```
AdaPromotion (1) ──< (N) Student
      │
      │ promotionId
      │
      └──< (N) Student (1) ──< (N) StudentToProject >──< (N) Project (1) ──> (1) AdaProject
                                                                    │
                                                                    │ adaProjectID
                                                                    │
```

**Relationships**:
- One `AdaPromotion` has many `Students`
- One `AdaProject` category has many `Projects`
- One `Project` can have many `Students` (many-to-many)
- One `Student` can have many `Projects` (many-to-many)

---

## 🚀 Getting Started

1. **Obtain API Key**: Contact the administrator for your API key
2. **Set Environment Variable**: Store your key securely
   ```bash
   export API_KEY="your-api-key-here"
   ```
3. **Make Your First Request**:
   ```bash
   curl -H "x-api-key: $API_KEY" http://localhost:3000/api/ada-project
   ```
4. **Integrate Into Your Application**: Use the examples above

---

## 📞 Support

For API issues or questions, contact the Adaverse development team.

**Version**: 1.0.0  
**Last Updated**: November 26, 2025
