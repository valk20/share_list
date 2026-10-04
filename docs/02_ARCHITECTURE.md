# Architecture & Technical Design

## 1. Tech Stack Overview

- **Database:** Relational Database (MySQL or PostgreSQL) managed via Docker Compose.
- **Backend API:** [Node.js / Express / NestJS or Python / FastAPI]
- **Frontend Client:** [React / Next.js]
- **ORM / Query Layer:** [Prisma / TypeORM / SQLAlchemy]

## 2. Core Data Entities & Schema

- `users`:
  - `id` (PK)
  - `username` (VARCHAR, Unique)
  - `email` (VARCHAR, Unique)
  - `password_hash` (VARCHAR)
  - `created_at` (TIMESTAMP)
- `lists`:
  - `id` (PK)
  - `owner_id` (FK -> users.id)
  - `title` (VARCHAR)
  - `category` (VARCHAR)
  - `is_public` (BOOLEAN, default: false)
  - `forked_from_id` (FK -> lists.id, nullable)
  - `created_at` (TIMESTAMP)
- `list_items`:
  - `id` (PK)
  - `list_id` (FK -> lists.id, CASCADE DELETE)
  - `title` (VARCHAR)
  - `is_completed` (BOOLEAN, default: false)
  - `created_at` (TIMESTAMP)
- `list_likes`:
  - `id` (PK)
  - `list_id` (FK -> lists.id)
  - `user_id` (FK -> users.id)
  - `created_at` (TIMESTAMP)
- `list_comments`:
  - `id` (PK)
  - `list_id` (FK -> lists.id)
  - `user_id` (FK -> users.id)
  - `content` (TEXT)
  - `created_at` (TIMESTAMP)
