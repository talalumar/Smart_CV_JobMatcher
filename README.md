# Smart CV Job Matcher

An AI-powered CV and job matching platform built for the Pakistan Stock Exchange (PSX) ecosystem. Upload your CV, get matched with relevant jobs, and manage your career — all in one place.

---

## Live Demo

- **Frontend:** [smartcvjobmatcher.vercel.app](https://smart-cv-jobmatcher-c5c5.vercel.app)

---

## Features

- JWT-based Authentication (Login / Signup)
- AI-powered CV to Job Matching
- CV Upload and Parsing
- Job Listings Browser
- Match Score Dashboard
- Voice Assistant Integration
- Fully Responsive UI
- Modern Black & White Design System

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React Framework |
| Tailwind CSS | Styling |
| Axios | API Calls |
| React Context API | State Management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password Hashing |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-cv-job-matcher.git
cd smart-cv-job-matcher
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |

### Frontend `.env.local`
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user, returns JWT |

---

## Deployment

### Frontend → Vercel
1. Push frontend to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend → Vercel
1. Push backend to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `MONGODB_URI` and `JWT_SECRET` environment variables
4. Ensure `vercel.json` is present in backend root
5. Deploy
