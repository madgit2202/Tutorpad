# Production Implementation Steps: Frontend to Supabase

This guide provides a detailed, step-by-step process to connect the existing TutorPad frontend prototype with a secure and scalable Supabase backend, making it a production-ready application.

---

### Prerequisites

1.  **Node.js and npm**: Ensure you have a recent version of Node.js installed.
2.  **Supabase Account**: [Create a free account on Supabase](https://supabase.com/).
3.  **Git**: Basic knowledge of Git for version control.
4.  **Google AI API Key**: Have your Gemini API key ready.

---

## Step 1: Set Up the Supabase Project

First, we'll prepare the entire backend infrastructure.

1.  **Create a New Project**:
    *   Go to your Supabase Dashboard and click "New Project".
    *   Give it a name (e.g., `tutorpad-prod`) and generate a secure database password.
    *   Choose a region and wait for the project to be provisioned.

2.  **Get API Credentials**:
    *   Once your project is ready, navigate to **Project Settings** > **API**.
    *   Copy your **Project URL** and the `public` **anon key**. Keep these safe; we'll need them for the frontend.

3.  **Run Database Schema SQL**:
    *   In the Supabase Dashboard, go to the **SQL Editor**.
    *   Open the `supabasedb.md` file from this project.
    *   Copy the entire SQL script from that file.
    *   Paste it into the Supabase SQL Editor and click **"RUN"**. This will create all your tables and relationships.

4.  **Run RLS Policies SQL**:
    *   In the **SQL Editor**, click **"+ New query"**.
    *   Open the `supabaserls.md` file from this project.
    *   Copy the entire SQL script and run it. This enables Row Level Security and applies all the necessary access rules.

5.  **Add Initial Content (Optional but Recommended)**:
    *   To see content in your app, you need to add some data. Go to the **Table Editor**.
    *   Manually add a few rows to the `courses`, `terms`, `subjects`, `units`, `chapters`, and `topics` tables, following the structure from the old `Tutorpanel.tsx` data. Make sure the IDs link correctly (e.g., a `term` has a valid `course_id`).
    *   Add a few models to the `three_d_models` table.

---

## Step 2: Restructure the Frontend for Production

The current `importmap` setup is great for prototyping but not for production. We'll use Vite for a robust build process.

1.  **Initialize a New Vite Project**:
    ```bash
    npm create vite@latest tutorpad-app -- --template react-ts
    cd tutorpad-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install tldraw recharts @supabase/supabase-js
    ```

3.  **Copy Project Files**:
    *   Delete the default `App.tsx` and `index.css` from the new `src` folder in `tutorpad-app`.
    *   Copy all the `.tsx` files, the `Components` folder, `public` folder, and `utils.ts` from your original project into the `tutorpad-app/src` folder.
    *   Copy the contents of your original `index.css` into `tutorpad-app/src/index.css`.
    *   Copy the `index.html` file from your original project to the root of `tutorpad-app`, replacing the existing one.
    *   **Edit `index.html`**: Change the script tag at the bottom from `<script type="module" src="/index.tsx"></script>` to `<script type="module" src="/src/index.tsx"></script>`.

4.  **Create Environment File**:
    *   In the root of `tutorpad-app`, create a file named `.env.local`.
    *   Add your Supabase credentials from Step 1:
        ```.env
        VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

---

## Step 3: Integrate the Supabase Client

1.  **Create a Supabase Client Utility**:
    *   In `tutorpad-app/src`, create a new file `supabaseClient.ts`:
    ```ts
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

---

## Step 4: Implement Authentication

Now, let's connect the login/signup flow to Supabase Auth.

1.  **Refactor `App.tsx`**:
    *   This is a key change. We need to listen to Supabase's auth state instead of using a simple `useState`.
    ```tsx
    // In App.tsx
    import { supabase } from './supabaseClient'; // Import the client
    // ... other imports

    const App = () => {
        const [view, setView] = useState<View>('splash');
        const [session, setSession] = useState(null); // Manages Supabase session
        const [currentUser, setCurrentUser] = useState(null);

        useEffect(() => {
            // Splash screen logic
            const timer = setTimeout(() => {
                // If there's no session, go to login. The listener below will handle the dashboard view.
                if (!session) {
                    setView('login');
                }
            }, 3000);

            // Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                if (session) {
                    // Fetch user profile from your 'profiles' table
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', session.user.id)
                        .single();
                    
                    if (data) {
                        setCurrentUser({ name: data.full_name });
                        setView('dashboard');
                    }
                } else {
                    setCurrentUser(null);
                    setView('login');
                }
            });

            return () => {
                clearTimeout(timer);
                subscription.unsubscribe();
            };
        }, [session]); // Re-run if session changes

        const handleLogout = async () => {
            await supabase.auth.signOut();
            // The onAuthStateChange listener will handle setting the view to 'login'
        };
        
        const renderView = () => {
            // ... (keep switch statement)
            // But remove handleLogin from props and pass handleLogout to Dashboard
        }

        return <>{renderView()}</>;
    };
    ```

2.  **Refactor `LoginPage.tsx`**:
    *   Update the `handleSubmit` to call Supabase.
    ```tsx
    // In LoginPage.tsx
    import { supabase } from './supabaseClient';
    // ...

    const LoginPage = ({ onNavigateToSignup }) => {
        const [email, setEmail] = useState('demo@tutorpad.com');
        const [password, setPassword] = useState('password');

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
            // onAuthStateChange will handle navigation
        };
        // Update input fields to be controlled components with onChange handlers
        // ...
    };
    ```

3.  **Refactor `SignupPage.tsx`**:
    *   This is now a multi-step process: sign up, create a profile, and assign subjects.
    ```tsx
    // In SignupPage.tsx
    import { supabase } from './supabaseClient';
    // ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 1. Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) return alert(authError.message);

        // 2. Insert into profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: authData.user.id, full_name: fullName });
        if (profileError) return alert(profileError.message);

        // 3. Insert into tutor_subject_assignments
        // This is complex. You need to get subject IDs from the names selected.
        // For simplicity, this step is omitted here but would be required for a full implementation.
        // You would query your 'subjects' table to match names to IDs.

        alert('Signup successful! Please check your email to verify.');
        onNavigateToLogin();
    };
    ```

---

## Step 5: Fetching Dynamic Data

Replace all hardcoded data with live Supabase queries.

1.  **Refactor `Tutorpanel.tsx`**:
    *   Remove the `coursesData` constant.
    *   Fetch data in a `useEffect`.
    ```tsx
    // In Tutorpanel.tsx
    import { supabase } from './supabaseClient';

    const Tutorpanel = () => {
        const [courses, setCourses] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchCourses = async () => {
                // RLS automatically filters this data for the logged-in user
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        terms ( *, subjects ( *, units ( *, chapters ( *, topics ( * ) ) ) ) )
                    `);
                
                if (!error) setCourses(data);
                setIsLoading(false);
            };
            fetchCourses();
        }, []);

        // ... update the rest of the component to use the `courses` state variable
        // and handle the `isLoading` state.
    };
    ```

2.  **Refactor `ThreeDGallery.tsx`**:
    *   Replace the simulated fetch.
    ```tsx
    // In ThreeDGallery.tsx
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const { data, error } = await supabase.from('three_d_models').select('*');
                if (error) throw error;
                // ... (rest of the logic)
                setModels(data);
            } catch (err) {
                // ...
            }
        };
        fetchModels();
    }, []);
    ```

---

## Step 6: Securing AI API Calls with Edge Functions

**This is the most critical security step.**

1.  **Store your Google AI API Key as a Secret**:
    *   In the Supabase Dashboard, go to **Project Settings** > **Edge Functions**.
    *   Add a new secret. Name it `GOOGLE_API_KEY` and paste your key.

2.  **Create an Edge Function**:
    *   Follow the [Supabase CLI guide](https://supabase.com/docs/guides/functions/quickstart) to set up functions in your local project.
    *   Create a new function, e.g., `generate-image`.
    *   Inside `supabase/functions/generate-image/index.ts`, write the function to proxy the API call:
    ```ts
    // supabase/functions/generate-image/index.ts
    import { GoogleGenAI } from 'npm:@google/genai';

    Deno.serve(async (req) => {
      const { prompt } = await req.json();
      const apiKey = Deno.env.get('GOOGLE_API_KEY');
      const ai = new GoogleGenAI({ apiKey });

      try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
        });

        // Return only the necessary data
        const imageBytes = response.generatedImages[0].image.imageBytes;
        return new Response(JSON.stringify({ imageBytes }), {
            headers: { 'Content-Type': 'application/json' },
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    });
    ```

3.  **Refactor `AiBoard.tsx`**:
    *   Remove the client-side `@google/genai` initialization and direct API calls.
    *   Call your new Edge Function instead.
    ```tsx
    // In AiBoard.tsx (inside a function like genImageClick)
    import { supabase } from './supabaseClient';

    const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: promptText },
    });

    if (error) throw new Error(error.message);

    const imgSrc = `data:image/jpeg;base64,${data.imageBytes}`;
    // ... use imgSrc to create the shape
    ```

---

## Step 7: Final Build and Deployment

1.  **Build the Project**:
    ```bash
    npm run build
    ```
    This creates an optimized `dist` folder.

2.  **Deploy**:
    *   Sign up for a hosting provider like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). or [firebase] (https://firebase.google.com/)
    *   Connect your GitHub repository for CI/CD.
    *   Set the build command to `npm run build` and the publish directory to `dist`.
    *   **Crucially**, add your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in your hosting provider's project settings.

Your application is now live, secure, and production-ready.
