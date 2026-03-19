-- Run this in your Supabase SQL Editor to fix the category creation error
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color TEXT;
