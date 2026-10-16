# API Routes & Database CRUD Documentation

This document outlines all RESTful API endpoints for the **ShareList** platform, including request payloads, response structures, and the exact MySQL queries needed for database operations.

Base URL: `/api/v1`

---

## 📋 Route Implementation Tracker (To-Do List)

> Use the checkboxes below (`[x]` / `[ ]`) to track which routes are implemented and tested.

### 🟢 Progress Overview: 7 / 19 Routes Covered

#### System & Health
- [x] `GET /api/v1/health` — Server health check & MySQL database ping

#### 1. Authentication & Users
- [x] `POST /api/v1/auth/register` — [1.1 Register User](#11-register-user)
- [x] `POST /api/v1/auth/login` — [1.2 Login User](#12-login-user)
- [x] `GET /api/v1/users/me` — [1.3 Get Current User Profile (Auth required)](#13-get-current-user-profile)
- [x] `GET /api/v1/users/:id` — [1.4 Get User by ID](#14-get-user-by-id)

#### 2. Lists Management
- [x] `GET /api/v1/lists` — [2.1 Get Public Feed / Discover Lists](#21-get-public-feed--discover-lists)
- [x] `GET /api/v1/lists/my-lists` — [2.2 Get User's Own Lists (Auth required)](#22-get-users-own-lists-private--public)
- [x] `GET /api/v1/lists/:id` — [2.3 Get Single List with Items](#23-get-single-list-with-items)
- [ ] `POST /api/v1/lists` — [2.4 Create a New List (Auth required)](#24-create-a-new-list)
- [ ] `PUT /api/v1/lists/:id` — [2.5 Update a List (Owner only)](#25-update-a-list)
- [ ] `DELETE /api/v1/lists/:id` — [2.6 Delete a List (Owner only)](#26-delete-a-list)
- [ ] `POST /api/v1/lists/:id/fork` — [2.7 Fork / Clone a Public List (Auth required)](#27-fork--clone-a-public-list)

#### 3. List Items CRUD
- [ ] `POST /api/v1/lists/:listId/items` — [3.1 Add Item to List (Owner only)](#31-add-item-to-list)
- [ ] `PATCH /api/v1/items/:id/toggle` — [3.2 Toggle Item Completed Status](#32-toggle-item-completed-status)
- [ ] `PUT /api/v1/items/:id` — [3.3 Edit Item Title](#33-edit-item-title)
- [ ] `DELETE /api/v1/items/:id` — [3.4 Delete Item](#34-delete-item)

#### 4. Likes & Social Interactions
- [ ] `POST /api/v1/lists/:listId/likes/toggle` — [4.1 Toggle Like on a List (Auth required)](#41-toggle-like-on-a-list)
- [ ] `GET /api/v1/lists/:listId/likes` — [4.2 Get Users Who Liked a List](#42-get-users-who-liked-a-list)

#### 5. Comments
- [ ] `GET /api/v1/lists/:listId/comments` — [5.1 Get Comments for a List](#51-get-comments-for-a-list)
- [ ] `POST /api/v1/lists/:listId/comments` — [5.2 Post a Comment (Auth required)](#52-post-a-comment)
- [ ] `DELETE /api/v1/comments/:id` — [5.3 Delete a Comment (Author/Owner only)](#53-delete-a-comment)

---

## ⚠️ Important Note: `mysql2/promise` vs `pg` (PostgreSQL)

In Node.js with `mysql2/promise`:
1. **Destructuring**: `pool.query()` returns `[rows, fields]` or `[result, fields]`.
   - `SELECT`: `const [rows] = await pool.query("SELECT ...")` -> `rows` is an array.
   - `INSERT`: `const [result] = await pool.query("INSERT ...")` -> ID is in `result.insertId`.
   - `UPDATE/DELETE`: `const [result] = await pool.query(...)` -> Check `result.affectedRows`.
2. **Placeholders**: MySQL uses `?`, **not** `$1, $2` (PostgreSQL style).
3. **Insert Returning**: MySQL does **not** support `RETURNING *`. Use `result.insertId` to query the inserted record if needed.

---

## Database Entities Reference (`db/init.sql`)

- **users**: `id`, `username`, `email`, `password_hash`, `created_at`
- **lists**: `id`, `owner_id`, `title`, `category`, `is_public`, `forked_from_id`, `created_at`
- **list_items**: `id`, `list_id`, `title`, `is_completed`, `created_at`
- **list_likes**: `id`, `list_id`, `user_id`, `created_at` (UNIQUE `list_id, user_id`)
- **list_comments**: `id`, `list_id`, `user_id`, `content`, `created_at`

---

## 1. Authentication & Users (`/api/v1/auth`, `/api/v1/users`)

### 1.1 Register User
- **Method & URL:** `POST /api/v1/auth/register`
- **Description:** Registers a new user with hashed password.
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **MySQL Query:**
  ```sql
  INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);
  ```
- **Response (`201 Created`):**
  ```json
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```

### 1.2 Login User
- **Method & URL:** `POST /api/v1/auth/login`
- **Description:** Authenticates user credentials and returns a JWT.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **MySQL Query:**
  ```sql
  SELECT id, username, email, password_hash FROM users WHERE email = ?;
  ```
- **Response (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

### 1.3 Get Current User Profile
- **Method & URL:** `GET /api/v1/users/me`
- **Description:** Returns profile info of the logged-in user.
- **MySQL Query:**
  ```sql
  SELECT id, username, email, created_at FROM users WHERE id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2026-10-14T07:00:00.000Z"
  }
  ```

### 1.4 Get User by ID
- **Method & URL:** `GET /api/v1/users/:id`
- **Description:** Returns profile info of a specific user by ID.
- **MySQL Query:**
  ```sql
  SELECT id, username, email, created_at FROM users WHERE id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2026-10-14T07:00:00.000Z"
    }
  }
  ```

---

## 2. Lists Management (`/api/v1/lists`)

### 2.1 Get Public Feed / Discover Lists
- **Method & URL:** `GET /api/v1/lists`
- **Query Params (Optional):**
  - `category` (e.g., `travel`, `tech`, `movies`)
  - `search` (e.g., `grocery`)
  - `page` (default `1`), `limit` (default `20`)
- **Description:** Returns all public lists along with owner information and like/comment counts.
- **MySQL Query:**
  ```sql
  SELECT 
    l.id, 
    l.title, 
    l.category, 
    l.is_public, 
    l.created_at, 
    l.forked_from_id,
    u.id AS owner_id, 
    u.username AS owner_username,
    COUNT(DISTINCT lk.id) AS likes_count,
    COUNT(DISTINCT c.id) AS comments_count,
    COUNT(DISTINCT li.id) AS items_count
  FROM lists l
  JOIN users u ON l.owner_id = u.id
  LEFT JOIN list_likes lk ON lk.list_id = l.id
  LEFT JOIN list_comments c ON c.list_id = l.id
  LEFT JOIN list_items li ON li.list_id = l.id
  WHERE l.is_public = TRUE
    AND (? IS NULL OR l.category = ?)
    AND (? IS NULL OR l.title LIKE CONCAT('%', ?, '%'))
  GROUP BY l.id, u.id
  ORDER BY l.created_at DESC
  LIMIT ? OFFSET ?;
  ```
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 10,
      "title": "Top 10 Sci-Fi Books",
      "category": "books",
      "is_public": true,
      "owner_id": 1,
      "owner_username": "johndoe",
      "likes_count": 14,
      "comments_count": 3,
      "items_count": 10,
      "created_at": "2026-10-14T07:10:00.000Z"
    }
  ]
  ```

### 2.2 Get User's Own Lists (Private & Public)
- **Method & URL:** `GET /api/v1/lists/my-lists`
- **Description:** Returns all lists owned by the authenticated user.
- **MySQL Query:**
  ```sql
  SELECT 
    l.id, 
    l.title, 
    l.category, 
    l.is_public, 
    l.forked_from_id, 
    l.created_at,
    COUNT(li.id) AS items_count
  FROM lists l
  LEFT JOIN list_items li ON li.list_id = l.id
  WHERE l.owner_id = ?
  GROUP BY l.id
  ORDER BY l.created_at DESC;
  ```
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 12,
      "title": "Weekend Grocery Shopping",
      "category": "shopping",
      "is_public": false,
      "items_count": 5,
      "created_at": "2026-10-14T07:12:00.000Z"
    }
  ]
  ```

### 2.3 Get Single List with Items
- **Method & URL:** `GET /api/v1/lists/:id`
- **Description:** Fetches full list details and all its checklist items.
- **MySQL Queries:**
  ```sql
  -- 1. Fetch List and Owner:
  SELECT l.*, u.username AS owner_username
  FROM lists l
  JOIN users u ON l.owner_id = u.id
  WHERE l.id = ? AND (l.is_public = TRUE OR l.owner_id = ?);

  -- 2. Fetch Items:
  SELECT id, title, is_completed, created_at
  FROM list_items
  WHERE list_id = ?
  ORDER BY id ASC;
  ```
- **Response (`200 OK`):**
  ```json
  {
    "id": 10,
    "title": "Top 10 Sci-Fi Books",
    "category": "books",
    "is_public": true,
    "owner_id": 1,
    "owner_username": "johndoe",
    "items": [
      { "id": 101, "title": "Dune", "is_completed": true },
      { "id": 102, "title": "Hyperion", "is_completed": false }
    ]
  }
  ```

### 2.4 Create a New List
- **Method & URL:** `POST /api/v1/lists`
- **Request Body:**
  ```json
  {
    "title": "Summer Road Trip Essentials",
    "category": "travel",
    "is_public": true,
    "items": [
      "Sunglasses",
      "First aid kit",
      "Offline maps"
    ]
  }
  ```
- **MySQL Query:**
  ```sql
  INSERT INTO lists (owner_id, title, category, is_public) VALUES (?, ?, ?, ?);
  -- Then batch insert items with result.insertId:
  INSERT INTO list_items (list_id, title) VALUES (?, ?), (?, ?), (?, ?);
  ```
- **Response (`201 Created`):**
  ```json
  {
    "id": 15,
    "owner_id": 1,
    "title": "Summer Road Trip Essentials",
    "category": "travel",
    "is_public": true
  }
  ```

### 2.5 Update a List
- **Method & URL:** `PUT /api/v1/lists/:id`
- **Description:** Update list title, category, or public/private visibility (owner only).
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "category": "productivity",
    "is_public": false
  }
  ```
- **MySQL Query:**
  ```sql
  UPDATE lists 
  SET title = ?, category = ?, is_public = ? 
  WHERE id = ? AND owner_id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "List updated successfully" }
  ```

### 2.6 Delete a List
- **Method & URL:** `DELETE /api/v1/lists/:id`
- **Description:** Deletes a list and cascades to all its items, likes, and comments.
- **MySQL Query:**
  ```sql
  DELETE FROM lists WHERE id = ? AND owner_id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "List deleted successfully" }
  ```

### 2.7 Fork / Clone a Public List
- **Method & URL:** `POST /api/v1/lists/:id/fork`
- **Description:** Copies an existing public list and all its checklist items into the current user's library with `forked_from_id` set to the original list ID.
- **MySQL Queries:**
  ```sql
  -- 1. Insert new list:
  INSERT INTO lists (owner_id, title, category, is_public, forked_from_id)
  SELECT ?, title, category, FALSE, id
  FROM lists
  WHERE id = ? AND is_public = TRUE;

  -- 2. Copy items into new list:
  INSERT INTO list_items (list_id, title, is_completed)
  SELECT ?, title, FALSE
  FROM list_items
  WHERE list_id = ?;
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "List forked successfully",
    "newListId": 16
  }
  ```

---

## 3. List Items CRUD (`/api/v1/lists/:listId/items`, `/api/v1/items/:id`)

### 3.1 Add Item to List
- **Method & URL:** `POST /api/v1/lists/:listId/items`
- **Request Body:**
  ```json
  {
    "title": "Passport & ID"
  }
  ```
- **MySQL Query:**
  ```sql
  INSERT INTO list_items (list_id, title) VALUES (?, ?);
  ```
- **Response (`201 Created`):**
  ```json
  {
    "id": 105,
    "list_id": 15,
    "title": "Passport & ID",
    "is_completed": false
  }
  ```

### 3.2 Toggle Item Completed Status
- **Method & URL:** `PATCH /api/v1/items/:id/toggle`
- **Request Body (Optional, or toggles current value):**
  ```json
  {
    "is_completed": true
  }
  ```
- **MySQL Query:**
  ```sql
  UPDATE list_items 
  SET is_completed = NOT is_completed 
  WHERE id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "Item status updated" }
  ```

### 3.3 Edit Item Title
- **Method & URL:** `PUT /api/v1/items/:id`
- **Request Body:**
  ```json
  {
    "title": "Updated item text"
  }
  ```
- **MySQL Query:**
  ```sql
  UPDATE list_items SET title = ? WHERE id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "Item title updated" }
  ```

### 3.4 Delete Item
- **Method & URL:** `DELETE /api/v1/items/:id`
- **MySQL Query:**
  ```sql
  DELETE FROM list_items WHERE id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "Item deleted" }
  ```

---

## 4. Likes & Social Interactions (`/api/v1/lists/:listId/likes`)

### 4.1 Toggle Like on a List
- **Method & URL:** `POST /api/v1/lists/:listId/likes/toggle`
- **Description:** Adds a like if not already liked; removes the like if already liked.
- **MySQL Queries:**
  ```sql
  -- Check if like exists:
  SELECT id FROM list_likes WHERE list_id = ? AND user_id = ?;

  -- If exists -> DELETE:
  DELETE FROM list_likes WHERE list_id = ? AND user_id = ?;

  -- If does not exist -> INSERT:
  INSERT INTO list_likes (list_id, user_id) VALUES (?, ?);
  ```
- **Response (`200 OK`):**
  ```json
  {
    "liked": true,
    "likes_count": 15
  }
  ```

### 4.2 Get Users Who Liked a List
- **Method & URL:** `GET /api/v1/lists/:listId/likes`
- **MySQL Query:**
  ```sql
  SELECT u.id, u.username, lk.created_at
  FROM list_likes lk
  JOIN users u ON lk.user_id = u.id
  WHERE lk.list_id = ?
  ORDER BY lk.created_at DESC;
  ```
- **Response (`200 OK`):**
  ```json
  [
    { "id": 2, "username": "alice", "created_at": "2026-10-14T07:15:00.000Z" }
  ]
  ```

---

## 5. Comments (`/api/v1/lists/:listId/comments`)

### 5.1 Get Comments for a List
- **Method & URL:** `GET /api/v1/lists/:listId/comments`
- **MySQL Query:**
  ```sql
  SELECT 
    c.id, 
    c.content, 
    c.created_at, 
    u.id AS user_id, 
    u.username
  FROM list_comments c
  JOIN users u ON c.user_id = u.id
  WHERE c.list_id = ?
  ORDER BY c.created_at ASC;
  ```
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "content": "Great recommendations! Added them to my reading queue.",
      "created_at": "2026-10-14T07:18:00.000Z",
      "user_id": 2,
      "username": "alice"
    }
  ]
  ```

### 5.2 Post a Comment
- **Method & URL:** `POST /api/v1/lists/:listId/comments`
- **Request Body:**
  ```json
  {
    "content": "Great recommendations! Added them to my reading queue."
  }
  ```
- **MySQL Query:**
  ```sql
  INSERT INTO list_comments (list_id, user_id, content) VALUES (?, ?, ?);
  ```
- **Response (`201 Created`):**
  ```json
  {
    "id": 1,
    "list_id": 10,
    "user_id": 2,
    "content": "Great recommendations! Added them to my reading queue.",
    "created_at": "2026-10-14T07:18:00.000Z"
  }
  ```

### 5.3 Delete a Comment
- **Method & URL:** `DELETE /api/v1/comments/:id`
- **Description:** Deletes a comment (comment author or list owner only).
- **MySQL Query:**
  ```sql
  DELETE FROM list_comments WHERE id = ? AND user_id = ?;
  ```
- **Response (`200 OK`):**
  ```json
  { "message": "Comment deleted successfully" }
  ```

---

## 6. Recommended Router & Directory Structure

To keep the Express app clean and modular, split routes by resource under `backend/src/routes/`:

```text
backend/src/
├── config/
│   ├── config.js          # Port & DB credentials
│   └── db.js              # MySQL pool & query helpers
├── routes/
│   ├── authRouter.js      # /api/v1/auth (register, login)
│   ├── usersRouter.js     # /api/v1/users (profile)
│   ├── listsRouter.js     # /api/v1/lists (feed, my-lists, CRUD, fork)
│   ├── itemsRouter.js     # /api/v1/items (checklist toggles, updates)
│   ├── likesRouter.js     # /api/v1/lists/:id/likes (toggle likes)
│   ├── commentsRouter.js  # /api/v1/lists/:id/comments (commenting)
│   └── healthRouter.js    # /api/v1/health
└── server.js              # Express app mounting routers
```
