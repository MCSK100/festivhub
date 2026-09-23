# Supabase setup for FestivLink backend

The backend now uses **Supabase Postgres** (database) + **Supabase Storage**
(images) instead of MongoDB + Cloudinary. The REST API contract is unchanged,
so the frontend needs no changes.

## 1. Create the project

1. Go to https://supabase.com → New project.
2. Copy the **Project URL** and the **`service_role`** key
   (Project Settings → API). The backend uses the service-role key so it can
   write bypassing RLS; **never expose it in the frontend**.

## 2. Create tables + buckets

1. Open the Supabase **SQL editor** → New query.
2. Paste the full contents of `schema.sql` → **Run**.
3. Confirm three public buckets exist under **Storage**:
   `vendor-profiles`, `vendor-covers`, `vendor-portfolio`.

The schema script is idempotent — safe to re-run.

## 3. Configure the backend

Copy `../.env.example` to `../.env` and set:

```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
JWT_SECRET=<strong 32+ char random string>
FRONTEND_URL=https://festivlink.vercel.app
CORS_ORIGIN=https://festivlink.vercel.app
```

Optional (unchanged behaviour): `GOOGLE_CLIENT_ID`, `EMAIL_USER`,
`EMAIL_PASSWORD`. Legacy `MONGODB_URI` / `CLOUDINARY_*` vars are ignored and
can be removed.

## 4. Install + run

```bash
cd backend
npm install
npm run dev   # or: npm start
```

Health check: `GET /` → `{ "message": "FestivLink Backend Running!" }`.

## Notes

- Auth stays as app-level JWT (`Authorization: Bearer <token>`) backed by the
  `users` table — no Supabase Auth migration, no frontend changes.
- Image uploads (profile / cover / portfolio) go to Supabase Storage and the
  public URL is stored on the provider row, exactly like Cloudinary URLs were.
- Mongo/Mongoose and Cloudinary dependencies were removed. Old `models/*.js`
  Mongoose files are kept for reference but are **no longer imported** by any
  route; `db/` + `utils/supabase.js` are the data layer now.
