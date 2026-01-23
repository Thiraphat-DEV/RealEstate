# Real Estate Frontend

Frontend application built with React, Vite, and TypeScript.

## Features

- ⚡ Fast development with Vite
- ⚛️ React 18 with TypeScript
- 🎨 Modern UI with CSS
- 🔄 API integration with Axios

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## API Configuration

The frontend is configured to proxy API requests to the backend server running on `http://localhost:5000`. This is configured in `vite.config.ts`.
