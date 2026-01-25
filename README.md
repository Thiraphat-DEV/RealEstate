# Real Estate Application
## โครงสร้างโปรเจกต์

```
RealEstate/
├── frontend/          # React Frontend Application
└── backend/           # NestJS Backend API
```

## Frontend

### เทคโนโลยีหลัก
- **React 18** - UI Library สำหรับสร้าง User Interface
- **Vite** - Build Tool และ Development Server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS Framework

### ไลบรารีสำคัญ
- **React Router DOM** - Client-side Routing
- **Axios** - HTTP Client สำหรับเรียก API
- **Argon2** - Password Hashing

### Development Tools
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing
- **Autoprefixer** - CSS Vendor Prefixing

## Backend

### เทคโนโลยีหลัก
- **NestJS** - Progressive Node.js Framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB Object Modeling

### ไลบรารีสำคัญ
- **Passport** - Authentication Middleware
  - **Passport JWT** - JWT Authentication Strategy
  - **Passport Local** - Local Username/Password Strategy
  - **Passport OAuth2** - OAuth 2.0 Strategy
  - **Passport OpenID Connect** - OpenID Connect Strategy
- **Argon2** - Password Hashing
- **bcrypt** - Alternative Password Hashing
- **JWT** - JSON Web Token สำหรับ Authentication
- **Swagger** - API Documentation
- **Class Validator** - Validation Decorators
- **Class Transformer** - Object Transformation

### Development Tools
- **Jest** - Testing Framework
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Supertest** - HTTP Assertion Library

## Infrastructure

### Docker Services
- **MongoDB** - Database Server
- **Mongo Express** - MongoDB Web Interface
- **Keycloak** - Identity and Access Management
- **Backend API** - NestJS Application
- **Frontend** - React Application

## Quick Start
1. Start Docker in your computer
2. cd `realestate` Project
4. Run Frontend with Backend with command `docker-compose up -d --build`
5. Frontend open `http://localhost:3000`
6. Backend open `http://localhost:5000/api/docs`
### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Docker Setup

1. Start all services with Docker Compose:
```bash
docker-compose up -d
```

2. Access services:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - MongoDB: `mongodb://localhost:27017`
   - Mongo Express: `http://localhost:8081`
   - Keycloak: `http://localhost:8080`

## Contact

**Developer:** Thiraphat Chorakhe
**Email:** thiraboaty@gmail.com
