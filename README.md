# Book World

## Overview

Book World is a full-stack web application designed for book enthusiasts to discover, read, and share their favorite books. Built with a modern tech stack, it integrates the Google Books API for comprehensive book data and Google OAuth for seamless user authentication.

### Key Features

- **User Authentication**: Secure login and signup using Google OAuth 2.0
- **Book Discovery**: Search and browse millions of books from Google Books API
- **Personalized Dashboard**: View recommended books based on user preferences
- **Book Management**: Save favorite books and track reading progress
- **Responsive Design**: Optimized for desktop and mobile devices

### Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js with Express.js, MongoDB with Mongoose
- **Authentication**: Google OAuth 2.0, JWT tokens
- **APIs**: Google Books API, Google Identity Services
- **Deployment**: Ready for Vercel (frontend) and cloud providers (backend)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Console account for API keys and OAuth setup

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Book-world
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables (see below)

4. Start MongoDB service

5. Run the application:
   ```bash
   # Backend (from backend directory)
   npm start

   # Frontend (from frontend directory, in another terminal)
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/your_mongo_db_name
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
JWT_SECRET=<your_secure_jwt_secret>
JWT_REFRESH_SECRET=<your_secure_jwt_refresh_secret>
JWT_EXPIRES_IN=1d
GOOGLE_BOOKS_API_KEY=<your_google_books_api_key>
GOOGLE_BOOKS_BASE_URL=https://www.googleapis.com/books/v1/volumes
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
```

### Frontend (.env.local)

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Books API
   - Google+ API (for OAuth)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback` (if using server-side OAuth)
5. Copy the Client ID and Client Secret to your environment variables

## Project Structure

```
Book-world/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── middleware/      # Custom middleware
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/                # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── public/              # Static assets
│   ├── package.json
│   └── .env.local           # Environment variables
└── README.md
```

## API Documentation

The backend provides RESTful APIs for:
- User authentication (/auth)
- Book search and details (/books)
- User preferences and saved books (/users)

API documentation is available via Swagger at `http://localhost:5000/api-docs` when the backend is running.