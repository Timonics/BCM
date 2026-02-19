# BCM Manager API

Band Coordinating Ministry Admin Dashboard API built with NestJS, Sequelize ORM, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Superadmin, Admin, Class Coordinator)
- **Members Management**: CRUD operations, CSV import/export, advanced search and filtering
- **Band Management**: Band CRUD, executive assignment (Patron, Matron, Captain, Vice-Captain, Secretary), member management
- **Unit Management**: Unit CRUD, leadership assignment, member management
- **Class Management**: Pre-Youth, Baptismal, and ETS class batch management with enrollment tracking
- **Dashboard**: Overview statistics and alerts
- **Notifications**: In-app and email notifications for alerts

## Tech Stack

- **Framework**: NestJS
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bcm_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

3. Run database migrations (execute the SQL DDL provided)

4. Start the application:
```bash
npm run start:dev
```

5. Access Swagger documentation:
```
http://localhost:3000/api
```

## API Documentation

Once the server is running, visit `/api` for interactive Swagger documentation.

