# Real Estate Backend

Backend API built with NestJS, TypeScript, and OAuth 2.0 Authentication.

## Features

- 🚀 NestJS framework with TypeScript
- 🔐 JWT Authentication
- 🌐 OAuth 2.0 support (Google, Facebook, etc.)
- 📝 Modular architecture (Controllers, Services, Modules)
- 🔄 CORS enabled for frontend integration
- 🏠 RESTful API endpoints for properties
- ✅ Built-in validation and error handling
- 🛡️ Route protection with Guards

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=realestate
DB_SSL=false

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth 2.0
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# GitHub OAuth 2.0
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Keycloak OAuth 2.0 / OpenID Connect
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=your-realm-name
KEYCLOAK_CLIENT_ID=your-keycloak-client-id
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret
KEYCLOAK_CALLBACK_URL=http://localhost:5000/api/auth/keycloak/callback
```

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will be available at `http://localhost:5000`

### Build

Build TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the production server:

```bash
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Returns:
  ```json
  {
    "access_token": "jwt-token-here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Test User"
    }
  }
  ```

- `GET /api/auth/profile` - Get current user profile (requires JWT token)
  Headers: `Authorization: Bearer <token>`

- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/facebook` - Initiate Facebook OAuth login
- `GET /api/auth/facebook/callback` - Facebook OAuth callback
- `GET /api/auth/github` - Initiate GitHub OAuth login
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/auth/keycloak` - Initiate Keycloak OAuth/OpenID Connect login
- `GET /api/auth/keycloak/callback` - Keycloak OAuth callback

### Health Check
- `GET /api/health` - Check server status

### Properties

- `GET /api/properties` - Get all properties (Public)
- `GET /api/properties/:id` - Get property by ID (Public)
- `POST /api/properties` - Create new property (Protected - requires JWT token)
  Headers: `Authorization: Bearer <token>`
  ```json
  {
    "title": "Beautiful House",
    "price": 300000,
    "location": "Bangkok, Thailand"
  }
  ```

## Authentication

### JWT Authentication

1. Login to get access token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

2. Use token in protected routes:
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

### OAuth 2.0

The backend supports multiple OAuth 2.0 providers:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Add credentials to `.env` file

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set redirect URI: `http://localhost:5000/api/auth/facebook/callback`
5. Add credentials to `.env` file

#### GitHub OAuth
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Add credentials to `.env` file

#### Keycloak OAuth/OpenID Connect
1. Install and run Keycloak server (default: `http://localhost:8080`)
2. Create a new Realm in Keycloak Admin Console
3. Create a new Client in the realm:
   - Client ID: your-client-id
   - Client Protocol: `openid-connect`
   - Access Type: `confidential` (for client secret)
   - Valid Redirect URIs: `http://localhost:5000/api/auth/keycloak/callback`
   - Web Origins: `http://localhost:3000` (for CORS)
4. Copy Client ID and Client Secret to `.env` file
5. Set `KEYCLOAK_BASE_URL` (e.g., `http://localhost:8080`)
6. Set `KEYCLOAK_REALM` to your realm name

#### Usage
Visit `http://localhost:5000/api/auth/google` (or `/facebook`, `/github`, `/keycloak`) to initiate OAuth flow.
After authentication, you'll be redirected to frontend with JWT token.

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   ├── auth/
│   │   ├── auth.module.ts         # Auth module
│   │   ├── auth.controller.ts    # Auth endpoints
│   │   ├── auth.service.ts        # Auth business logic
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts    # JWT strategy
│   │   │   ├── oauth2.strategy.ts  # Generic OAuth 2.0 strategy
│   │   │   ├── google.strategy.ts # Google OAuth strategy
│   │   │   ├── facebook.strategy.ts # Facebook OAuth strategy
│   │   │   ├── github.strategy.ts # GitHub OAuth strategy
│   │   │   ├── keycloak.strategy.ts # Keycloak OAuth/OpenID Connect strategy
│   │   │   └── local.strategy.ts  # Local (email/password) strategy
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts  # JWT guard
│   │   │   └── local-auth.guard.ts # Local guard
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts # Get current user decorator
│   │   └── dto/
│   │       └── login.dto.ts       # Login DTO
│   └── properties/
│       ├── properties.module.ts   # Properties module
│       ├── properties.controller.ts # Properties controller
│       ├── properties.service.ts  # Properties service
│       └── dto/
│           └── create-property.dto.ts
├── dist/                          # Compiled JavaScript (generated)
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── nest-cli.json                  # NestJS CLI configuration
└── .env                           # Environment variables
```

## Technologies

- **NestJS**: Progressive Node.js framework
- **Passport**: Authentication middleware
- **JWT**: JSON Web Tokens for stateless authentication
- **OAuth 2.0 / OpenID Connect**: Industry-standard authorization protocol
  - Google OAuth 2.0
  - Facebook OAuth 2.0
  - GitHub OAuth 2.0
  - Keycloak OAuth 2.0 / OpenID Connect
- **bcrypt**: Password hashing
- **class-validator**: DTO validation
- **TypeScript**: Type-safe development

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- OAuth 2.0 integration
- Route protection with Guards
- Input validation with DTOs
- CORS configuration
