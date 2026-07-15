# Social Feed

A full-stack social media platform built with **NestJS**, **Next.js**, and **PostgreSQL** — featuring JWT authentication with refresh tokens, nested comment threads, image uploads via Cloudinary, and optimistic UI updates for a snappy, real-world user experience.

---

## Live Demo

| Layer | URL |
|-------|-----|
| Frontend | [INSERT_FRONTEND_LINK_HERE] |
| Backend API | `https://your-api-domain.com/api` |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Design](#system-design)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Features

### Core Social Features
- **Posts** — Create posts with text and optional image attachments
- **Feed** — Paginated feed of all posts ordered by newest first
- **Nested Comments** — Comment on posts, reply to comments (2-level threading)
- **Likes** — Like/unlike posts, comments, and replies independently
- **Image Uploads** — Attach images to posts, hosted on Cloudinary CDN

### Authentication & Security
- **JWT Access Tokens** — Short-lived (15 min), sent via `Authorization` header
- **Refresh Tokens** — Long-lived (7 days), stored as `httpOnly` cookies — inaccessible to JavaScript
- **Auto Token Refresh** — Frontend silently refreshes the access token on 401 and retries the original request
- **bcrypt Password Hashing** — Passwords are never stored in plain text
- **Hashed Refresh Tokens** — Refresh tokens are hashed before storage; stolen DB data cannot be replayed

### Developer Experience
- **Optimistic UI** — State is updated immediately and rolled back on API failure — no loading spinners for interactions
- **Type Safety** — TypeScript end-to-end, Zod schema validation on the frontend, `class-validator` DTOs on the backend
- **Clean Architecture** — NestJS modules, services, controllers, and guards wired via dependency injection
- **Atomic Transactions** — Like creation and count increment run in a single Prisma transaction

---

## Tech Stack

### Backend
| Technology | Role |
|------------|------|
| NestJS 11 | Web framework (TypeScript, DI, decorators) |
| PostgreSQL | Primary relational database |
| Prisma ORM | Type-safe database access & migrations |
| Passport.js + JWT | Authentication strategy |
| bcrypt | Password hashing |
| Cloudinary | Cloud image storage & delivery |
| class-validator | DTO input validation |

### Frontend
| Technology | Role |
|------------|------|
| Next.js 16 (App Router) | React framework with SSR |
| React 19 | UI library |
| TypeScript | Static typing |
| Tailwind CSS 4 | Utility-first styling |
| Zod | Runtime schema validation |
| React Context API | Global auth & posts state |
| react-hot-toast | Notifications |

---

## System Design

```
┌──────────────────────────────────────────────────────────┐
│                        Client (Next.js)                   │
│                                                          │
│   AuthContext (token mgmt)   PostsContext (feed state)   │
│         │                           │                    │
│         └──────────── HTTP ─────────┘                    │
└──────────────────────────┬───────────────────────────────┘
                           │  REST API  (CORS, /api prefix)
┌──────────────────────────▼───────────────────────────────┐
│                    NestJS Backend                         │
│                                                          │
│  AuthModule  PostModule  CommentModule  ReplyModule       │
│  LikeModule  UserModule  CloudinaryModule  PrismaModule   │
│                                                          │
│           Guards (JwtAuthGuard)                          │
│           Strategies (JwtStrategy via Passport)          │
└──────────────────────────┬───────────────────────────────┘
                           │  Prisma ORM
┌──────────────────────────▼───────────────────────────────┐
│                     PostgreSQL                           │
│   User  Post  Comment  Reply  Like                       │
└──────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                Cloudinary CDN                            │
│         (image upload, public URL, deletion)             │
└──────────────────────────────────────────────────────────┘
```

### Key Design Decisions

**Denormalized like counts** — `likeCount` is stored directly on `Post`, `Comment`, and `Reply` rows alongside a separate `Like` join table. This avoids expensive `COUNT(*)` aggregations on every feed query while keeping like state accurate via atomic transactions.

**Generic Like model** — A single `Like` table with a `targetType` enum (`POST | COMMENT | REPLY`) handles all likeable entities. A unique constraint on `(userId, targetType, targetId)` enforces one-like-per-user at the database level.

**Access token in memory, refresh token in httpOnly cookie** — Access tokens live in React state (not `localStorage`) so XSS cannot steal them. Refresh tokens are stored in `httpOnly` cookies so JavaScript cannot read them at all.

**Optimistic updates** — When a user likes a post or submits a comment, the UI updates immediately. The previous state is saved before the API call; if the request fails the saved state is restored and a toast is shown. This eliminates perceived latency on interactions.

**UUID primary keys** — All entities use UUIDs rather than auto-increment integers. This avoids leaking row counts and is safe for distributed insertion.

---

## Architecture

### Backend Module Structure

```
src/
├── auth/           # JWT login, logout, refresh, /me endpoint
├── user/           # Registration, profile retrieval
├── post/           # Create/read/delete posts, attach comments
├── comment/        # Comment CRUD, like comments
├── reply/          # Nested replies to comments, like replies
├── like/           # Generic like service (post/comment/reply)
├── cloudinary/     # Upload & delete images on Cloudinary
├── prisma/         # Shared Prisma client (singleton)
├── feed/           # Feed aggregation (extensible)
└── upload/         # Multipart file handling
```

Each module follows the NestJS pattern:
`Controller` → `Service` → `PrismaService` → PostgreSQL

All protected routes are wrapped with `@UseGuards(JwtAuthGuard)`. The guard uses `JwtStrategy` (Passport) to validate the `Authorization: Bearer <token>` header and attach the user to the request.

### Frontend Component Tree

```
RootLayout (AuthProvider)
└── Home Page
    ├── Navigation
    ├── LeftsideBar
    ├── Feed (PostsContext)
    │   ├── UploadPost         ← create a post
    │   └── FeedPost[]         ← one per post in feed
    │       ├── PostActionButtons  ← like / comment toggle
    │       └── CommentsSection
    │           ├── CommentInput
    │           └── CommentItem[]
    │               ├── ReplyInput
    │               └── ReplyItem[]
    └── RightsideBar
```

### State Management

| Context | Responsibility |
|---------|---------------|
| `AuthContext` | Current user, access token, login/logout, silent refresh |
| `PostsContext` | Posts list, optimistic like/comment/reply mutations |

No third-party state library is needed — React Context + `useReducer`-style handlers cover the requirements cleanly.

---

## Database Schema

```
User
 ├── id               UUID  PK
 ├── firstName        String
 ├── lastName         String
 ├── email            String  UNIQUE
 ├── passwordHash     String
 └── hashedRefreshToken  String?

Post
 ├── id               UUID  PK
 ├── userId           FK → User
 ├── content          Text
 ├── imageUrl         String?
 ├── imagePublicId    String?   (Cloudinary handle)
 ├── visibility       Enum  PUBLIC | PRIVATE
 ├── likeCount        Int   (denormalized)
 ├── commentCount     Int   (denormalized)
 └── createdAt        DateTime  INDEX(DESC)

Comment
 ├── id               UUID  PK
 ├── postId           FK → Post  INDEX
 ├── userId           FK → User
 ├── content          Text
 ├── likeCount        Int
 └── createdAt        DateTime

Reply
 ├── id               UUID  PK
 ├── commentId        FK → Comment  INDEX
 ├── userId           FK → User
 ├── content          Text
 ├── likeCount        Int
 └── createdAt        DateTime

Like
 ├── id               UUID  PK
 ├── userId           FK → User
 ├── targetType       Enum  POST | COMMENT | REPLY
 ├── targetId         String
 ├── postId           FK → Post?
 ├── commentId        FK → Comment?
 ├── replyId          FK → Reply?
 └── UNIQUE(userId, targetType, targetId)
```

All foreign key relationships use **cascade delete** — removing a user removes all their content; removing a post removes its comments, replies, and likes.

---

## Authentication Flow

```
Registration
  POST /api/user  ──→  hash password  ──→  store User

Login
  POST /api/auth/login
    ├── verify password (bcrypt.compare)
    ├── generate access token  (JWT, 15 min)
    ├── generate refresh token (JWT, 7 days)
    ├── hash refresh token → store on User row
    ├── set httpOnly cookie: refreshToken
    └── return { accessToken } in body

Protected Request
  Authorization: Bearer <accessToken>
    └── JwtAuthGuard → JwtStrategy → attach user to req

Token Expiry (401)
  Frontend intercepts 401
    ├── POST /api/auth/refresh  (sends cookie automatically)
    ├── verify refresh token against stored hash
    ├── issue new access token
    └── retry original request transparently

Logout
  POST /api/auth/logout
    ├── clear hashedRefreshToken on User
    └── clear cookie
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | — | Login; returns access token + sets refresh cookie |
| POST | `/auth/logout` | JWT | Logout; clears refresh token |
| GET | `/auth/me` | JWT | Current user profile |
| POST | `/auth/refresh` | Cookie | Swap refresh token for new access token |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/user` | — | Register a new user |

### Posts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/post` | — | List posts (`?skip=0&take=20`) |
| GET | `/post/:id` | — | Get single post |
| POST | `/post` | JWT | Create post (multipart: `content`, `image?`) |
| DELETE | `/post/:id` | JWT | Delete post |
| POST | `/post/:id/like` | JWT | Like a post |
| DELETE | `/post/:id/like` | JWT | Unlike a post |
| POST | `/post/:id/comment` | JWT | Add comment to post |

### Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/comment/:id/like` | JWT | Like a comment |
| DELETE | `/comment/:id/like` | JWT | Unlike a comment |
| POST | `/comment/:id/reply` | JWT | Add reply to comment |

### Replies

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reply/:id/like` | JWT | Like a reply |
| DELETE | `/reply/:id/like` | JWT | Unlike a reply |

**Standard response envelope:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": { ... }
}
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- A [Cloudinary](https://cloudinary.com) account (free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/social-feed.git
cd social-feed
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env    # fill in your values (see below)
npm install
npx prisma migrate dev  # run migrations
npm run start:dev
```

### 3. Set up the frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/social_feed

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)

```env
BACKEND_API_URL=http://localhost:3001/api
```

---

## Project Structure

```
social-feed/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── post/
│   │   ├── comment/
│   │   ├── reply/
│   │   ├── like/
│   │   ├── cloudinary/
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
└── frontend/         # Next.js client
    ├── app/
    ├── components/
    ├── context/
    ├── services/
    └── types/
```

---

## License

MIT
