# Wallet Management System

A complete production-ready backend for a Wallet Management System built with Spring Boot, Spring Security, JWT Authentication, and PostgreSQL.

## Tech Stack

- **Java 21** (Compatible with Java 25)
- **Spring Boot 3.5.14**
- **Spring Security**
- **JWT Authentication (JJWT 0.12.6)**
- **Spring Data JPA**
- **PostgreSQL**
- **Gradle**
- **Lombok**
- **Jakarta Validation API**

## Project Structure

```
src/main/java/com/walletsystem/wallet_management_system/
├── config/              # Security & application configuration
├── exception/           # Global exception handling
├── security/            # JWT filters and utilities
├── auth/                # Authentication module
├── user/                # User management module
├── group/               # Role-based groups (RBAC)
├── permission/          # Permissions management
├── account/             # Wallet account management
├── accounttype/         # Account types
└── currency/            # Currency definitions
```

## Prerequisites

- Java 21 or higher
- PostgreSQL 12 or higher
- Gradle 8.x

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE wallet_management_system;
\q
```

Alternatively, run the provided schema script:

```bash
psql -U postgres -f src/main/resources/db/schema.sql
```

### 2. Configuration

Update database credentials in `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wallet_db
    username: postgres
    password: your_password
```

### 3. Build the Project

```bash
.\gradlew.bat clean build
```

### 4. Run the Application

```bash
./gradlew.bat bootRun
```

The application will start on `http://localhost:8080`

## Default Data

On first startup, the application automatically initializes:

**Currencies**: INR, USD, EUR, GBP

**Account Types**: savings, business, current, wallet

**Permissions**: READ, WRITE, DELETE, ADMIN

**Groups**: 
- ADMIN (all permissions)
- USER (READ permission only)

## API Documentation

**Base URL**: `http://localhost:8080`

### Authentication Headers
All protected endpoints require the following header:
```
Authorization: Bearer {jwt_token}
```

---

### 1. Authentication APIs

#### 1.1 User Signup
Register a new user account.

**Endpoint**: `POST /api/auth/signup`

**Access**: Public (No authentication required)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "groupId": 2
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | String | Yes | Not blank | User's full name |
| email | String | Yes | Valid email | User's email address |
| password | String | Yes | Not blank | User's password (min 6 chars) |
| groupId | Long | No | - | Role/group ID (default: USER) |

**Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses**:
- `400 Bad Request` - Validation errors (invalid email, missing fields)
- `409 Conflict` - Email already exists

---

#### 1.2 User Login
Authenticate user and receive JWT token.

**Endpoint**: `POST /api/auth/login`

**Access**: Public (No authentication required)

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| email | String | Yes | Valid email | User's email address |
| password | String | Yes | Not blank | User's password |

**Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses**:
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Invalid credentials

---

#### 1.3 User Logout
Logout user (client-side token removal).

**Endpoint**: `POST /api/auth/logout`

**Access**: Public (Optional authentication)

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**: None

**Success Response (200 OK)**:
```json
{
  "message": "Logout successful"
}
```

---

### 2. User Management APIs

#### 2.1 Get All Users
Retrieve a list of all users.

**Endpoint**: `GET /api/users`

**Access**: Authenticated (READ or ADMIN permission)

**Request**: No body required

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "groupName": "ADMIN"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "groupName": "USER"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | User ID |
| name | String | User's full name |
| email | String | User's email address |
| groupName | String | Assigned group/role name |

---

#### 2.2 Get User by ID
Retrieve a specific user by ID.

**Endpoint**: `GET /api/users/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | User ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "groupName": "ADMIN"
}
```

**Error Responses**:
- `404 Not Found` - User not found

---

#### 2.3 Create User
Create a new user account.

**Endpoint**: `POST /api/users`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "groupId": 2
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | String | Yes | Not blank | User's full name |
| email | String | Yes | Valid email | User's email address |
| password | String | Yes | Not blank | User's password |
| groupId | Long | No | - | Role/group ID |

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "groupName": "USER"
}
```

---ane Updated",
  "email": "jane.updated@example.com",
  "password": "newSecurePassword456",
  "groupId": 1
}
```

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "name": "Jane Updated",
  "email": "jane.updated@example.com",
  "groupName": "ADMIN"
}
```

---

#### 2.5 Delete User
Delete a user account.

**Endpoint**: `DELETE /api/users/{id}`

**Access**: Authenticated (ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | User ID to delete |

**Success Response (204 No Content)**: No body

**Error Responses**:
- `404 Not Found` - User not found

---

### 3. Account (Wallet) APIs

#### 3.1 Get All Accounts
Retrieve all wallet accounts.

**Endpoint**: `GET /api/accounts`

**Access**: Authenticated (READ or ADMIN permission)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "accountTypeName": "savings",
    "currencyCode": "USD",
    "balance": 5000.00
  },
  {
    "id": 2,
    "userId": 1,
    "accountTypeName": "business",
    "currencyCode": "INR",
    "balance": 100000.00
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Account ID |
| userId | Long | Owner user ID |
| accountTypeName | String | Type of account (savings, business, etc.) |
| currencyCode | String | Currency code (USD, INR, etc.) |
| balance | BigDecimal | Current account balance |

---

#### 3.2 Get Accounts by User ID
Retrieve all accounts for a specific user.

**Endpoint**: `GET /api/accounts/user/{userId}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | Long | Yes | User ID |

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "accountTypeName": "savings",
    "currencyCode": "USD",
    "balance": 5000.00
  }
]
```

---

#### 3.3 Get Account by ID
Retrieve a specific account by ID.

**Endpoint**: `GET /api/accounts/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Account ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "userId": 1,
  "accountTypeName": "savings",
  "currencyCode": "USD",
  "balance": 5000.00
}
```

**Error Responses**:
- `404 Not Found` - Account not found

---

#### 3.4 Create Account
Create a new wallet account.

**Endpoint**: `POST /api/accounts`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "userId": 1,
  "accountTypeId": 1,
  "currencyId": 1,
  "balance": 1000.00
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| userId | Long | Yes | Not null | Owner user ID |
| accountTypeId | Long | Yes | Not null | Account type ID |
| currencyId | Long | Yes | Not null | Currency ID |
| balance | BigDecimal | No | >= 0 | Initial balance (default: 0) |

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "userId": 1,
  "accountTypeName": "savings",
  "currencyCode": "USD",
  "balance": 1000.00
}
```

---

#### 3.5 Update Account
Update an existing account.

**Endpoint**: `PUT /api/accounts/{id}`

**Access**: Authenticated (WRITE or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Account ID to update |

**Request Body**:
```json
{
  "userId": 1,
  "accountTypeId": 2,
  "currencyId": 2,
  "balance": 5000.00
}
```

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "userId": 1,
  "accountTypeName": "business",
  "currencyCode": "INR",
  "balance": 5000.00
}
```

---

#### 3.6 Delete Account
Delete a wallet account.

**Endpoint**: `DELETE /api/accounts/{id}`

**Access**: Authenticated (ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Account ID to delete |

**Success Response (204 No Content)**: No body

**Error Responses**:
- `404 Not Found` - Account not found

---

### 4. Group (Role) APIs

#### 4.1 Get All Groups
Retrieve all user groups/roles.

**Endpoint**: `GET /api/groups`

**Access**: Authenticated (READ or ADMIN permission)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "ADMIN",
    "permissions": ["READ", "WRITE", "DELETE", "ADMIN"]
  },
  {
    "id": 2,
    "name": "USER",
    "permissions": ["READ"]
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Group ID |
| name | String | Group/role name |
| permissions | Set<String> | List of permission names |

---

#### 4.2 Get Group by ID
Retrieve a specific group by ID.

**Endpoint**: `GET /api/groups/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Group ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "ADMIN",
  "permissions": ["READ", "WRITE", "DELETE", "ADMIN"]
}
```

**Error Responses**:
- `404 Not Found` - Group not found

---

#### 4.3 Create Group
Create a new user group/role.

**Endpoint**: `POST /api/groups`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "name": "MANAGER",
  "permissionIds": [1, 2]
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | String | Yes | Not blank | Group/role name |
| permissionIds | Set<Long> | No | - | Set of permission IDs to assign |

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "name": "MANAGER",
  "permissions": ["READ", "WRITE"]
}
```

---

#### 4.4 Update Group
Update an existing group/role.

**Endpoint**: `PUT /api/groups/{id}`

**Access**: Authenticated (WRITE or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Group ID to update |

**Request Body**:
```json
{
  "name": "SENIOR_MANAGER",
  "permissionIds": [1, 2, 3]
}
```

**Success Response (200 OK)**:
```json
{
  "id": 3,
  "name": "SENIOR_MANAGER",
  "permissions": ["READ", "WRITE", "DELETE"]
}
```

---

#### 4.5 Delete Group
Delete a group/role.

**Endpoint**: `DELETE /api/groups/{id}`

**Access**: Authenticated (ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Group ID to delete |

**Success Response (204 No Content)**: No body

**Error Responses**:
- `404 Not Found` - Group not found

---

### 5. Permission APIs

#### 5.1 Get All Permissions
Retrieve all available permissions.

**Endpoint**: `GET /api/permissions`

**Access**: Authenticated (READ or ADMIN permission)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "READ"
  },
  {
    "id": 2,
    "name": "WRITE"
  },
  {
    "id": 3,
    "name": "DELETE"
  },
  {
    "id": 4,
    "name": "ADMIN"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Permission ID |
| name | String | Permission name |

---

#### 5.2 Get Permission by ID
Retrieve a specific permission by ID.

**Endpoint**: `GET /api/permissions/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Permission ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "name": "READ"
}
```

**Error Responses**:
- `404 Not Found` - Permission not found

---

#### 5.3 Create Permission
Create a new permission.

**Endpoint**: `POST /api/permissions`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "name": "EXPORT"
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | String | Yes | Not blank | Permission name |

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "name": "EXPORT"
}
```

---

#### 5.4 Delete Permission
Delete a permission.

**Endpoint**: `DELETE /api/permissions/{id}`

**Access**: Authenticated (ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Permission ID to delete |

**Success Response (204 No Content)**: No body

**Error Responses**:
- `404 Not Found` - Permission not found

---

### 6. Account Type APIs

#### 6.1 Get All Account Types
Retrieve all account types.

**Endpoint**: `GET /api/account-types`

**Access**: Authenticated (READ or ADMIN permission)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "typeName": "savings"
  },
  {
    "id": 2,
    "typeName": "business"
  },
  {
    "id": 3,
    "typeName": "current"
  },
  {
    "id": 4,
    "typeName": "wallet"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Account type ID |
| typeName | String | Account type name |

---

#### 6.2 Get Account Type by ID
Retrieve a specific account type by ID.

**Endpoint**: `GET /api/account-types/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Account type ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "typeName": "savings"
}
```

**Error Responses**:
- `404 Not Found` - Account type not found

---

#### 6.3 Create Account Type
Create a new account type.

**Endpoint**: `POST /api/account-types`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "typeName": "investment"
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| typeName | String | Yes | Not blank | Account type name |

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "typeName": "investment"
}
```

---

### 7. Currency APIs

#### 7.1 Get All Currencies
Retrieve all supported currencies.

**Endpoint**: `GET /api/currencies`

**Access**: Authenticated (READ or ADMIN permission)

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "currencyCode": "INR",
    "currencyName": "Indian Rupee"
  },
  {
    "id": 2,
    "currencyCode": "USD",
    "currencyName": "US Dollar"
  },
  {
    "id": 3,
    "currencyCode": "EUR",
    "currencyName": "Euro"
  },
  {
    "id": 4,
    "currencyCode": "GBP",
    "currencyName": "British Pound"
  }
]
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Currency ID |
| currencyCode | String | ISO currency code (max 10 chars) |
| currencyName | String | Full currency name (max 50 chars) |

---

#### 7.2 Get Currency by ID
Retrieve a specific currency by ID.

**Endpoint**: `GET /api/currencies/{id}`

**Access**: Authenticated (READ or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Currency ID |

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "currencyCode": "INR",
  "currencyName": "Indian Rupee"
}
```

**Error Responses**:
- `404 Not Found` - Currency not found

---

#### 7.3 Create Currency
Create a new currency.

**Endpoint**: `POST /api/currencies`

**Access**: Authenticated (WRITE or ADMIN permission)

**Request Body**:
```json
{
  "currencyCode": "JPY",
  "currencyName": "Japanese Yen"
}
```

**Field Descriptions**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| currencyCode | String | Yes | Not blank, max 10 chars | ISO currency code |
| currencyName | String | Yes | Not blank, max 50 chars | Full currency name |

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "currencyCode": "JPY",
  "currencyName": "Japanese Yen"
}

#### 2.4 Update User
Update an existing user's information.

**Endpoint**: `PUT /api/users/{id}`

**Access**: Authenticated (WRITE or ADMIN permission)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | User ID to update |

**Request Body**:
```json
{
  "name": "J
```

---

### Error Response Format

All error responses follow a standardized format:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: 999",
  "path": "/api/users/999"
}
```

**Error Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| timestamp | LocalDateTime | Error occurrence time |
| status | int | HTTP status code |
| error | String | Error type |
| message | String | Detailed error message |
| path | String | Request path |

---

### Common HTTP Status Codes

| Code | Description | When It Occurs |
|------|-------------|----------------|
| 200 | OK | Successful request |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Validation errors or invalid input |
| 401 | Unauthorized | Invalid credentials or missing/expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (e.g., email already exists) |
| 500 | Internal Server Error | Unexpected server error |

---

## Authentication Flow

1. **Signup**: User registers with email, password, and optional group assignment
2. **Login**: User authenticates and receives JWT token
3. **Access Protected APIs**: Include JWT token in Authorization header as `Bearer {token}`
4. **Logout**: Client deletes token (stateless JWT)

## Role-Based Access Control (RBAC)

The system uses Groups and Permissions for authorization:

- **Groups**: Represent roles (e.g., ADMIN, USER)
- **Permissions**: Define access levels (READ, WRITE, DELETE, ADMIN)
- **Group_Permissions**: Maps permissions to groups

### Authorization Rules

- Auth endpoints (`/api/auth/**`): Public (no authentication required)
- All other endpoints: Require authentication and at least READ or ADMIN permission

### Example Permission Setup

**ADMIN Group**: READ, WRITE, DELETE, ADMIN (full access)

**USER Group**: READ (read-only access)

## Testing APIs

### Using cURL

#### 1. Signup a new user
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "groupId": 2
  }'
```

#### 2. Login and get token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

#### 3. Access protected endpoint
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Create an account
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "userId": 1,
    "accountTypeId": 1,
    "currencyId": 1,
    "balance": 1000.00
  }'
```

### Using Postman

1. Create a new Postman collection for Wallet Management System
2. Set up environment variables:
   - `base_url`: `http://localhost:8080`
   - `token`: (will be set after login)
3. For login request, add Tests tab:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```
4. For all protected requests, add Authorization header:
   - Type: Bearer Token
   - Token: `{{token}}`

## Error Handling

The API returns standardized error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: 999",
  "path": "/api/users/999"
}
```

### Common Error Codes

- **400 Bad Request**: Validation errors or business rule violations
- **401 Unauthorized**: Invalid credentials or expired token
- **404 Not Found**: Resource does not exist
- **500 Internal Server Error**: Unexpected server error

## Security Features

- **JWT-based Authentication**: Stateless, scalable authentication
- **BCrypt Password Encryption**: Secure password hashing
- **Role-Based Access Control (RBAC)**: Fine-grained authorization
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Jakarta Validation API for request validation
- **Global Exception Handling**: Consistent error responses

## Database Schema

### Tables

- **users**: User accounts with group assignments
- **groups**: Role-based groups (RBAC)
- **permissions**: Available permissions
- **group_permissions**: Maps permissions to groups
- **accounts**: Wallet accounts linked to users
- **account_types**: Account type definitions
- **currencies**: Supported currencies

### Relationships

- User → Group (Many-to-One)
- Group ↔ Permission (Many-to-Many via group_permissions)
- Account → User, AccountType, Currency (Many-to-One)

## Build Commands

```bash
# Clean and build
./gradlew clean build

# Run tests
./gradlew test

# Run application
./gradlew bootRun

# Create JAR
./gradlew bootJar

# Run JAR
java -jar build/libs/wallet-management-system-0.0.1-SNAPSHOT.jar
```

## Production Deployment

1. Update `application.yaml` with production database credentials
2. Change JWT secret to a secure, environment-specific value
3. Configure proper CORS origins
4. Enable HTTPS
5. Set appropriate logging levels
6. Use connection pooling (HikariCP is default)
7. Configure database connection limits

## API Testing Checklist

- [ ] Test signup with valid data
- [ ] Test signup with duplicate email
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test access protected endpoints without token
- [ ] Test access protected endpoints with valid token
- [ ] Test access protected endpoints with expired token
- [ ] Test CRUD operations for all modules
- [ ] Test validation errors (missing fields, invalid email)
- [ ] Test RBAC (user with READ permission cannot POST/PUT/DELETE)
- [ ] Test account creation with non-existent user
- [ ] Test group assignment with permissions

## Support

For issues or questions, please check the exception messages in API responses or review application logs.
