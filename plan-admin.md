# TutorPad Admin Application: Implementation Plan

This document outlines the technical plan for building a comprehensive, secure, and separate administration application for the TutorPad platform. This application will serve as the central control panel for managing users, content, and other academic modules, directly updating the data consumed by the main TutorPad application.

## 1. Tech Stack

The technology stack will be kept consistent with the main TutorPad application to ensure maintainability, while introducing tools specifically suited for a data-intensive admin dashboard.

-   **Frontend**:
    -   **Framework**: **React (with Vite)** using **TypeScript** for robust, type-safe development.
    -   **UI Component Library**: **Material-UI (MUI)**. This will be adopted for its extensive set of pre-built, production-ready components (data grids, forms, modals, date pickers) which are essential for rapidly developing a functional admin interface.
    -   **Rich Text Editor**: **TinyMCE**, via its official React integration, to provide a powerful content editing experience for course materials (notes/topics).
    -   **State Management**: **Zustand** or **React Context** for simple, effective global state management (e.g., current admin user session).
    -   **Client-Side Routing**: **React Router** for managing navigation between different admin sections.

-   **Backend (BaaS)**:
    -   **Provider**: **Supabase**. We will use the *same* Supabase project as the main TutorPad application to ensure data consistency.
    -   **Database**: **PostgreSQL**.
    -   **Authentication**: **Supabase Auth** for handling admin user login.
    -   **API & Security**: **Supabase PostgREST API** governed by role-specific **Row Level Security (RLS)** policies.

-   **Deployment**:
    -   **Frontend Hosting**: **Vercel** or **Netlify**, deployed as a separate project on a subdomain (e.g., `admin.tutorpad.com`).
    -   **CI/CD**: Git-based integration with the hosting provider for automated builds and deployments.

## 2. Architecture

The admin application will be a distinct frontend client that communicates with the existing Supabase backend, but with elevated permissions granted via a robust Role-Based Access Control (RBAC) system.

-   **Decoupled Frontend**: The admin app is a completely separate Single Page Application (SPA). This separation ensures that the admin-specific code and dependencies do not bloat the main student/tutor application.

-   **Shared Backend & Database**: Both the main app and the admin app will connect to the same Supabase project. This is critical for maintaining a single source of truth for all data. Changes made in the admin panel (e.g., updating a topic's content) will be immediately reflected in the main TutorPad application.

-   **Role-Based Access Control (RBAC)**: This is the cornerstone of the admin app's security architecture.
    -   **Admin Role**: A specific `admin` role will be defined. Only users with this role can access the full functionality of the admin dashboard.
    -   **Granular RLS Policies**: New RLS policies will be created to grant `INSERT`, `UPDATE`, and `DELETE` permissions to users with the `admin` role. Existing policies will be reviewed to ensure they don't conflict.
    -   **Limited Tutor Access**: Tutors will be able to log in to a limited version of this admin panel (e.g., only seeing the "Attendance" module) with RLS policies restricting them to only manage attendance for their assigned subjects and students.

### Data Flow Diagram

```
[ Admin User ] --logs in--> [ React Admin App (admin.tutorpad.com) ]
       |                                     |
       | <---JWT Token-----                   |
       |                                     | (Supabase JS Client)
       | <---UI Components---                 |
       |                                     |
       V                                     V
[ Supabase Backend ] <--------------------- [ API Request w/ JWT ]
       |
       | 1. Supabase Auth: Validates JWT
       | 2. RLS Policy: Checks user's role (e.g., is 'admin'?)
       | 3. PostgreSQL: Executes query (SELECT, INSERT, UPDATE, DELETE)
       | 4. RLS Policy: Filters/Allows results
       |
       V
[ Returns Data to Admin App ]
```

## 3. Constraints & Requirements

-   **Security**: The highest priority. Access to the admin application must be strictly limited to authorized personnel. RLS policies must be airtight to prevent unauthorized data modification or access.
-   **Data Integrity**: The system must enforce data consistency. For example, a `term` cannot be created without being linked to a `course`. This will be enforced at the database level with foreign key constraints.
-   **Usability**: The admin UI must be efficient and intuitive for managing large amounts of data. This includes features like searching, sorting, filtering, and pagination for all data tables.
-   **Audit Trail (Future Consideration)**: For enhanced security and accountability, a future version should include an audit trail (e.g., a `logs` table) to record significant actions performed by admins (e.g., "Admin X deleted Course Y at Z time").

## 4. Implementation Details

### Data Modeling & Schema Additions

The existing database schema will be extended to support the new features. The following tables will be added via a new SQL script in the Supabase SQL Editor.

```sql
-- Adds support for multiple user roles.
-- A custom function will be needed to check a user's role in RLS policies.
CREATE TABLE public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'tutor', 'student', 'librarian'))
);

-- Adds support for the Attendance module.
CREATE TABLE public.attendance (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by_tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_id, date) -- Prevent duplicate entries for the same student on the same day.
);

-- Adds support for the Library Management module.
CREATE TABLE public.library_books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT UNIQUE,
  total_copies INTEGER NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
  available_copies INTEGER NOT NULL DEFAULT 1 CHECK (available_copies >= 0)
);

CREATE TABLE public.library_borrows (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES public.library_books(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrow_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ
);

-- Adds support for the Academic Management module.
CREATE TABLE public.academic_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- e.g., 'Holiday', 'Exam', 'Notification'
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by_admin_id UUID REFERENCES public.profiles(id)
);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_borrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_events ENABLE ROW LEVEL SECURITY;
```

### New RLS Policies & Helper Function

A helper function is needed to easily check a user's role in RLS policies.

```sql
-- Helper function to get the role of the currently logged-in user.
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

New RLS policies will grant broad access to admins and specific, limited access to other roles like tutors.

-   **Admin Policies**: Admins will have policies granting them `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all content tables (`courses`, `subjects`, etc.) and all new tables (`attendance`, `library_books`, etc.) using `get_my_role() = 'admin'`.
-   **Tutor Policies (for Attendance)**: Tutors will have a specific policy allowing `SELECT` and `INSERT` on the `attendance` table, but *only* for subjects they are assigned to via the `tutor_subject_assignments` table.
-   **Public Read Policies**: Policies on tables like `academic_events` can be set to allow all authenticated users to read (`SELECT`), but only admins to write (`INSERT`, `UPDATE`, `DELETE`).

### Frontend Development Plan

1.  **Project Setup**: Initialize a new React/Vite project and install MUI and other dependencies.
2.  **Auth Guard**: Implement a protected routing system. A parent component will check the user's role upon login using the helper function above. If the role is not `admin` or `tutor`, the user is redirected away.
3.  **Layout**: Create a main admin layout with a persistent sidebar (using MUI's `Drawer`) for navigation and a main content area.
4.  **Content Management**:
    -   Build a hierarchical view to manage Courses > Terms > Subjects > Units > Chapters > Topics.
    -   Implement CRUD (Create, Read, Update, Delete) forms using MUI `Dialog` components for each level.
    -   The "Topic" form will embed the **TinyMCE editor** for the `content` body.
    -   The "3D Content" will be managed through the `three_d_models` table, with a form to add/edit model details including the embed URL.
5.  **User Management**:
    -   Create an MUI `DataGrid` view of all users from the `profiles` table.
    -   Implement functionality to edit user details and assign/change their role in the `user_roles` table.
6.  **Attendance Module**:
    -   Create a UI for tutors to select a date and one of their assigned subjects.
    -   Display a list of students enrolled in that subject, with options to mark their attendance status. Admins will be able to view attendance for all subjects.
7.  **Library & Academic Modules**:
    -   Develop standard CRUD interfaces using MUI `DataGrid` and `Dialog` forms for managing books, academic events, and notifications.
    -   The library module will also include a view to manage borrowing records (`library_borrows`).
