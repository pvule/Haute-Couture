# Mon App 2

React/Vite app using Supabase for authentication and profile persistence.

## Environment

Set these variables locally and in Vercel:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SITE_URL=http://localhost:5173
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

The signup flow stores users and profiles in Supabase. The optional welcome
email endpoint uses `/api/send-email`; if you keep it enabled on Vercel, set
`SMTP_USER`, `SMTP_PASS`, and optionally `ALLOWED_ORIGINS` in Vercel
environment variables, not in frontend Vite env files.

For production, set:

```env
VITE_SITE_URL=https://your-vercel-domain.vercel.app
VITE_AUTH_REDIRECT_URL=https://your-vercel-domain.vercel.app/auth/callback
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

In Supabase Authentication URL Configuration, add these redirect URLs:

```txt
http://localhost:5173/auth/callback
http://localhost:5173/**
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/**
```

## Supabase Schema

Create a `profiles` table for signup metadata:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

Create a `user_carts` table for per-user cart sync:

```sql
create table if not exists public.user_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_carts enable row level security;

create policy "Users can read their own cart"
on public.user_carts for select
using (auth.uid() = user_id);

create policy "Users can insert their own cart"
on public.user_carts for insert
with check (auth.uid() = user_id);

create policy "Users can update their own cart"
on public.user_carts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Commands

```sh
npm run dev
npm run build
```
