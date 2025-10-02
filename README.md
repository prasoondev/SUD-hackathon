# Guild Quest Health App - Docker Setup

This project uses Docker to containerize the entire application stack including PostgreSQL database, Express.js backend, and React frontend.

## 🐳 **Docker Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │    │   Blockchain    │
│   (React)       │◄──►│  (Express.js)   │◄──►│   Database      │    │   (Flask/Python)│
│   Port: 8080    │    │   Port: 3001    │    │   Port: 5432    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 **Prerequisites**

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 **Quick Start**

### 1. Clone and Setup
```bash
git clone <your-repo>
cd SUD-hackathon
```

### 2. Start All Services
```bash
# Start all services (database, backend, frontend, blockchain)
sudo docker compose up -d

# Or start with logs visible
sudo docker compose up
```

### 3. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Blockchain Service**: http://localhost:5000
- **Database**: localhost:5432

## 🔧 **Development Mode**

For development, you might want to run only the database in Docker and run frontend/backend locally:

### Start only PostgreSQL and Blockchain
```bash
sudo docker compose up postgres blockchain -d
```

### Run Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Run Frontend Locally
```bash
cd UI/guild-quest-health
npm install
npm run dev
```

## 📊 **Database Information**

- **Database**: guild_quest
- **User**: guild_user
- **Password**: guild_password
- **Host**: localhost (or 'postgres' within Docker network)
- **Port**: 5432

### Database Schema

The `users` table is automatically created with:

```sql
CREATE TABLE users (
    userid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

The `blockchainid` table links users to blockchain accounts:

```sql
CREATE TABLE blockchainid (
    userid UUID PRIMARY KEY REFERENCES users(userid) ON DELETE CASCADE,
    blockchainid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔑 **Environment Variables**

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=guild_quest
DB_USER=guild_user
DB_PASSWORD=guild_password
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:8080
BLOCKCHAIN_URL=http://blockchain:5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🛠 **Docker Commands**

### Basic Operations
```bash
# Start all services
sudo docker compose up -d

# Stop all services
sudo docker compose down

# Restart services
sudo docker compose restart

# View logs
sudo docker compose logs -f

# View logs for specific service
sudo docker compose logs -f backend
```

### Database Operations
```bash
# Connect to PostgreSQL
sudo docker compose exec postgres psql -U guild_user -d guild_quest

# Backup database
sudo docker compose exec postgres pg_dump -U guild_user guild_quest > backup.sql

# Restore database
cat backup.sql | sudo docker compose exec -T postgres psql -U guild_user guild_quest
```

### Development Operations
```bash
# Rebuild specific service
sudo docker compose build backend

# Rebuild and restart
sudo docker compose up --build backend

# Access container shell
sudo docker compose exec backend sh
```

## 🔐 **Authentication Features**

- **JWT-based authentication** with 24-hour token expiration
- **Password hashing** with bcrypt (12 salt rounds)
- **Input validation** with express-validator
- **Rate limiting** (100 requests per 15 minutes)
- **Security headers** with Helmet

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login (auto-creates blockchain ID) | No |
| **User Management** |
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update user profile | Yes |
| GET | `/api/user/:userid` | Get user by ID | No |
| **Blockchain Integration** |
| GET | `/api/blockchain/balance` | Get user's token balance | Yes |
| POST | `/api/blockchain/earn` | Earn tokens (rewards) | Yes |
| POST | `/api/blockchain/spend` | Spend tokens (purchase items) | Yes |
| GET | `/api/blockchain/info` | Get blockchain service info | No |
| GET | `/api/blockchain/chain` | Get full blockchain (debug) | Yes |
| **System** |
| GET | `/api/health` | Health check | No |

## 🧪 **Testing**

### Test User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "password": "password123"
  }'
```

### Test Blockchain Integration
```bash
# First, login to get a token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Get blockchain balance
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/blockchain/balance

# Earn some tokens
curl -X POST http://localhost:3001/api/blockchain/earn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 10
  }'

# Spend tokens
curl -X POST http://localhost:3001/api/blockchain/spend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "item": "Health Potion",
    "cost": 5
  }'
```

## 🔄 **Data Persistence**

- Database data is persisted in a Docker volume: `postgres_data`
- Data survives container restarts and rebuilds
- To completely reset the database, remove the volume:
  ```bash
  sudo docker compose down -v
  ```

## 🐛 **Troubleshooting**

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo docker compose ps postgres

# Check PostgreSQL logs
sudo docker compose logs postgres

# Test database connection
sudo docker compose exec postgres psql -U guild_user -d guild_quest -c "SELECT NOW();"
```

### Backend Issues
```bash
# Check backend logs
sudo docker compose logs backend

# Restart backend
sudo docker compose restart backend

# Check if backend can connect to database
curl http://localhost:3001/api/health
```

### Frontend Issues
```bash
# Check frontend logs
sudo docker compose logs frontend

# Rebuild frontend
sudo docker compose build frontend
sudo docker compose up -d frontend
```

## 🔒 **Security Notes**

1. **Change default passwords** in production
2. **Use strong JWT secrets** in production
3. **Enable HTTPS** in production
4. **Configure proper CORS** for production domains
5. **Use environment-specific configs** for different environments

## 📁 **Project Structure**

```
SUD-hackathon/
├── docker-compose.yml          # Docker services configuration
├── database/
│   └── init.sql               # Database initialization
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Express.js server
│   └── .env                   # Backend environment variables
└── UI/guild-quest-health/
    ├── Dockerfile             # Frontend container config
    ├── package.json           # Frontend dependencies
    └── .env                   # Frontend environment variables
```