# Job Posting Application

A full-stack job posting application built with modern web technologies, featuring a NestJS backend API and a Next.js frontend with internationalization support.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS with Express
- **Language**: TypeScript
- **Testing**: Jest (unit & e2e)
- **Code Quality**: ESLint, Prettier

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript + React 19
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl (English & Khmer)
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
job-posting/
├── backend/          # NestJS API server
│   ├── src/         # Main application code
│   │   ├── main.ts         # Application entry point
│   │   ├── app.module.ts   # Root module
│   │   ├── app.controller.ts # Main controller
│   │   └── app.service.ts  # Main service
│   ├── test/        # E2E tests
│   └── package.json
├── frontend/        # Next.js web application
│   ├── src/
│   │   ├── app/     # App Router pages and layouts
│   │   │   └── [locale]/   # Internationalized routes
│   │   ├── i18n/    # Internationalization configuration
│   │   └── middleware.ts   # Locale routing middleware
│   ├── messages/    # Translation files
│   │   ├── en.json  # English translations
│   │   └── kh.json  # Khmer translations
│   └── package.json
├── .github/
│   └── workflows/   # CI/CD pipelines
├── WARP.md         # Development guidelines for Warp
└── README.md       # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-posting
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Development

#### Running the Backend

```bash
cd backend
npm run start:dev    # Start development server with hot reload
```

The backend will be available at `http://localhost:3000`

#### Running the Frontend

```bash
cd frontend
npm run dev         # Start development server
```

The frontend will be available at `http://localhost:3000` (or `3002` if backend is running)

#### Running Both Services

For full-stack development, run both services in separate terminals:

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 🌍 Internationalization

The application supports two languages:

- **English** (`en`): Default locale
- **Khmer** (`kh`): Cambodian language support

### URLs
- English: `http://localhost:3002/en`
- Khmer: `http://localhost:3002/kh`

### Adding New Translations

1. Add new keys to `frontend/messages/en.json`
2. Add corresponding translations to `frontend/messages/kh.json`
3. Use in components with `useTranslations` hook:

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("MyNamespace");
  return <h1>{t("myKey")}</h1>;
}
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch

# Run specific test file
npm run test -- app.controller.spec.ts
```

### Frontend Testing

Currently no test setup configured. To add testing:

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 🔧 Building for Production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🚀 Deployment

The project includes GitHub Actions workflows for automated CI/CD:

### Continuous Integration

- Automated testing on push/PR to main
- Linting and code quality checks
- Security vulnerability scanning
- Build verification for both services

### Deployment Pipeline

- Creates production-ready build artifacts
- Generates deployment package with startup scripts
- Supports multiple deployment targets (server, cloud, Docker)

### Environment Variables

For production deployment, configure these GitHub secrets:

- `PRODUCTION_API_URL`: Backend API URL for frontend
- `DEPLOY_PRIVATE_KEY`: SSH key for server deployment
- `DEPLOY_USER` & `DEPLOY_HOST`: Server credentials

## 📋 Available Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:debug` | Start with debugging enabled |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the application |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🛡️ Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both projects
- **Prettier**: Code formatting (backend)
- **Git Hooks**: Pre-commit checks via CI/CD

## 🐛 Troubleshooting

### Port Conflicts

Both frontend and backend default to port 3000. If running simultaneously:
- Backend: Set `PORT=3001` environment variable
- Frontend: Will auto-detect and use port 3002

### Internationalization Issues

If translations aren't working:
1. Ensure you're using `"use client"` directive for components using `useTranslations`
2. Verify translation files exist in `frontend/messages/`
3. Check middleware configuration in `frontend/src/middleware.ts`

### Build Errors

If you encounter build errors:
1. Clear Next.js cache: `rm -rf frontend/.next`
2. Reinstall dependencies: `npm ci`
3. Check TypeScript errors: `npx tsc --noEmit`

## 📚 Documentation

- [WARP.md](./WARP.md) - Development guidelines for Warp AI terminal
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Job posting CRUD operations
- [ ] File upload for job attachments
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Admin dashboard
- [ ] API documentation with Swagger
- [ ] Unit tests for frontend
- [ ] Docker containerization

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check existing documentation
- Review troubleshooting section above

---

**Happy coding!** 🎉