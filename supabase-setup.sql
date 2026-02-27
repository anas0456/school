-- =====================================================
-- SUPABASE SQL FOR USER AUTHENTICATION
-- Copy this to your Supabase SQL Editor
-- =====================================================

-- Option 1: If the table already exists, add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Teacher specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_years TEXT;

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  grade TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create homework table
CREATE TABLE IF NOT EXISTS homework (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create news table for announcements
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for courses
DROP POLICY IF EXISTS "Allow select courses" ON courses;
CREATE POLICY "Allow select courses" ON courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert courses" ON courses;
CREATE POLICY "Allow insert courses" ON courses FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update courses" ON courses;
CREATE POLICY "Allow update courses" ON courses FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow delete courses" ON courses;
CREATE POLICY "Allow delete courses" ON courses FOR DELETE USING (true);

-- Create policies for homework
DROP POLICY IF EXISTS "Allow select homework" ON homework;
CREATE POLICY "Allow select homework" ON homework FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert homework" ON homework;
CREATE POLICY "Allow insert homework" ON homework FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update homework" ON homework;
CREATE POLICY "Allow update homework" ON homework FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow delete homework" ON homework;
CREATE POLICY "Allow delete homework" ON homework FOR DELETE USING (true);

-- Create policies for news
DROP POLICY IF EXISTS "Allow select news" ON news;
CREATE POLICY "Allow select news" ON news FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert news" ON news;
CREATE POLICY "Allow insert news" ON news FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update news" ON news;
CREATE POLICY "Allow update news" ON news FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow delete news" ON news;
CREATE POLICY "Allow delete news" ON news FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_teacher ON homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_course ON homework(course_id);

-- Insert admin user
INSERT INTO users (email, password, name, role) 
VALUES ('admin@janatualatfal.com', 'admin123', 'مدير النظام', 'admin')
ON CONFLICT (email) DO NOTHING;
