const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL || 'http://localhost:5000';

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'guild_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'guild_quest',
  password: process.env.DB_PASSWORD || 'guild_password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Blockchain integration functions
const createBlockchainUser = async () => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_URL}/user/new`);
    return response.data.user_id;
  } catch (error) {
    console.error('Error creating blockchain user:', error.message);
    // Fallback to temporary ID if blockchain service is unavailable
    return 'temp_blockchain_id_' + Date.now();
  }
};

const getOrCreateBlockchainId = async (userid) => {
  try {
    // Check if user already has a blockchain ID
    const result = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [userid]);
    
    if (result.rows.length > 0) {
      return result.rows[0].blockchainid;
    }
    
    // Create new blockchain user
    const blockchainId = await createBlockchainUser();
    
    // Store the mapping
    await pool.query(
      'INSERT INTO blockchainid (userid, blockchainid) VALUES ($1, $2)',
      [userid, blockchainId]
    );
    
    return blockchainId;
  } catch (error) {
    console.error('Error managing blockchain ID:', error);
    throw error;
  }
};

const getBlockchainBalance = async (blockchainId) => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_URL}/rewards/balance?user_id=${blockchainId}`);
    return response.data.balance;
  } catch (error) {
    console.error('Error getting blockchain balance:', error.message);
    return 0; // Return 0 if blockchain service is unavailable
  }
};

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 1, max: 100 }).trim(),
  body('phone_number').isMobilePhone(),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Register user
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation errors', details: errors.array() });
    }

    const { name, username, email, phone_number, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash, phone_number, name) VALUES ($1, $2, $3, $4, $5) RETURNING userid, email, username, phone_number, name, created_at',
      [email, username, password_hash, phone_number, name]
    );

    const user = result.rows[0];

    // Create blockchain ID for the new user
    const blockchainId = await getOrCreateBlockchainId(user.userid);

    // Generate JWT token
    const token = jwt.sign(
      { userid: user.userid, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user,
      token: token,
      blockchain_id: blockchainId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation errors', details: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Get or create blockchain ID for the user
    let blockchainId;
    let balance = 0;
    try {
      blockchainId = await getOrCreateBlockchainId(user.userid);
      balance = await getBlockchainBalance(blockchainId);
    } catch (blockchainError) {
      console.error('Blockchain integration error:', blockchainError);
      // Continue with login even if blockchain fails
      blockchainId = null;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userid: user.userid, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production',
      { expiresIn: '24h' }
    );

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: token,
      blockchain: {
        id: blockchainId,
        balance: balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT userid, email, username, phone_number, name, created_at, updated_at FROM users WHERE userid = $1',
      [req.user.userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, [
  body('username').optional().isLength({ min: 3, max: 30 }).trim(),
  body('name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('phone_number').optional().isMobilePhone(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation errors', details: errors.array() });
    }

    const { username, name, phone_number } = req.body;
    const updates = {};
    const values = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.username = `$${paramCount}`;
      values.push(username);
      paramCount++;
    }
    if (name !== undefined) {
      updates.name = `$${paramCount}`;
      values.push(name);
      paramCount++;
    }
    if (phone_number !== undefined) {
      updates.phone_number = `$${paramCount}`;
      values.push(phone_number);
      paramCount++;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ${updates[key]}`).join(', ');
    values.push(req.user.userid);

    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE userid = $${paramCount} RETURNING userid, email, username, phone_number, name, created_at, updated_at`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get user by ID (for testing)
app.get('/api/user/:userid', async (req, res) => {
  try {
    const { userid } = req.params;

    const result = await pool.query(
      'SELECT userid, email, username, phone_number, name, created_at FROM users WHERE userid = $1',
      [userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blockchain-related endpoints

// Get user's blockchain balance
app.get('/api/blockchain/balance', authenticateToken, async (req, res) => {
  try {
    const blockchainResult = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [req.user.userid]);
    
    if (blockchainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blockchain ID not found' });
    }

    const blockchainId = blockchainResult.rows[0].blockchainid;
    const balance = await getBlockchainBalance(blockchainId);

    res.json({
      success: true,
      blockchain_id: blockchainId,
      balance: balance
    });
  } catch (error) {
    console.error('Get blockchain balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Earn rewards (add tokens to user's blockchain account)
app.post('/api/blockchain/earn', authenticateToken, [
  body('amount').isNumeric().isFloat({ min: 0.1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation errors', details: errors.array() });
    }

    const { amount } = req.body;
    
    const blockchainResult = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [req.user.userid]);
    
    if (blockchainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blockchain ID not found' });
    }

    const blockchainId = blockchainResult.rows[0].blockchainid;
    
    // Call blockchain service to earn rewards
    const response = await axios.post(`${BLOCKCHAIN_URL}/rewards/earn`, {
      user_id: blockchainId,
      amount: amount
    });

    res.json({
      success: true,
      message: response.data.message,
      new_balance: response.data.balance
    });
  } catch (error) {
    console.error('Earn rewards error:', error);
    if (error.response) {
      res.status(400).json({ error: error.response.data.error || 'Blockchain operation failed' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Spend rewards (remove tokens from user's blockchain account)
app.post('/api/blockchain/spend', authenticateToken, [
  body('item').notEmpty().trim(),
  body('cost').isNumeric().isFloat({ min: 0.1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation errors', details: errors.array() });
    }

    const { item, cost } = req.body;
    
    const blockchainResult = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [req.user.userid]);
    
    if (blockchainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blockchain ID not found' });
    }

    const blockchainId = blockchainResult.rows[0].blockchainid;
    
    // Call blockchain service to spend rewards
    const response = await axios.post(`${BLOCKCHAIN_URL}/rewards/spend`, {
      user_id: blockchainId,
      item: item,
      cost: cost
    });

    res.json({
      success: true,
      message: response.data.message,
      new_balance: response.data.balance
    });
  } catch (error) {
    console.error('Spend rewards error:', error);
    if (error.response) {
      res.status(400).json({ error: error.response.data.error || 'Blockchain operation failed' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get blockchain info and status
app.get('/api/blockchain/info', async (req, res) => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_URL}/`);
    res.json({
      success: true,
      blockchain_service: response.data
    });
  } catch (error) {
    console.error('Blockchain info error:', error);
    res.status(500).json({ error: 'Blockchain service unavailable' });
  }
});

// Get full blockchain chain (for debugging)
app.get('/api/blockchain/chain', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_URL}/chain`);
    res.json({
      success: true,
      chain: response.data
    });
  } catch (error) {
    console.error('Get blockchain chain error:', error);
    res.status(500).json({ error: 'Blockchain service unavailable' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
// Daily Objectives endpoints

// Get user's daily objectives
app.get('/api/objectives/daily', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;
    const today = new Date().toISOString().split('T')[0];

    // Get all active daily objectives with user progress
    const result = await pool.query(`
      SELECT 
        obj.id,
        obj.name,
        obj.description,
        obj.requirement,
        obj.reward_amount,
        obj.icon,
        COALESCE(prog.current_progress, 0) as current_progress,
        COALESCE(prog.is_completed, false) as is_completed,
        CASE 
          WHEN prog.is_completed = true AND prog.completed_at IS NULL THEN true
          ELSE false
        END as can_claim
      FROM daily_objectives obj
      LEFT JOIN user_objective_progress prog ON obj.id = prog.objective_id 
        AND prog.user_id = $1 AND prog.date = $2
      WHERE obj.is_active = true
      ORDER BY obj.id
    `, [userId, today]);

    res.json({
      success: true,
      objectives: result.rows
    });
  } catch (error) {
    console.error('Get daily objectives error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim daily objective reward
app.post('/api/objectives/claim/:objectiveId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;
    const objectiveId = parseInt(req.params.objectiveId);
    const today = new Date().toISOString().split('T')[0];

    // Get blockchain ID
    const blockchainResult = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [userId]);
    if (blockchainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blockchain ID not found' });
    }
    const blockchainId = blockchainResult.rows[0].blockchainid;

    // Check if objective is completed and can be claimed
    const progressResult = await pool.query(`
      SELECT prog.*, obj.reward_amount 
      FROM user_objective_progress prog
      JOIN daily_objectives obj ON prog.objective_id = obj.id
      WHERE prog.user_id = $1 AND prog.objective_id = $2 AND prog.date = $3
        AND prog.is_completed = true AND prog.completed_at IS NULL
    `, [userId, objectiveId, today]);

    if (progressResult.rows.length === 0) {
      return res.status(400).json({ error: 'Objective not completed or already claimed' });
    }

    const objective = progressResult.rows[0];

    // Award blockchain tokens
    const response = await axios.post(`${BLOCKCHAIN_URL}/rewards/earn`, {
      user_id: blockchainId,
      amount: objective.reward_amount
    });

    // Mark as claimed
    await pool.query(`
      UPDATE user_objective_progress 
      SET completed_at = NOW() 
      WHERE user_id = $1 AND objective_id = $2 AND date = $3
    `, [userId, objectiveId, today]);

    res.json({
      success: true,
      message: `Claimed ${objective.reward_amount} coins!`,
      new_balance: response.data.balance
    });
  } catch (error) {
    console.error('Claim objective reward error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update objective progress
app.post('/api/objectives/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;
    const { objectiveId, progress } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Get objective requirement
    const objectiveResult = await pool.query('SELECT requirement FROM daily_objectives WHERE id = $1', [objectiveId]);
    if (objectiveResult.rows.length === 0) {
      return res.status(404).json({ error: 'Objective not found' });
    }
    const requirement = objectiveResult.rows[0].requirement;

    // Update or insert progress
    const isCompleted = progress >= requirement;
    await pool.query(`
      INSERT INTO user_objective_progress (user_id, objective_id, current_progress, is_completed, date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, objective_id, date)
      DO UPDATE SET 
        current_progress = GREATEST(user_objective_progress.current_progress, $3),
        is_completed = $4 OR user_objective_progress.is_completed
    `, [userId, objectiveId, progress, isCompleted, today]);

    res.json({ success: true });
  } catch (error) {
    console.error('Update objective progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Achievements endpoints

// Get user's achievements
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;

    // Get all achievements with user unlock status
    const result = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.description,
        a.requirement_type,
        a.requirement_value,
        a.reward_amount,
        a.icon,
        CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as is_unlocked,
        CASE 
          WHEN ua.id IS NOT NULL AND ua.unlocked_at IS NULL THEN true
          ELSE false
        END as can_claim
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      WHERE a.is_active = true
      ORDER BY is_unlocked DESC, a.id
    `, [userId]);

    res.json({
      success: true,
      achievements: result.rows
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlock achievement
app.post('/api/achievements/unlock/:achievementId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;
    const achievementId = parseInt(req.params.achievementId);

    // Check if already unlocked
    const existingResult = await pool.query(
      'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Achievement already unlocked' });
    }

    // Unlock achievement (without claiming reward yet)
    await pool.query(
      'INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES ($1, $2, NULL)',
      [userId, achievementId]
    );

    res.json({ success: true, message: 'Achievement unlocked!' });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim achievement reward
app.post('/api/achievements/claim/:achievementId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userid;
    const achievementId = parseInt(req.params.achievementId);

    // Get blockchain ID
    const blockchainResult = await pool.query('SELECT blockchainid FROM blockchainid WHERE userid = $1', [userId]);
    if (blockchainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blockchain ID not found' });
    }
    const blockchainId = blockchainResult.rows[0].blockchainid;

    // Check if achievement is unlocked and can be claimed
    const achievementResult = await pool.query(`
      SELECT ua.*, a.reward_amount 
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1 AND ua.achievement_id = $2 AND ua.unlocked_at IS NULL
    `, [userId, achievementId]);

    if (achievementResult.rows.length === 0) {
      return res.status(400).json({ error: 'Achievement not unlocked or already claimed' });
    }

    const achievement = achievementResult.rows[0];

    // Award blockchain tokens
    const response = await axios.post(`${BLOCKCHAIN_URL}/rewards/earn`, {
      user_id: blockchainId,
      amount: achievement.reward_amount
    });

    // Mark as claimed
    await pool.query(
      'UPDATE user_achievements SET unlocked_at = NOW() WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );

    res.json({
      success: true,
      message: `Claimed ${achievement.reward_amount} coins!`,
      new_balance: response.data.balance
    });
  } catch (error) {
    console.error('Claim achievement reward error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});