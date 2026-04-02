-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories (user_id IS NULL = system default, non-null = user custom)
CREATE TABLE IF NOT EXISTS categories (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name    VARCHAR(100) NOT NULL,
  type    VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  UNIQUE(user_id, name, type)
);

-- Allow NULL user_id uniqueness alongside non-null (partial index approach)
CREATE UNIQUE INDEX IF NOT EXISTS categories_system_unique
  ON categories (name, type)
  WHERE user_id IS NULL;

-- Transactions with soft delete via deleted_at
CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  type             VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount           NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category_id      UUID NOT NULL REFERENCES categories(id),
  description      TEXT NOT NULL,
  reference_number VARCHAR(100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, date)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_user_type
  ON transactions(user_id, type)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_duplicate
  ON transactions(user_id, date, amount, description)
  WHERE deleted_at IS NULL;
