# Backend Architecture & Implementation Guide

## 1. Overview & Objectives

This document specifies the technical design, directory structure, REST API endpoints, and startup instructions for the backend service powering the list-sharing social platform.

---

## 2. Tech Stack Selection

- **Runtime:** Node.js (v20+ LTS) or TypeScript
- **Framework:** Express.js (or Fastify)
- **ORM:** Prisma ORM (ideal for type safety and seamless migrations with MySQL)
- **Database:** MySQL 8.0 (running in Docker Compose)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs for password hashing
- **Validation:** Zod or Joi for request payload validation

---

## 3. Project Directory Structure

```text
backend/
├── src/
│   ├── config/             # DB connection, env variables, constants
│   │   ├── db.js           # Prisma client / connection pool
│   │   └── env.js          # Validated environment configuration
│   ├── controllers/        # Request handlers (logic per endpoint)
│   │   ├── authController.js
│   │   ├── listController.js
│   │   └── itemController.js
│   ├── middleware/         # Auth verification, error handling, validation
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/             # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── listRoutes.js
│   │   ├── itemRoutes.js
│   │   └── index.js
│   ├── services/           # Business logic & DB queries
│   │   ├── authService.js
│   │   └── listService.js
│   └── app.js              # Express app initialization
├── prisma/
│   └── schema.prisma       # Prisma schema & migrations
├── .env.example
├── package.json
└── server.js               # Entry point (listens on PORT)
```

## 4. Environment Variables (backend/.env)

```
PORT=5000
NODE_ENV=development

# MySQL connection string format:
# mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://list_user:user_password_123@localhost:3306/listshare_db"

JWT_SECRET="your_jwt_super_secret_key"
JWT_EXPIRES_IN="7d"
```

## 5.Prisma Schema Draft (prisma/schema.prisma)

```javascript
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            Int            @id @default(autoincrement())
  username      String         @unique @db.VarChar(50)
  email         String         @unique @db.VarChar(100)
  passwordHash  String         @map("password_hash") @db.VarChar(255)
  createdAt     DateTime       @default(now()) @map("created_at")
  lists         List[]
  likes         ListLike[]
  comments      ListComment[]

  @@map("users")
}

model List {
  id            Int            @id @default(autoincrement())
  ownerId       Int            @map("owner_id")
  title         String         @db.VarChar(150)
  category      String?        @db.VarChar(50)
  isPublic      Boolean        @default(false) @map("is_public")
  forkedFromId  Int?           @map("forked_from_id")
  createdAt     DateTime       @default(now()) @map("created_at")

  owner         User           @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  items         ListItem[]
  likes         ListLike[]
  comments      ListComment[]

  @@map("lists")
}

model ListItem {
  id          Int      @id @default(autoincrement())
  listId      Int      @map("list_id")
  title       String   @db.VarChar(255)
  isCompleted Boolean  @default(false) @map("is_completed")
  createdAt   DateTime @default(now()) @map("created_at")

  list        List     @relation(fields: [listId], references: [id], onDelete: Cascade)

  @@map("list_items")
}

model ListLike {
  id        Int      @id @default(autoincrement())
  listId    Int      @map("list_id")
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  list      List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([listId, userId])
  @@map("list_likes")
}

model ListComment {
  id        Int      @id @default(autoincrement())
  listId    Int      @map("list_id")
  userId    Int      @map("user_id")
  content   String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  list      List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("list_comments")
}
```

## 6. REST API Specification

### Authentication (/api/auth)

POST /api/auth/register - Create a new user account (returns JWT).
POST /api/auth/login - Authenticate existing user credentials (returns JWT).
GET /api/auth/me - Get profile of currently logged-in user (requires Bearer Token).

### Lists (/api/lists)

GET /api/lists - Get public feed (supports query params: ?category=travel&sort=popular).
GET /api/lists/my-lists - Get private + public lists belonging to the authenticated user.
GET /api/lists/:id - Fetch single list with its items (accessible if public OR owned by requester).
POST /api/lists - Create a new list.
PUT /api/lists/:id - Update list metadata/visibility (owner only).
DELETE /api/lists/:id - Delete list (owner only).
POST /api/lists/:id/fork - Clone/fork a public list into the current user's library.

### Items (/api/lists/:listId/items)

POST /api/lists/:listId/items - Add a new checklist task/item.
PATCH /api/items/:id/toggle - Toggle item completion (isCompleted).
DELETE /api/items/:id - Remove an item.

### Social (/api/lists/:id)

POST /api/lists/:id/like - Toggle like on a list.
GET /api/lists/:id/comments - Fetch comments for a list.
POST /api/lists/:id/comments - Post a comment on a list.

## 7. Step-by-Step Initial Setup

### Initialize Project:

```Bash
mkdir backend && cd backend
npm init -y
```

### Install Core Dependencies:

```Bash
npm install express dotenv cors jsonwebtoken bcryptjs
npm install -D nodemon prisma
npm install @prisma/client
```

### Initialize Prisma & Connect DB:

```Bash
npx prisma init
```

(Ensure docker compose up -d is running the MySQL service).

### Run Initial Database Migration:

```Bash
npx prisma migrate dev --name init
```

### Start Development Server:

```Bash
npm run dev
```
