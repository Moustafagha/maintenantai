# MaintAI Platform

## Overview

The MaintAI Platform is a comprehensive industrial maintenance management system built with modern web technologies. It provides real-time machine monitoring, predictive analytics, maintenance scheduling, and security oversight for industrial environments. The application features a React-based frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with predictive analytics endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL session store
- **Development Server**: Custom Vite integration for SSR-like development experience

### Database Design
The system uses PostgreSQL with four main tables:
- **users**: User authentication and role management
- **machines**: Machine inventory with real-time metrics
- **maintenance_records**: Maintenance history and scheduling
- **security_events**: Security monitoring and audit logs

## Key Components

### Authentication System
- Simple username/password authentication
- Role-based access control (admin, technician, supervisor)
- Session-based authentication with local storage backup
- Protected routes and API endpoints

### Machine Monitoring
- Real-time machine status tracking (operational, warning, maintenance)
- Sensor data collection (temperature, vibration, efficiency)
- Visual status indicators with color-coded badges
- Auto-refresh functionality for live updates

### Predictive Analytics Engine
- Failure probability calculation based on multiple factors
- Maintenance scheduling optimization
- Cost estimation for maintenance operations
- Risk assessment algorithms for prioritization

### Dashboard Interface
- Multi-tab layout (Overview, Monitoring, Analytics, Security)
- Interactive cards for key metrics and statistics
- Real-time data visualization
- Quick action buttons for common operations

## Data Flow

1. **Client Initialization**: React app loads with authentication check
2. **Data Fetching**: TanStack Query manages API calls with automatic caching
3. **Real-time Updates**: Periodic data refresh for machine status and analytics
4. **User Actions**: Form submissions trigger API calls with optimistic updates
5. **State Synchronization**: Query invalidation ensures data consistency

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **wouter**: Lightweight routing library
- **zod**: Schema validation and type inference

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database schema management and migrations
- **tailwindcss**: Utility-first CSS framework

### Storage Strategy
- **Development**: In-memory storage with mock data initialization
- **Production**: PostgreSQL database with connection pooling
- **Session Storage**: PostgreSQL-backed session store for scalability

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied during deployment
4. **Assets**: Static files served from build output

### Environment Configuration
- **Development**: Local development with hot reload
- **Production**: Optimized builds with environment-specific settings
- **Database**: Environment-based connection strings
- **Sessions**: Configurable session storage backend

### Scalability Considerations
- Stateless server design for horizontal scaling
- Database connection pooling for concurrent requests
- CDN-ready static asset serving
- Modular architecture for feature expansion

The application is designed as a full-stack TypeScript solution with clear separation of concerns, making it maintainable and extensible for additional industrial IoT features and integrations.