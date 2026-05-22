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

### Authentication APIs

#### 1. Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "groupId": 1
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

#### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

#### 3. Logout
```bash
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response**:
```json
{
  "message": "Logout successful"
}
```

### User APIs

#### Get All Users
```bash
GET /api/users
Authorization: Bearer {token}
```

#### Get User by ID
```bash
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Create User
```bash
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "groupId": 2
}
```

#### Update User
```bash
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Updated",
  "email": "jane.updated@example.com",
  "groupId": 1
}
```

#### Delete User
```bash
DELETE /api/users/{id}
Authorization: Bearer {token}
```

### Group APIs

#### Get All Groups
```bash
GET /api/groups
Authorization: Bearer {token}
```

#### Create Group
```bash
POST /api/groups
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "MANAGER",
  "permissionIds": [1, 2]
}
```

#### Update Group
```bash
PUT /api/groups/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "SENIOR_MANAGER",
  "permissionIds": [1, 2, 3]
}
```

#### Delete Group
```bash
DELETE /api/groups/{id}
Authorization: Bearer {token}
```

### Permission APIs

#### Get All Permissions
```bash
GET /api/permissions
Authorization: Bearer {token}
```

#### Create Permission
```bash
POST /api/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "EXPORT"
}
```

#### Delete Permission
```bash
DELETE /api/permissions/{id}
Authorization: Bearer {token}
```

### Account APIs

#### Get All Accounts
```bash
GET /api/accounts
Authorization: Bearer {token}
```

#### Get Accounts by User ID
```bash
GET /api/accounts/user/{userId}
Authorization: Bearer {token}
```

#### Create Account
```bash
POST /api/accounts
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "accountTypeId": 1,
  "currencyId": 1,
  "balance": 1000.00
}
```

#### Update Account
```bash
PUT /api/accounts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "accountTypeId": 2,
  "currencyId": 2,
  "balance": 5000.00
}
```

#### Delete Account
```bash
DELETE /api/accounts/{id}
Authorization: Bearer {token}
```

### Account Type APIs

#### Get All Account Types
```bash
GET /api/account-types
Authorization: Bearer {token}
```

#### Create Account Type
```bash
POST /api/account-types
Authorization: Bearer {token}
Content-Type: application/json

{
  "typeName": "investment"
}
```

### Currency APIs

#### Get All Currencies
```bash
GET /api/currencies
Authorization: Bearer {token}
```

#### Create Currency
```bash
POST /api/currencies
Authorization: Bearer {token}
Content-Type: application/json

{
  "currencyCode": "JPY",
  "currencyName": "Japanese Yen"
}
```

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
