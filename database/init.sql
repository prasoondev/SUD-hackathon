-- Initialize the database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    userid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blockchainid table
CREATE TABLE IF NOT EXISTS blockchainid (
    userid UUID PRIMARY KEY REFERENCES users(userid) ON DELETE CASCADE,
    blockchainid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blockchain_blocks table to store blockchain data persistently
CREATE TABLE IF NOT EXISTS blockchain_blocks (
    id SERIAL PRIMARY KEY,
    block_index INTEGER NOT NULL,
    timestamp BIGINT NOT NULL,
    proof INTEGER NOT NULL,
    previous_hash VARCHAR(64),
    block_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blockchain_transactions table to store all transactions
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id SERIAL PRIMARY KEY,
    block_id INTEGER REFERENCES blockchain_blocks(id) ON DELETE CASCADE,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_blockchainid_userid ON blockchainid(userid);
CREATE INDEX IF NOT EXISTS idx_blockchainid_blockchainid ON blockchainid(blockchainid);
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_index ON blockchain_blocks(block_index);
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_hash ON blockchain_blocks(block_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_block ON blockchain_transactions(block_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_sender ON blockchain_transactions(sender);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_recipient ON blockchain_transactions(recipient);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test user (password is "password123" hashed with bcrypt)
INSERT INTO users (email, username, password_hash, phone_number, name) 
VALUES (
    'test@example.com', 
    'testuser', 
    '$2a$10$rX8k8VGNl/6kI8xKGH9pCeLN1LqLXTU.V6kR8x9VK8JKpBcB2K8/W', 
    '+1234567890', 
    'Test User'
) ON CONFLICT DO NOTHING;

-- Create daily_objectives table
CREATE TABLE IF NOT EXISTS daily_objectives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirement INTEGER NOT NULL,
    reward_amount INTEGER NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_objective_progress table
CREATE TABLE IF NOT EXISTS user_objective_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(userid) ON DELETE CASCADE,
    objective_id INTEGER REFERENCES daily_objectives(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, objective_id, date)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirement_type VARCHAR(100) NOT NULL, -- 'feature_usage', 'steps', 'exercise', etc.
    requirement_value VARCHAR(255), -- feature name or numeric value
    reward_amount INTEGER NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(userid) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create additional indexes for gamification tables
CREATE INDEX IF NOT EXISTS idx_user_objective_progress_user_date ON user_objective_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_objective_progress_objective ON user_objective_progress(objective_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);

-- Insert default daily objectives
INSERT INTO daily_objectives (name, description, requirement, reward_amount, icon) VALUES
('Complete 10k Steps', 'Walk 10,000 steps to stay active', 10000, 50, 'footprints'),
('Exercise for 30 Minutes', 'Complete 30 minutes of exercise', 30, 75, 'dumbbell'),
('Drink 8 Glasses of Water', 'Stay hydrated by drinking 8 glasses of water', 8, 25, 'droplets'),
('Sleep 8 Hours', 'Get a good night rest with 8 hours of sleep', 8, 40, 'moon'),
('Meditate for 10 Minutes', 'Take time for mindfulness and meditation', 10, 35, 'brain')
ON CONFLICT DO NOTHING;

-- Insert default achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value, reward_amount, icon) VALUES
('First Steps', 'Try out the step tracking feature', 'feature_usage', 'step_tracking', 100, 'footprints'),
('Workout Warrior', 'Complete your first exercise session', 'feature_usage', 'exercise_tracking', 100, 'dumbbell'),
('Sleep Scholar', 'Log your first sleep session', 'feature_usage', 'sleep_tracking', 100, 'moon'),
('Hydration Hero', 'Track your first water intake', 'feature_usage', 'water_tracking', 100, 'droplets'),
('Mindful Master', 'Complete your first meditation session', 'feature_usage', 'meditation', 100, 'brain'),
('Step Master', 'Walk 100,000 total steps', 'total_steps', '100000', 500, 'footprints'),
('Exercise Expert', 'Complete 50 exercise sessions', 'total_exercises', '50', 500, 'dumbbell'),
('Consistency King', 'Complete daily objectives for 7 days in a row', 'streak', '7', 1000, 'sparkles')
ON CONFLICT DO NOTHING;