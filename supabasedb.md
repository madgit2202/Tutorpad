# Supabase Database Schema

This script sets up all the necessary tables for the TutorPad application, defines their columns, and establishes relationships using primary and foreign keys. Row Level Security (RLS) is enabled on all tables by default, which is a critical security measure.

This script is designed to be run directly in the Supabase SQL Editor (`Database` > `SQL Editor`).

```sql
--
-- TutorPanel Production Schema for Supabase
--
-- This script sets up the tables for users, content hierarchy,
-- tutor assignments, and 3D models.
--

-- 1. PROFILES TABLE
-- Stores public user data. This is linked to Supabase's internal `auth.users` table.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_topic_id VARCHAR, -- Nullable, will be a FK after topics table is created

  CONSTRAINT full_name_length CHECK (char_length(full_name) >= 3)
);

-- 2. COURSES TABLE
-- Top-level category for educational content.
CREATE TABLE public.courses (
  id TEXT PRIMARY KEY, -- Using a text slug like 'bsc-nursing' for clean URLs
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TERMS TABLE
-- Represents semesters or years within a course.
CREATE TABLE public.terms (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBJECTS TABLE
-- Represents subjects taught within a term.
CREATE TABLE public.subjects (
  id SERIAL PRIMARY KEY,
  term_id INTEGER NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TUTOR SUBJECT ASSIGNMENTS (JUNCTION TABLE)
-- The key table linking tutors to the subjects they teach.
CREATE TABLE public.tutor_subject_assignments (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, subject_id) -- Ensures a tutor can't be assigned to the same subject twice
);

-- 6. UNITS, CHAPTERS, AND TOPICS TABLES
-- The detailed content hierarchy.
CREATE TABLE public.units (
  id VARCHAR PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chapters (
  id VARCHAR PRIMARY KEY,
  unit_id VARCHAR NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.topics (
  id VARCHAR PRIMARY KEY,
  chapter_id VARCHAR NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT, -- Can store HTML content
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADD FOREIGN KEY CONSTRAINT FOR last_viewed_topic_id
-- Now that the topics table exists, we can add the foreign key constraint.
ALTER TABLE public.profiles
ADD CONSTRAINT fk_last_viewed_topic
FOREIGN KEY (last_viewed_topic_id)
REFERENCES public.topics(id) ON DELETE SET NULL;


-- 8. 3D MODELS TABLE
-- Standalone table for the 3D Gallery content.
CREATE TABLE public.three_d_models (
  id VARCHAR PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  color_class VARCHAR(50),
  embed_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 9. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- This is a security best practice. By default, no one can access the data.
-- We will define specific access rules in Part 2.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.three_d_models ENABLE ROW LEVEL SECURITY;
```
