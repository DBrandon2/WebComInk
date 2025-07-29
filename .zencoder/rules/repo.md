# Repository Information Overview

## Repository Summary

WebComInk is a web application for reading manga scans. It consists of a React-based frontend client and a Node.js Express backend server.

## Repository Structure

- **WebComInk Client**: Frontend React application built with Vite
- **WebComInk Server**: Backend Express.js server with MongoDB database
- **.vscode**: Editor configuration files

### Main Repository Components

- **Client**: React application with Tailwind CSS for UI
- **Server**: Express.js API with MongoDB for data storage
- **Root**: Contains minimal configuration with some shared dependencies

## Projects

### WebComInk Client

**Configuration File**: package.json

#### Language & Runtime

**Language**: JavaScript (React)
**Version**: React 18.3.1
**Build System**: Vite 6.2.0
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^7.5.0
- axios: ^1.9.0
- @supabase/supabase-js: ^2.49.4
- framer-motion: ^12.16.0
- react-hook-form: ^7.55.0
- yup: ^1.6.1

**Development Dependencies**:

- vite: ^6.2.0
- tailwindcss: ^4.0.15
- eslint: ^9.21.0
- vitest: ^3.1.2

#### Build & Installation

```bash
cd WebComInk\ Client
npm install
npm run dev    # Development server
npm run build  # Production build
```

#### Testing

**Framework**: Vitest with React Testing Library
**Test Location**: src/**tests**
**Structure**: Units and integration tests in separate folders
**Run Command**:

```bash
npm run test:unit
```

### WebComInk Server

**Configuration File**: package.json

#### Language & Runtime

**Language**: JavaScript (Node.js)
**Version**: Node.js (Express 5.1.0)
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- express: ^5.1.0
- mongoose: ^8.14.0
- axios: ^1.9.0
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- nodemailer: ^7.0.3
- cors: ^2.8.5
- dotenv: ^16.5.0

**Development Dependencies**:

- nodemon: ^3.1.10

#### Build & Installation

```bash
cd WebComInk\ Server
npm install
npm start  # Runs with nodemon for development
```

#### Database

**Type**: MongoDB
**Configuration**: Configured in database/config.js
**Models**: User and temporary user schemas defined in models directory

#### API Structure

**Routes**: Defined in routes directory (manga and user routes)
**Controllers**: Business logic in controllers directory
**API Integration**: External manga API integration in api/MangaApi.js
