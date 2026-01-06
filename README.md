# TastyBite Restaurant - Full Stack Application

A modern full-stack restaurant website with separate frontend and backend.

## 📁 Project Structure

```
TastyBite/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── data/         # Static data
│   │   ├── services/     # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/           # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js + Express backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── package.json
│
└── package.json         # Root package.json (scripts)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm run install:frontend
npm run install:backend
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option B: MongoDB Atlas (Recommended)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `backend/.env` with your connection string

See `MONGODB_SETUP.md` for detailed instructions.

### 3. Configure Environment

Backend is already configured in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/tastybite
PORT=5000
```

Frontend is configured in `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database (Optional)

```bash
cd backend
npm run seed
```

### 5. Run the Application

**Run both frontend and backend:**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

## 🌐 Access

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📜 Available Scripts

### Root Scripts
```bash
npm run dev              # Run both frontend & backend
npm run frontend         # Run frontend only
npm run backend          # Run backend only
npm run install:all      # Install all dependencies
npm run install:frontend # Install frontend dependencies
npm run install:backend  # Install backend dependencies
npm run build           # Build frontend for production
```

### Frontend Scripts (in frontend/)
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### Backend Scripts (in backend/)
```bash
npm start      # Start server
npm run dev    # Start with auto-reload
npm run seed   # Seed database
```

## 🔌 API Endpoints

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get single reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu?category=starters` - Filter by category
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all messages

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tastybite
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting service
```

### Backend
- Set environment variables on hosting platform
- Deploy backend folder
- Ensure MongoDB connection string is correct

## 📖 Documentation

- `MONGODB_SETUP.md` - MongoDB setup guide
- `QUICKSTART.md` - Quick start guide

## License

MIT
