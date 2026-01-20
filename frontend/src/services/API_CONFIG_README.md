# API Configuration Guide

## Switching Between Backends

ByteBattles supports two backends:

### 1. .NET 8 Backend (Recommended)
Located at: `/ByteBattles.Server/`

**To use the .NET backend:**

1. Create a `.env` file in the `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:5057
```

2. Start the .NET backend:
```bash
cd ByteBattles.Server/src/ByteBattles.API
dotnet run
```

3. Start the frontend:
```bash
cd frontend
npm start
```

### 2. Node.js Backend (Legacy)
Located at: `/server/`

**To use the Node.js backend:**

1. Create a `.env` file in the `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:3000
```

2. Start the Node.js backend:
```bash
cd server
node app.js
```

3. Start the frontend:
```bash
cd frontend
npm start
```

## API Endpoints

Both backends support the same API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/tests/all` | GET | Get all tests |
| `/api/tests/{id}` | GET | Get test by ID |
| `/api/tests/create` | POST | Create new test |
| `/api/tests/company` | GET | Get tests by company |
| `/api/games/courses` | GET | Get all courses |
| `/api/games/submit-score` | POST | Submit game score |
| `/api/challenges` | GET | Get all challenges |
| `/api/challenges/random` | GET | Get random challenge |
| `/api/battle/run` | POST | Run AI battle |
| `/api/profile` | GET/PUT | User profile |
| `/api/profile/leaderboard` | GET | Get leaderboard |

## Default Behavior

If no `REACT_APP_API_URL` is set, the frontend defaults to the .NET backend at `http://localhost:5057`.

