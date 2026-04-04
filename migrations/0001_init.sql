-- AI Humanizer Database Schema
-- Migration: 0001_init.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  plan TEXT DEFAULT 'free',
  pro_expires_at INTEGER,
  trial_used INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  ip TEXT,
  date TEXT NOT NULL,
  char_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date),
  UNIQUE(ip, date)
);

CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  char_count INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  paypal_sub_id TEXT,
  status TEXT,
  plan_type TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  expires_at INTEGER
);
