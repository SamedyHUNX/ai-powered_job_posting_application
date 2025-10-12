# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack job posting application built with a **NestJS backend** and **Next.js frontend** architecture. The project consists of two main parts:
- **Backend**: NestJS TypeScript API (port 3000)
- **Frontend**: Next.js 15 React application with internationalization support (English/Thai)

## Architecture

### High-Level Structure
```
job-posting/
├── backend/          # NestJS API server
│   ├── src/         # Main application code
│   └── test/        # E2E tests
├── frontend/        # Next.js web application
│   ├── src/         # Application source code
│   │   ├── app/     # App Router pages and layouts
│   │   └── i18n/    # Internationalization configuration
│   └── messages/    # Translation files (en.json, th.json)
└── .git/           # Git repository
```

### Backend (NestJS)
- **Framework**: NestJS with Express
- **Language**: TypeScript
- **Architecture**: Modular architecture with controllers, services, and modules
- **Key Files**:
  - `src/main.ts`: Application entry point
  - `src/app.module.ts`: Root module
  - `src/app.controller.ts`: Main controller
  - `src/app.service.ts`: Main service

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript + React 19
- **Styling**: Tailwind CSS 4
- **Key Features**:
  - Internationalization (i18n) with next-intl
  - Support for English and Thai locales
  - Font optimization with Geist fonts
- **Key Files**:
  - `src/app/page.tsx`: Main landing page
  - `src/app/[locale]/page.tsx`: Internationalized pages
  - `src/middleware.ts`: Handles locale routing
  - `src/i18n/routing.ts`: i18n configuration

## Common Development Commands

### Backend Commands
All backend commands should be run from the `backend/` directory:

```bash
# Development
cd backend
npm install                    # Install dependencies
npm run start:dev             # Start development server with hot reload
npm run start:debug           # Start with debugging enabled

# Building and Production
npm run build                 # Build the application
npm run start:prod           # Run production build

# Testing
npm run test                 # Run unit tests
npm run test:watch           # Run tests in watch mode
npm run test:e2e             # Run end-to-end tests
npm run test:cov             # Run tests with coverage

# Code Quality
npm run lint                 # Run ESLint
npm run format               # Format code with Prettier
```

### Frontend Commands
All frontend commands should be run from the `frontend/` directory:

```bash
# Development
cd frontend
npm install                  # Install dependencies
npm run dev                 # Start development server (localhost:3000)

# Building and Production
npm run build               # Build for production
npm start                   # Start production server

# Code Quality
npm run lint                # Run ESLint
```

### Running Both Services
For full-stack development, you'll typically want to run both services:

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Running Single Tests
For the backend (NestJS), you can run specific test files:

```bash
cd backend
npm run test -- app.controller.spec.ts     # Run specific test file
npm run test -- --testNamePattern="method" # Run tests matching pattern
```

## Key Architecture Patterns

### Backend Patterns
- **Dependency Injection**: Uses NestJS's built-in DI container
- **Decorator-based**: Controllers and services use TypeScript decorators
- **Modular**: Code organized into feature modules
- **Standard Structure**: Controllers handle HTTP requests, Services contain business logic

### Frontend Patterns
- **App Router**: Uses Next.js 13+ App Router for file-based routing
- **Server Components**: Leverages React Server Components by default
- **Internationalization**: Route-based locale detection with middleware
- **Component Structure**: Pages are in `app/` directory, with layout inheritance

### Data Flow
Currently, this is a basic starter setup:
1. **Frontend**: Next.js serves pages and handles client-side interactions
2. **Backend**: NestJS provides API endpoints (currently just "Hello World!")
3. **Communication**: Frontend would communicate with backend via HTTP APIs
4. **Internationalization**: Middleware detects locale and serves appropriate content

## Development Notes

### Port Configuration
- **Backend**: Runs on port 3000 (default) - configurable via `PORT` environment variable
- **Frontend**: Runs on port 3000 (default) - will conflict with backend if run simultaneously
- **Recommendation**: Configure different ports or use frontend on 3001 when running both

### Internationalization
- Default locale: English (`en`)
- Supported locales: English (`en`), Thai (`th`)
- Translation files: `messages/en.json`, `messages/th.json`
- URL structure: `/en/...` and `/th/...` (with `/` redirecting to `/en`)

### Code Style
- **TypeScript**: Strict mode enabled for both projects
- **ESLint**: Configured for both frontend and backend
- **Prettier**: Backend uses Prettier for code formatting
- **Imports**: Use relative imports for local files, absolute for packages

### Testing Strategy
- **Backend**: Jest for unit testing, separate e2e configuration
- **Frontend**: No test setup currently configured (may need to add)

## CI/CD Pipeline

The project includes GitHub Actions workflows for automated testing and deployment:

### Continuous Integration (`.github/workflows/ci.yml`)
Runs automatically on pushes and pull requests to main:
- **Backend Job**: Linting, unit tests, e2e tests, test coverage, build
- **Frontend Job**: Linting, build with production optimizations
- **Integration Job**: Starts both services and runs integration tests
- **Security Job**: npm audit for both backend and frontend
- **Build Status**: Final status check across all jobs

### Deployment (`.github/workflows/deploy.yml`)
Runs after successful CI pipeline:
- Builds production-ready artifacts for both services
- Creates deployment package with startup scripts
- Uploads artifacts for manual or automated deployment
- Includes commented examples for various deployment targets

### Environment Variables
For production deployments, configure these secrets in GitHub:
- `PRODUCTION_API_URL`: Backend API URL for frontend
- `DEPLOY_PRIVATE_KEY`: SSH key for server deployment (if using)
- `DEPLOY_USER` and `DEPLOY_HOST`: Server credentials (if using)

## Current State

This appears to be a newly scaffolded project with:
- Basic NestJS backend with "Hello World" endpoint
- Next.js frontend with internationalization setup
- Standard development tooling configured
- **GitHub Actions CI/CD pipeline configured**
- No database or external service integrations yet
- No API communication between frontend and backend implemented

The project is ready for feature development but currently contains only the framework boilerplate code.
