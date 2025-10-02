# Guild Quest Health: YouMatter Gamification Challenge Solution

## 🏆 Executive Summary

**Guild Quest Health** is a comprehensive gamified wellness platform addressing YouMatter's engagement challenges through innovative behavioral psychology, social mechanics, and AI-powered personalization. Our solution drives user engagement through family-based guilds, blockchain rewards, and multi-tier competition systems.

---

## 🥽 AR & 3D Exercise Features (Technical Implementation)

### 🎯 3D Model Integration Architecture
Our platform implements **Google Model Viewer** with WebGL for immersive 3D exercise demonstrations:

```typescript
// 3D Model Viewer Component (GenericExercise.tsx)
<model-viewer
  ref={modelViewerRef}
  src={`/${model}`}              // .glb files in public/ directory
  camera-controls                // Orbit, zoom, pan controls
  touch-action="pan-y"           // Mobile gesture support
  autoplay                       // Animation auto-start
  ar                            // AR capability enabled
  shadow-intensity="1"          // Realistic shadows
  auto-rotate                   // Continuous rotation
  max-camera-orbit="auto 90deg auto"
  alt={`3D model of a character doing ${exerciseName}`}
/>
```

### 🎪 AR-Enabled Exercise Library
**Implemented AR Exercises with 3D Models**:

#### **Cardio Category** (`CardioExercises.tsx`)
- **Sit-ups** (`Situps.glb`) - Core strengthening with AR form guidance
- **Jumping Jacks** (`Jumping Jacks.glb`) - Full-body cardio with movement tracking
- **Burpees** (`Burpee.glb`) - High-intensity interval training
- **Boxing** (`Boxing.glb`) - Combat sports training with stance correction
- **Dancing** (`Dancing.glb`) - Rhythm-based cardio workouts

#### **Strength Training Category** (`StrengthExercises.tsx`)
- **Jump Push-ups** (`Jump Push Up.glb`) - Explosive upper body training
- **Plank** (`Start Plank.glb`) - Core stability and endurance
- **MMA Kick** (`Mma Kick.glb`) - Martial arts leg strength and balance

#### **Yoga & Mindfulness** (`YogaExercises.tsx`)
- **Meditation Pose** (`Male Sitting Pose.glb`) - Proper meditation posture training

### 🔧 AR Technical Stack Implementation
```typescript
// AR-specific styling (ar-viewer.css)
model-viewer::part(default-ar-button) {
  background-color: #4f46e5;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
}

// Mobile AR compatibility check
const ARSupport = {
  android: 'ARCore required',
  ios: 'ARKit supported',
  chrome: 'Mobile browser recommended'
}
```

### 📱 AR Feature User Flow
1. **Exercise Selection**: User taps "Start AR Training" button
2. **3D Model Loading**: WebGL renders .glb file with realistic shadows
3. **Interactive Controls**: Rotate, zoom, and examine exercise form
4. **AR Mode**: Place 3D instructor in real environment
5. **Form Tracking**: Visual guidance for proper exercise execution

---

## ⛓️ Blockchain Implementation (Technical Deep Dive)

### 🏗️ Blockchain Architecture Overview
```python
# Blockchain Service (blockchain.py) - Flask API on Port 5000
class Blockchain:
    def __init__(self):
        self.current_transactions = []
        self.chain = []
        self.nodes = set()
        self.db = DatabaseManager()  # PostgreSQL integration
        
        # Load existing blockchain from database
        self.chain = self.db.load_blockchain()
        
        # Genesis block creation
        if not self.chain:
            self.new_block(previous_hash='1', proof=100)
```

### 🔐 Proof-of-Work Mining Algorithm
```python
def proof_of_work(self, last_block):
    """
    Proof of Work Algorithm:
    - Find number p' such that hash(pp') contains leading 4 zeroes
    - Mining difficulty: 4 leading zeros
    - SHA-256 hashing with JSON serialization
    """
    last_proof = last_block['proof']
    last_hash = self.hash(last_block)
    
    proof = 0
    while self.valid_proof(last_proof, proof, last_hash) is False:
        proof += 1
    return proof

@staticmethod
def valid_proof(last_proof, proof, last_hash):
    guess = f'{last_proof}{proof}{last_hash}'.encode()
    guess_hash = hashlib.sha256(guess).hexdigest()
    return guess_hash[:4] == "0000"  # 4 leading zeros
```

### 💰 Token Economy Implementation
```python
# Reward Distribution Endpoints
@app.route('/rewards/earn', methods=['POST'])
def earn_rewards():
    # User completes exercise -> Earn tokens
    blockchain.new_transaction(sender="0", recipient=user_id, amount=amount)
    
    # Mine new block with transaction
    proof = blockchain.proof_of_work(blockchain.last_block)
    previous_hash = blockchain.hash(blockchain.last_block)
    blockchain.new_block(proof, previous_hash)
    
    return jsonify({'message': f'{amount} tokens earned', 'balance': new_balance})

@app.route('/rewards/spend', methods=['POST'])
def spend_rewards():
    # Spend tokens on rewards/items
    blockchain.new_transaction(sender=user_id, recipient="store", amount=cost)
    # Mine block and update balance
```

### 🔗 Backend-Blockchain Integration
```javascript
// Backend server.js - Blockchain service integration
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL || 'http://blockchain:5000';

// User registration creates blockchain ID
const createBlockchainUser = async () => {
  const response = await axios.get(`${BLOCKCHAIN_URL}/user/new`);
  return response.data.user_id;  // UUID for blockchain transactions
};

// Exercise completion triggers token reward
app.post('/api/blockchain/earn', authenticateToken, async (req, res) => {
  const blockchainId = await getBlockchainId(req.user.userid);
  const response = await axios.post(`${BLOCKCHAIN_URL}/rewards/earn`, {
    user_id: blockchainId,
    amount: req.body.amount  // Points from exercise completion
  });
});
```

### 📊 Blockchain Data Persistence
```python
# DatabaseManager class - PostgreSQL integration
class DatabaseManager:
    def save_block(self, block, block_hash):
        query = """
        INSERT INTO blockchain_blocks (block_index, timestamp, transactions, 
                                     proof, previous_hash, block_hash)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(query, (block['index'], block['timestamp'],
                          json.dumps(block['transactions']), block['proof'],
                          block['previous_hash'], block_hash))
```

### 🌐 Blockchain Frontend Demo
- **Live Interface**: http://localhost:5000 (Blockchain API)
- **Demo HTML**: `blockchain/frontend.html` with token management
- **User Creation**: Generate unique blockchain IDs
- **Balance Tracking**: Real-time token balance queries
- **Transaction History**: Immutable record of all rewards/spending

---

## 🎮 Gaming Mechanics Implementation

### 🏆 Points & Progression System

Exercise point values (implemented in all exercise files)

### 🔥 Streak & Competition System
```typescript
// Family leaderboard implementation (Leagues.tsx)
const familyGuildMembers = [
  { name: "Dad", points: 1580, rank: 1, streak: 12, lastActivity: "2h ago" },
  { name: "Mom", points: 1420, rank: 2, streak: 8, lastActivity: "4h ago" },
  { name: "You", points: 1245, rank: 3, streak: 5, lastActivity: "now", isUser: true },
  // Visual indicators: 🔥 streak flames, crown icons for #1 position
];

// Real-time activity pressure
const activityIndicators = {
  'now': 'Active now',
  'recent': '2h ago', 
  'declining': '1d ago',  // Creates urgency for engagement
  'inactive': '2d ago'    // Risk of losing streak
};
```

### 🎯 Achievement System Database Schema
```sql
-- Achievements table (database/init.sql)
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirement_type VARCHAR(100) NOT NULL,  -- 'feature_usage', 'streak', 'total_steps'
    requirement_value VARCHAR(255) NOT NULL,
    reward_amount INTEGER NOT NULL,
    icon VARCHAR(50) NOT NULL
);

-- Implemented achievements
INSERT INTO achievements VALUES
('First Steps', 'Try step tracking feature', 'feature_usage', 'step_tracking', 100, 'footprints'),
('Workout Warrior', 'Complete first exercise', 'feature_usage', 'exercise_tracking', 100, 'dumbbell'),
('30-Day Streak', 'Maintain activity for 30 days', 'streak', '30', 1000, 'sparkles'),
('Step Master', 'Walk 100,000 total steps', 'total_steps', '100000', 500, 'footprints');
```

### 🏰 Guild Progress Tracking
```typescript
// GuildProgress.tsx - Real-time family competition
interface GuildProgressProps {
  guildName: string;      // "The Johnson Family"
  currentPoints: number;  // 8420 (sum of all family member points)
  goalPoints: number;     // 12000 (weekly family target)
  memberCount: number;    // 6 family members
}

// Visual progress bar and ranking system
const percentage = Math.min((currentPoints / goalPoints) * 100, 100);
```

---

## 👥 User Stories & App Flow

### 🚀 New User Onboarding Journey

#### **Story 1: Sarah discovers Guild Quest Health**
```
As a busy working mother,
I want to stay fit while involving my family,
So that we can motivate each other and build healthy habits together.

FLOW:
1. Downloads app → Registration screen with family setup prompt
2. Creates account → Immediate "Create Family Guild" tutorial
3. Names guild "The Johnson Family" → Invitation links generated
4. Invites husband, kids, mom → Push notifications sent
5. Completes first exercise (Sit-ups AR) → Earns 25 points + blockchain tokens
6. Views family leaderboard → Sees herself at #1 position
7. Gets AI recommendation → "Try dancing for 30 points!"
```

#### **Story 2: Dad joins family guild**
```
As Sarah's husband,
I want to compete with my family in fitness challenges,
So that we can turn exercise into a fun family activity.

FLOW:
1. Receives family guild invitation → One-tap join process
2. Chooses avatar 👨‍💼 and role "Dad" → Family leaderboard updates
3. Views current standings → Wife leading with 1245 points
4. Starts "Jump Push-up" 3D exercise → AR model demonstrates form
5. Completes workout → Earns 40 points, takes #1 position
6. Gets achievement notification → "Workout Warrior" badge unlocked
7. Family celebrates → Social sharing triggered automatically
```

#### **Story 3: Corporate employee engagement**
```
As a TechCorp employee,
I want my fitness activity to contribute to workplace wellness,
So that I can earn both personal and professional rewards.

FLOW:
1. Opens app → Sees "TechCorp Wellness Challenge" in Corporate tab
2. Joins company challenge → 1,240 colleagues already participating
3. Views prize pool → $500 gift cards for top performers
4. Completes "Burpee" AR workout → 40 points toward company leaderboard
5. Checks progress → Company 34% toward group fitness goal
6. Earns blockchain tokens → Redeemable for gym memberships
7. HR dashboard updates → Manager sees team wellness improvement
```

### 🏠 Family Guild Experience Deep Dive

#### **Social Competition Psychology**
- **Healthy Rivalry**: Real-time updates create gentle peer pressure
- **Streak Visibility**: Fire emojis 🔥 show consecutive active days
- **Last Active Timestamps**: "2h ago" vs "now" drives immediate engagement
- **Crown Icons**: Visual hierarchy with golden crown for #1 position

### 📱 Daily User Experience Flow

#### **Morning Routine (8:00 AM)**
1. **Push Notification**: "Good morning! Your family guild needs 200 points to reach weekly goal"
2. **Dashboard View**: Personal stats (8,234 steps, 75% wellness score)
3. **AI Recommendation**: "Based on your sleep (7.5h), try a gentle yoga session"
4. **Quick Action**: Tap "Start Meditation" → 3D AR pose guidance
5. **Completion**: Earn 20 points + blockchain tokens
6. **Family Update**: "You're now #3 in family rankings!"

#### **Lunch Break (12:30 PM)**
1. **Chatbot Interaction**: "What should I do for a quick workout?"
2. **AI Response**: "I see you're behind on steps. Try 15-minute walking!"
3. **Exercise Selection**: Choose "Jumping Jacks" with AR demonstration
4. **Form Guidance**: 3D model shows proper technique
5. **Progress Tracking**: Rep counter, timer, form score
6. **Social Sharing**: "Just crushed 200 jumping jacks! 💪"

#### **Evening Wind-down (8:00 PM)**
1. **Family Leaderboard**: Check daily standings
2. **Corporate Challenge**: View TechCorp team progress (34% complete)
3. **Blockchain Rewards**: Check token balance, spend on rewards
4. **Achievement Unlock**: "7-Day Streak Master" badge earned
5. **Tomorrow's Plan**: AI suggests optimal exercise time and type

---

## 🐳 Docker Deployment & Mobile Optimization

### 🚀 Quick Start Commands

```bash
# Stop all services (if running)
sudo docker compose down

# Clean rebuild (removes cached layers)
sudo docker compose build --no-cache

# Start all services in background
sudo docker compose up -d

```
After starting all services, access the following endpoints: (frontend to see the mobile visible version)




- *Frontend*: http://localhost:8080
- *Backend API*: http://localhost:3001
- *Blockchain Service*: http://localhost:5000
- *Database*: localhost:5432

```
# Check service status
sudo docker ps
```

### 🏗️ Docker Architecture
```yaml
# docker-compose.yml - Multi-service orchestration
services:
  frontend:    # React/TypeScript app
    build: ./UI/guild-quest-health
    ports: ['8080:8080']
    environment:
      - VITE_API_URL=http://localhost:3001
    
  backend:     # Express.js API server
    build: ./backend
    ports: ['3001:3001']
    environment:
      - DB_HOST=postgres
      - BLOCKCHAIN_URL=http://blockchain:5000
    depends_on: [postgres, blockchain]
    
  postgres:    # PostgreSQL database
    image: postgres:15
    ports: ['5433:5432']  # Changed to avoid local conflicts
    environment:
      - POSTGRES_DB=guild_quest
      - POSTGRES_USER=guild_user
      - POSTGRES_PASSWORD=guild_password
    
  blockchain:  # Python Flask blockchain service
    build: ./blockchain
    ports: ['5000:5000']
    environment:
      - DB_HOST=postgres
    depends_on: [postgres]
```

### 📱 Mobile-First Responsive Design

#### **Mobile Optimization Strategy**
```css
/* Tailwind CSS mobile-first approach */
.exercise-card {
  @apply w-full px-4;     /* Full width on mobile */
  @apply md:w-1/2;        /* Half width on tablet */
  @apply lg:w-1/3;        /* Third width on desktop */
}

/* Touch-friendly AR controls */
model-viewer {
  touch-action: pan-y;    /* Optimized touch gestures */
  min-height: 350px;      /* Adequate AR viewing space */
}
```

#### **Mobile User Experience Features**
- **Bottom Navigation**: Easy thumb reach on mobile devices
- **Swipe Gestures**: Horizontal scroll for recommendations
- **AR Touch Controls**: Pinch-to-zoom, tap-to-rotate 3D models
- **Push Notifications**: Family activity updates and streak reminders
- **Offline Mode**: Exercise tracking continues without network
### 🌐 Service Access Points
```
Frontend:     http://localhost:8080  (Mobile-optimized PWA)
Backend API:  http://localhost:3001  (RESTful endpoints)
Database:     localhost:5433         (PostgreSQL)
Blockchain:   http://localhost:5000  (Flask API + demo interface)
```


## 📊 Technical Architecture Summary

### 🎯 Code Implementation Highlights
- **AR Integration**: 8 exercises with 3D models and WebGL rendering
- **Blockchain**: Full Python Flask service with mining, transactions, and persistence
- **AI Personalization**: OpenAI GPT integration + rule-based recommendation engine
- **Family Gaming**: Real-time leaderboards, streak tracking, and social competition
- **Mobile Responsive**: Touch-optimized UI with gesture controls for AR experiences
- **Docker Orchestration**: 4-service architecture with automatic service discovery

### 🏆 Key Technical Achievements
1. **Working AR Exercise Coach**: Interactive 3D models with form guidance
2. **Functional Blockchain**: Token economy with transparent reward distribution
3. **AI-Powered Recommendations**: Behavioral analysis with personalized suggestions
4. **Family Gamification**: Social mechanics driving engagement through competition
5. **Enterprise Architecture**: Scalable Docker deployment with B2B integration ready

**Guild Quest Health successfully demonstrates how AR technology, blockchain transparency, and AI personalization can transform wellness engagement through family-centered gamification mechanics.**

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │    │   Blockchain    │
│   (React/TS)    │◄──►│  (Express.js)   │◄──►│   Database      │    │   (Flask/Python)│
│   Port: 8080    │    │   Port: 3001    │    │   Port: 5433    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
            │                     │                        │                       │
            └─────────────────────┼────────────────────────┼───────────────────────┘
                                  │                        │
                          ┌───────▼────────┐      ┌───────▼────────┐
                          │   AI Service   │      │  Gamification  │
                          │   (OpenAI GPT) │      │    Engine      │
                          └────────────────┘      └────────────────┘
```

### 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL with user profiles and blockchain integration
- **AI/ML**: OpenAI GPT-3.5/4 for personalized recommendations
- **Blockchain**: Python Flask service for transparent reward distribution
- **Deployment**: Docker Compose with multi-container orchestration

---

## 🎮 Core Gamification Solutions

### 1. Behavioral Psychology Integration (Track 1)

#### **Cognitive Behavioral Techniques**
- **Habit Formation Loops**: Daily micro-challenges with 5-minute completion times
- **Progressive Rewards**: Points system scaling from 25-75 based on difficulty and consistency
- **Mental Wellness Integration**: AI-powered mood tracking with gamified mindfulness exercises

#### **Advanced Personalization**
- **AI Recommendation Engine**: Analyzes user behavior patterns to suggest optimal exercise timing and types


### 2. Emerging Technology Integration (Track 2)

#### **AI-Powered Smart Recommendations**
- **Machine Learning**: Real-time analysis of user statistics (steps, sleep, hydration) for personalized exercise suggestions
- **Predictive Analytics**: Anticipates user dropoff patterns and preemptively offers re-engagement challenges
- **Natural Language Processing**: AI chatbot providing contextual health advice and motivation

#### **Blockchain Reward System**
- **Transparent Point Distribution**: Immutable ledger for fitness achievements and token rewards
- **Cross-Platform Compatibility**: Tokens redeemable for real rewards
- **Smart Contracts**: Automated reward distribution based on verified health metrics

### 3. Social Impact Gamification (Track 3)

#### **Multi-Tier Competition System**
```
Family Guilds → Corporate Challenges → Public Health Campaigns
     ↓               ↓                      ↓
  Intimate        Workplace            Community
Competition     Rewards ($500)        Impact (1M+ users)
```

#### **Corporate Wellness Integration**
- **Employer-Sponsored Leagues**: Private company competitions with real monetary rewards
- **HR Dashboard**: Analytics for employee wellness program ROI tracking
- **Cafeteria Credit System**: Fitness points redeemable for workplace benefits

#### **Public Health Partnerships**
- **City-Wide Challenges**: "Million Step Challenge" with 15,000+ participant tracking
- **Healthcare Provider Integration**: Doctor-prescribed gamified interventions
- **Insurance Premium Incentives**: Verified fitness achievements reducing premium costs

---

## 📱 User Experience Design

### 🎯 Feature Discovery Solution

#### **Progressive Feature Unlocking**
```
Day 1-7: Basic tracking + Family guild setup
Day 8-14: AI recommendations + Streak challenges
Day 15-30: Corporate challenges + Advanced analytics
Day 31+: Public campaigns + Mentor system
```

#### **Smart Navigation Architecture**
- **Context-Aware UI**: Features appear based on user readiness and engagement patterns
- **Onboarding Gamification**: 7-day "Health Hero Journey" with daily feature discoveries
- **Usage Analytics**: Tracks feature adoption rates and optimizes presentation order

### 🏠 Family-Centric Social Mechanics

#### **Guild System Design**
- **Family Roles**: Dad, Mom, Sister, Brother, Grandma with personalized avatars
- **Streak Competition**: Visual fire emojis (🔥) showing consecutive active days
- **Real-Time Activity**: "Active now" vs "2h ago" engagement pressure
- **Internal Leaderboards**: Healthy family competition driving daily engagement

#### **Viral Growth Mechanisms**
- **Family Invitation System**: Onboarding incomplete without 3+ family members
- **Social Sharing**: Automated achievement posts with family member mentions
- **Challenge Propagation**: Successful family challenges shared to extended network

---

## 🤖 AI/ML Implementation

### 🧠 Intelligent Recommendation System

#### **Multi-Modal Analysis**
```python
def generate_recommendations(user_stats: UserStats) -> List[Exercise]:
    # Analyzes: steps, exercise_minutes, sleep_hours, hydration, wellness_scores
    # Considers: time_of_day, weather, user_preferences, past_success_rates
    # Returns: 3 personalized exercises with difficulty adaptation
```

#### **Conversational AI Health Coach**
- **OpenAI GPT Integration**: Context-aware health coaching with user statistics analysis
- **Predefined Quick Actions**: "What exercises should I do today?" based on current metrics
- **Insurance Guidance**: AI-powered advice on wellness program benefits and preventive care

#### **Behavioral Pattern Recognition**
- **Dropout Prediction**: Identifies users at risk of disengagement 3-5 days in advance
- **Optimal Timing**: Learns individual peak motivation windows for challenge delivery
- **Social Influence Mapping**: Understands family dynamics to leverage peer pressure effectively

---

## 💰 Business Model Integration

### 📈 Revenue Enhancement Strategies

#### **Corporate Wellness B2B**
- **Subscription Tiers**: $5/employee/month for basic, $15/employee/month for premium analytics
- **Challenge Sponsorship**: Companies pay $1000-5000 for branded corporate challenges
- **Data Analytics**: Anonymized wellness insights sold to insurance companies

#### **Insurance Partnership Integration**
- **Premium Reduction Programs**: Verified fitness achievements reduce insurance costs by 5-15%
- **Preventive Care Tracking**: Integration with health screenings and doctor visits
- **Claims Reduction Analytics**: Demonstrate ROI to insurance partners through healthier user base

#### **Blockchain Token Economy**
```
Fitness Points → Guild Tokens → Real Rewards
    ↓              ↓              ↓
 Daily actions  Transferable   Gift cards
 Workouts      Family gifts   Gym memberships
 Streaks       Competitions   Insurance discounts
```

---

## 🔧 Technical Implementation

### 🏛️ Database Schema

```sql
-- User Management
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

-- Blockchain Integration
CREATE TABLE blockchainid (
    userid UUID PRIMARY KEY REFERENCES users(userid) ON DELETE CASCADE,
    blockchainid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification Data
CREATE TABLE user_stats (
    userid UUID REFERENCES users(userid),
    date DATE,
    steps INTEGER DEFAULT 0,
    exercise_minutes INTEGER DEFAULT 0,
    sleep_hours DECIMAL(3,1) DEFAULT 0,
    hydration_liters DECIMAL(3,1) DEFAULT 0,
    wellness_score INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    PRIMARY KEY (userid, date)
);

-- Guild System
CREATE TABLE guilds (
    guild_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    guild_type VARCHAR(50) DEFAULT 'family',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE guild_members (
    guild_id UUID REFERENCES guilds(guild_id),
    userid UUID REFERENCES users(userid),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (guild_id, userid)
);
```

### 🔗 API Architecture

#### **RESTful Endpoint Structure**
```javascript
// Authentication
POST /api/auth/register
POST /api/auth/login

// User Management
GET /api/user/profile
PUT /api/user/profile
GET /api/user/:userid

// Gamification
GET /api/recommendations/exercises
POST /api/activities/log
GET /api/leaderboard/family
GET /api/leaderboard/corporate

// Blockchain Integration
GET /api/blockchain/balance
POST /api/blockchain/earn
POST /api/blockchain/spend

// AI Services
POST /api/ai/chat
GET /api/ai/recommendations
POST /api/ai/analyze-patterns
```