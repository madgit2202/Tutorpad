# Supabase Row Level Security (RLS) Policies

This script creates the RLS policies that define who can access and modify the data in each table. This is the core of your application's security and multi-tenancy.

The default is `DENY`, so these policies explicitly grant specific permissions to authenticated users.

```sql
--
-- TutorPanel RLS Policies for Supabase
--
-- These policies control data access for authenticated tutors.
-- The default is DENY, so these policies grant specific permissions.
--

-- 1. POLICIES FOR `profiles` TABLE
-- Tutors can view their own profile.
CREATE POLICY "Tutors can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Tutors can update their own profile.
CREATE POLICY "Tutors can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 2. POLICIES FOR `tutor_subject_assignments` TABLE
-- Tutors can only see their own subject assignments.
CREATE POLICY "Tutors can view their own assignments."
  ON public.tutor_subject_assignments FOR SELECT
  USING (auth.uid() = user_id);
-- NOTE: INSERT/DELETE for this table should be handled by a secure backend function
-- (e.g., a Supabase Edge Function) called during signup or by an admin role.
-- Tutors should not be able to assign themselves subjects.


-- 3. POLICIES FOR CONTENT TABLES (`courses`, `terms`, `subjects`, etc.)
-- This is the key for dynamic content. A tutor can only see content
-- if they are assigned to the subject it belongs to.

-- Tutors can view subjects they are assigned to.
CREATE POLICY "Tutors can view their assigned subjects."
  ON public.subjects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutor_subject_assignments
      WHERE subject_id = public.subjects.id AND user_id = auth.uid()
    )
  );

-- Tutors can view terms that contain their assigned subjects.
CREATE POLICY "Tutors can view terms containing their subjects."
  ON public.terms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects s
      JOIN public.tutor_subject_assignments tsa ON s.id = tsa.subject_id
      WHERE s.term_id = public.terms.id AND tsa.user_id = auth.uid()
    )
  );

-- Tutors can view courses that contain their assigned subjects.
CREATE POLICY "Tutors can view courses containing their subjects."
  ON public.courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.terms t
      JOIN public.subjects s ON t.id = s.term_id
      JOIN public.tutor_subject_assignments tsa ON s.id = tsa.subject_id
      WHERE t.course_id = public.courses.id AND tsa.user_id = auth.uid()
    )
  );

-- Tutors can view units belonging to their assigned subjects.
CREATE POLICY "Tutors can view units in their assigned subjects."
  ON public.units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutor_subject_assignments
      WHERE subject_id = public.units.subject_id AND user_id = auth.uid()
    )
  );

-- Tutors can view chapters belonging to their assigned subjects.
CREATE POLICY "Tutors can view chapters in their assigned subjects."
  ON public.chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.tutor_subject_assignments tsa ON u.subject_id = tsa.subject_id
      WHERE u.id = public.chapters.unit_id AND tsa.user_id = auth.uid()
    )
  );

-- Tutors can view topics belonging to their assigned subjects.
CREATE POLICY "Tutors can view topics in their assigned subjects."
  ON public.topics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chapters c
      JOIN public.units u ON c.unit_id = u.id
      JOIN public.tutor_subject_assignments tsa ON u.subject_id = tsa.subject_id
      WHERE c.id = public.topics.chapter_id AND tsa.user_id = auth.uid()
    )
  );

-- NOTE: By default, authenticated users should NOT have INSERT, UPDATE, or DELETE
-- permissions on the content tables. This should be managed by an admin role.

-- 4. POLICIES FOR `three_d_models` TABLE
-- We will assume all authenticated users can view all 3D models.
CREATE POLICY "Authenticated tutors can view all 3D models."
  ON public.three_d_models FOR SELECT
  USING (auth.role() = 'authenticated');
-- NOTE: INSERT/UPDATE/DELETE should be handled by an admin role.

```
