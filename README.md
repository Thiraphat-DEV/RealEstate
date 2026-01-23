# Real Estate Application

Full-stack Real Estate application with separate frontend and backend.

## Project Structure

```
RealEstate/
├── frontend/          # React + Vite + TypeScript
└── backend/           # NestJS + TypeScript
```

## Quick Start

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

## Technologies

### Frontend
- React 18
- Vite
- TypeScript
- Axios

### Backend
- Node.js
- NestJS
- TypeScript
- CORS

## Development

Both frontend and backend support hot reload during development. Make sure both servers are running simultaneously for full functionality.

## License

ISC
