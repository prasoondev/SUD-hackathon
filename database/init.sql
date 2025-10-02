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