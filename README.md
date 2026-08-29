# AgroHub

A full-stack agricultural marketplace connecting Sri Lankan farmers directly with buyers. Built with the MERN stack (MongoDB, Express, React, Node.js) and a Python ML microservice for crop price forecasting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, TanStack Query, Recharts, Framer Motion |
| Backend | Node.js, Express 5, Mongoose, JWT (HttpOnly cookies) |
| Database | MongoDB |
| AI Service | Python 3.10+, FastAPI, SARIMA, GARCH (statsmodels, arch) |

## Project Structure

```
AgroHub/
├── client/          # React SPA (Vite)
│   └── src/
│       ├── api/           # Axios HTTP client
│       ├── components/    # Reusable UI components
│       ├── context/       # AuthContext, CartContext
│       ├── pages/         # Route-level page components
│       └── styles/        # Modular CSS design system
│
├── server/          # Express REST API
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Route handlers
│   ├── data/              # Database seeder
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas
│   └── routes/            # API route definitions
│
└── ai-service/      # Python ML microservice
    ├── data/              # Generated training CSVs
    ├── models/            # Trained .pkl model files
    ├── generate_data.py   # Market data simulator
    ├── train.py           # SARIMA + GARCH trainer
    ├── predict.py         # Forecast generator
    └── main.py            # FastAPI server
```

## Prerequisites

Make sure these are installed on your machine before starting:

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Python** 3.10+ → [python.org](https://www.python.org/downloads/)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)
- **Git** → [git-scm.com](https://git-scm.com)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ahamed-Haseeb/AgroHub.git
cd AgroHub
```

### 2. Configure environment variables

Create a `.env` file inside the `server/` directory:

```bash
# server/.env

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agrohub
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials. For a local MongoDB instance, use `mongodb://localhost:27017/agrohub`.

### 3. Install dependencies

Open three separate terminals and run the following:

**Terminal 1 — Server**
```bash
cd server
npm install
```

**Terminal 2 — Client**
```bash
cd client
npm install
```

**Terminal 3 — AI Service**
```bash
cd ai-service
pip install -r requirements.txt
```

### 4. Seed the database (first run only)

```bash
cd server
npm run seed
```

This populates the database with sample crop listings, market prices, harvest alerts, and platform stats.

To remove all seeded data:
```bash
npm run seed:destroy
```

### 5. Train the AI models (first run only)

```bash
cd ai-service

# Generate 3 years of simulated market data
python generate_data.py

# Train SARIMA + GARCH models for all 6 crops
python train.py
```

This creates CSV files in `ai-service/data/` and trained model binaries in `ai-service/models/`.

## Running the Application

You need **three terminals** running simultaneously:

**Terminal 1 — AI Service** (start this first)
```bash
cd ai-service
uvicorn main:app --port 8000
```
Runs on `http://localhost:8000`

**Terminal 2 — Express API**
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

**Terminal 3 — React Frontend**
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

Open your browser and go to **http://localhost:5173**.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in (sets HttpOnly cookie) |
| POST | `/api/auth/logout` | Log out (clears cookie) |
| GET | `/api/auth/me` | Get current user session |

### Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crops` | List all crop listings (supports filtering) |
| GET | `/api/crops/:id` | Get a single crop by listing ID |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/mine` | Get logged-in buyer's orders |
| GET | `/api/orders/farmer` | Get orders for logged-in farmer's crops |
| GET | `/api/orders/:id` | Get order details |
| PATCH | `/api/orders/:id/status` | Update order status (farmer) |

### AI Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/crops` | List crops with trained models |
| GET | `/api/ai/predictions/:cropId` | Get 52-week price forecast |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/orders` | Dashboard orders |
| GET | `/api/dashboard/alerts` | Harvest alerts |
| GET | `/api/dashboard/advisory` | Crop advisories |
| GET | `/api/market/prices` | Market price rankings |
| GET | `/api/stats` | Platform statistics |
| GET | `/api/health` | Health check |

## Features

**For Buyers**
- Browse and search crop listings with filters (origin, grade, organic, price range)
- View individual product pages with farmer info and delivery estimates
- Add items to cart (100g to 1 ton per item)
- Checkout with delivery info and payment selection (COD, bank transfer, card)
- Track order status in the buyer dashboard

**For Farmers**
- Dashboard with crop listings, active orders, and harvest alerts
- AI-powered price forecasting with 52-week outlook and confidence intervals
- GARCH volatility analysis with risk scores and actionable recommendations
- Crop advisor with market gap analysis
- Order management with status progression (Confirm → Process → Ship → Deliver)

**AI / ML**
- SARIMA(1,1,1)(1,0,1)[52] models for seasonal price forecasting
- GARCH(1,1) models for market volatility estimation
- Trained on 3 years of simulated Sri Lankan agricultural market data
- Supports 6 crops: Big Onion, Tomato, Carrot, Potato, Leeks, Capsicum

## Scripts Reference

### Server
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with auto-reload |
| `npm start` | Start server (production) |
| `npm run seed` | Seed database with sample data |
| `npm run seed:destroy` | Remove all seeded data |

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### AI Service
| Command | Description |
|---------|-------------|
| `python generate_data.py` | Generate training data |
| `python train.py` | Train all ML models |
| `uvicorn main:app --port 8000` | Start FastAPI server |

## License

ISC
