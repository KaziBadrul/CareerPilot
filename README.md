<img width="237" height="55" alt="image" src="https://github.com/user-attachments/assets/3ddf2f0e-4548-4c97-848d-1ee0ed340d92" />  
<br/>
<img width="227" height="46" alt="image" src="https://github.com/user-attachments/assets/6192d7d4-e7f2-4397-aa75-8383db271dbe" />

# CareerPilot

CareerPilot is a Next.js application that helps job seekers discover, track, and apply for jobs with AI-powered assistance. It integrates with Supabase for authentication and storage and provides a dashboard experience (job search, saved jobs, recent searches, AI assistant, and progress tracking).

Live demo: https://career-pilot-aiapp.vercel.app/

Key features

- Job Hunter: search for jobs, view full job details in a polished modal, and render descriptions as Markdown.
- Saved Jobs: persist jobs you plan to apply for using Supabase.
- Recent Searches: store and re-run previous searches.
- AI Assistant: chat and generate cover letters (integrated UI components in the dashboard).
- Authentication: signup / login via Supabase, profile persistence in a `users` table.

## Previews
<img width="1920" height="988" alt="image" src="https://github.com/user-attachments/assets/155a4ce7-c70b-4343-9f33-bd327cd919dd" /> <br/>
<img width="1920" height="992" alt="image" src="https://github.com/user-attachments/assets/59ad4541-138f-4114-85dd-ddb2d010ca0a" /> <br/>
<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/863e2fbb-beb2-479f-8fb7-554d0cefc21c" /> <br/>
<img width="1920" height="992" alt="image" src="https://github.com/user-attachments/assets/240831fc-5cdf-4e1a-952d-9d53663d5be1" /> <br/>
<img width="1920" height="992" alt="image" src="https://github.com/user-attachments/assets/daa3b7a7-2605-4d78-918d-e2674b0ff9aa" /> <br/>


Repository layout

- `app/` — Next.js App Router pages and API routes.
- `app/dashboard/` — main dashboard and job hunter UI.
- `app/api/` — server route handlers (save job, search-history, etc.).
- `lib/supabase/` — Supabase client helper.
- `migrations/` — SQL migrations created for additional tables (e.g. `job_searches`).

Local development

1. Install dependencies:

```powershell
npm install
```

2. Create a Supabase project and add the required environment variables to a `.env.local` file at the project root. At minimum set:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# (optional) SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  // only for secure server-side ops
```

3. (Optional) Run the SQL migration(s) in `migrations/` to create the `job_searches` table and others if you want server-side persistence:

Open your Supabase SQL editor and run the SQL in `migrations/create_job_searches_table.sql`.

4. Run the dev server:

```powershell
npm run dev
```

5. Open `http://localhost:3000` and test the app. Log in / sign up using Supabase auth to access the dashboard.

Notes about authentication & security

- The app currently uses the client-side Supabase helper (`lib/supabase/client.ts`) for most user operations. This is fine for normal authenticated frontend flows (reading the current user's non-sensitive data).
- For sensitive, server-side operations (admin queries, bulk writes, or elevated privileges), use a server-side Supabase client with a service role key or implement secure server API routes.

Common environment variables (summary)

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the anon/public key used by the frontend client.
- `SUPABASE_SERVICE_ROLE_KEY` — (optional) server-only key for privileged operations; do NOT commit this to source control.

Full environment variable list (what this project uses)

- `NEXT_PUBLIC_SUPABASE_URL` (public) — your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public) — Supabase anon/public key used by the frontend.
- `SUPABASE_SERVICE_KEY` (server-only) — service role key for privileged server operations. Keep this secret and do not expose it to the browser.
- `GROQ_API_KEY` (server or env-specific) — API key used by any GROQ/Headless CMS integrations.
- `QDRANT_URL` (server) — Qdrant vector DB HTTP endpoint.
- `QDRANT_API_KEY` (server) — Qdrant API key for your cluster.
- `QDRANT_CLUSTER_ENDPOINT` (server) — optional cluster endpoint used by some Qdrant clients.
- `APIFY_API_TOKEN` (server) — Apify token for scraping/actor usage.
- `GEMINI_API_KEY` (server or private) — API key for Gemini integrations (treat as secret).

Never commit secrets to the repository. Use a `.env.local` file for local development and set the same variables in your Vercel project settings for production.

Example `.env.local` template (do not commit):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
GROQ_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_CLUSTER_ENDPOINT=
APIFY_API_TOKEN=
GEMINI_API_KEY=
```

Which keys are public vs server-only

- Public (safe for browser): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server-only (do not expose to browser / Vercel must mark as secret): `SUPABASE_SERVICE_KEY`, `GROQ_API_KEY`, `QDRANT_API_KEY`, `APIFY_API_TOKEN`, `GEMINI_API_KEY`.

Setting environment variables on Vercel

1. Go to your Vercel project → Settings → Environment Variables.
2. Add the variables above. For server-only keys, set them for the `Production` and `Preview` scopes but do not use the `NEXT_PUBLIC_` prefix unless they are intended for client-side usage.

Deployment

This project is deployable to Vercel. It's already deployed at:

https://career-pilot-aiapp.vercel.app/

To deploy yourself:

1. Push the repository to GitHub (or another Git provider).
2. Create a new Vercel project, link the repo, and set the same environment variables in the Vercel dashboard.
3. Vercel will handle building and deploying the Next.js app automatically.

Troubleshooting

- If pages that require authentication are accessible when you expect them protected, confirm your Supabase keys and session handling are correct.
- If images or logos are not loading, check any external URLs or the Next.js `next.config.js` image domains.
- If you see lint or type errors locally after edits, run `npm run dev` and read the console — the app uses TypeScript and the Next.js App Router which surface build-time errors.

Contributing

- Feel free to open PRs or issues. Keep UI changes consistent with the existing design system in `app/` and add tests when possible.

License

- This project does not include a license file. Add a license file if you plan to release the code publicly.

Contact

- If you want me to help with server-side auth protection, add editable profile fields, or wire additional Supabase policies, tell me which piece to implement next.

Enjoy! 🚀
