# TutorPad Production Implementation Plan

This document outlines the technical plan to evolve the TutorPad frontend prototype into a full-stack, production-ready application using Supabase as the backend.

## 1. Tech Stack

-   **Frontend**:
    -   Framework: **React**
    -   UI Libraries: **tldraw** (for AI Board), **recharts** (for simulators)
    -   Styling: **CSS with CSS Variables** for theming.
-   **Backend (BaaS)**:
    -   Provider: **Supabase**
    -   Database: **PostgreSQL**
    -   Authentication: **Supabase Auth**
    -   Serverless Functions: **Supabase Edge Functions** (for secure API calls)
-   **AI Services**:
    -   Provider: **Google Gemini API** (`@google/genai`)
-   **Build & Deployment**:
    -   Build Tool: **Vite** (Recommended for its speed and modern tooling)
    -   Hosting: **Vercel** or **Netlify** or **firebase**for the frontend, Supabase for the backend.

## 2. Architecture

The application will follow a decoupled Jamstack architecture, with a static frontend client communicating with a Supabase backend.

 <!-- Placeholder for a diagram -->

### Frontend

-   A Single Page Application (SPA) built with React.
-   It will be responsible for all UI rendering and client-side state management.
-   It will interact with the backend exclusively through the `supabase-js` client library.
-   The frontend will not contain any sensitive credentials or secret API keys.

### Backend (Supabase)

-   **Database**: The single source of truth for all data, including users, courses, subjects, assignments, and 3D models. The schema is defined in `supabasedb.md`.
-   **Authentication**: Supabase Auth will manage user registration, login (email/password), and session management via JWTs.
-   **API**: Supabase provides a secure, auto-generated RESTful API over the PostgreSQL database. The Row Level Security (RLS) policies defined in `supabaserls.md` will ensure that users can only access the data they are permitted to.
-   **Edge Functions**: Deno-based serverless functions will be used as a secure proxy for all calls to the Google Gemini API. This is critical for protecting the `API_KEY`.

### Data Flow

1.  A tutor signs up or logs in via the React frontend. The frontend calls the appropriate Supabase Auth method.
2.  Supabase returns a secure JWT, which is stored in the browser.
3.  For all subsequent API requests (e.g., fetching courses), the `supabase-js` client automatically includes this JWT.
4.  Supabase RLS policies inspect the JWT to identify the user and filter database queries accordingly, returning only the data that user is authorized to see.
5.  When a tutor uses an AI feature (e.g., "Describe Image"), the frontend sends the request to a Supabase Edge Function.
6.  The Edge Function, running in a secure server environment, uses the stored Google GenAI API key to call the Gemini API and returns the result to the frontend.

## 3. Constraints & Requirements

-   **Security**: The Google GenAI `API_KEY` **must not** be exposed on the client. It must be stored as a secret in Supabase and only used by Edge Functions. All database access must be governed by strict Row Level Security policies.
-   **Scalability**: The serverless nature of Supabase and Vercel/Netlify allows the application to scale automatically based on traffic.
-   **Performance**: The frontend code must be bundled and minified using a build tool like Vite to ensure fast initial load times.

## 4. Implementation Details

### Data Modeling

-   The complete PostgreSQL schema is defined in `supabasedb.md`. This schema should be implemented first using the Supabase SQL Editor.

### Authentication Flow

1.  **Signup**: The `SignupPage` form submission will call `supabase.auth.signUp()`. A Supabase database function (or trigger) will then be created to automatically insert a new row into the `public.profiles` table upon user creation. The subject selections will be inserted into the `tutor_subject_assignments` table.
2.  **Login**: The `LoginPage` will call `supabase.auth.signInWithPassword()`.
3.  **Session Management**: The root `App.tsx` component will use Supabase's `onAuthStateChange` listener to manage the global user session state, replacing the current `useState` logic.

### API Integration

-   **Tutorpanel**: The hardcoded `coursesData` array will be removed. Instead, a `useEffect` hook will fetch data from Supabase (e.g., `supabase.from('courses').select('*, terms(*, subjects(*))')`). RLS will automatically ensure only the logged-in tutor's data is returned.
-   **3D Gallery**: The simulated fetch in `ThreeDGallery.tsx` will be replaced with a real call to `supabase.from('three_d_models').select('*')`.
-   **User Progress**: The `last_viewed_topic_id` will be saved to the `profiles` table on the database instead of `localStorage`.

### Secure AI Calls (Edge Functions)

-   Create a Supabase Edge Function for each AI task (e.g., `describe-image`, `generate-image`).
-   Store the `process.env.API_KEY` as a secret in the Supabase dashboard (`Project Settings` > `Edge Functions`).
-   Refactor `AiBoard.tsx` to call these Edge Functions using `supabase.functions.invoke()` instead of calling the Gemini API directly.

### Build and Deployment

1.  Initialize a build tool like **Vite** in the project.
2.  Configure environment variables for Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) in the chosen hosting provider (e.g., Vercel).
3.  Set up a CI/CD pipeline (e.g., via GitHub integration with Vercel) to automatically build and deploy the frontend on every push to the `main` branch.

## 5. Future Considerations

-   **Admin Role**: An `admin` role can be added to the user system. RLS policies would be updated to grant admins full access to content tables, and a separate admin dashboard could be built for managing courses, subjects, and users.
-   **Student Role**: A `student` role could be introduced with read-only access to courses they are enrolled in, with their own progress tracking tables.
-   **Supabase Storage**: User-uploaded images or course materials can be stored securely using Supabase Storage, integrating with RLS for access control.
