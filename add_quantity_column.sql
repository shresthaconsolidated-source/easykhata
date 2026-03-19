-- Run this in your Supabase SQL Editor to enable quantity tracking
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS quantity DECIMAL(15, 2) DEFAULT 1;
