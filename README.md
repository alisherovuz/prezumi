# Prezumi — AI Resume Builder

Next.js + Supabase + Vercel

## 🚀 Quick Start

### 1. Supabase Setup (5 daqiqa)

1. **https://supabase.com** ga boring va account yarating
2. **"New Project"** bosing
3. Project ma'lumotlari:
   - Name: `prezumi`
   - Database Password: (eslab qoling!)
   - Region: `Frankfurt` (yaqinroq)
4. **"Create new project"** bosing

#### Database Table yaratish:

Supabase Dashboard → **SQL Editor** → **New Query** → Quyidagini paste qiling:

```sql
-- Users table (Supabase Auth bilan bog'liq)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'lifetime')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resumes table
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text default 'Untitled Resume',
  template text default 'classic',
  personal_info jsonb default '{}',
  summary text default '',
  experience jsonb default '[]',
  education jsonb default '[]',
  skills text default '',
  languages jsonb default '[]',
  projects jsonb default '[]',
  certifications jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cover Letters table
create table public.cover_letters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  resume_id uuid references public.resumes on delete set null,
  title text default 'Untitled Cover Letter',
  company_name text,
  job_title text,
  content text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.cover_letters enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own resumes" on public.resumes for select using (auth.uid() = user_id);
create policy "Users can create own resumes" on public.resumes for insert with check (auth.uid() = user_id);
create policy "Users can update own resumes" on public.resumes for update using (auth.uid() = user_id);
create policy "Users can delete own resumes" on public.resumes for delete using (auth.uid() = user_id);

create policy "Users can view own cover letters" on public.cover_letters for select using (auth.uid() = user_id);
create policy "Users can create own cover letters" on public.cover_letters for insert with check (auth.uid() = user_id);
create policy "Users can update own cover letters" on public.cover_letters for update using (auth.uid() = user_id);
create policy "Users can delete own cover letters" on public.cover_letters for delete using (auth.uid() = user_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**"Run"** bosing.

#### Google OAuth sozlash:

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** ni yoqing
3. **Client ID** va **Client Secret** ni kiriting (Google Cloud Console dan)
4. **Save** bosing

#### API Keys olish:

1. Supabase Dashboard → **Settings** → **API**
2. Quyidagilarni nusxalang:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 2. Local Development

```bash
# Clone
git clone <your-repo>
cd prezumi-next

# Dependencies
npm install

# Environment
cp .env.example .env.local
# .env.local ni to'ldiring

# Run
npm run dev
```

http://localhost:3000 da oching

---

### 3. Vercel Deploy

1. **GitHub** ga push qiling
2. **https://vercel.com** ga boring
3. **"Import Project"** → GitHub repo ni tanlang
4. **Environment Variables** qo'shing:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
5. **"Deploy"** bosing

---

## 📁 Project Structure

```
prezumi-next/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── get-started/          # Choose path page
│   ├── auth/
│   │   ├── login/            # Login page
│   │   ├── register/         # Register page
│   │   └── callback/         # OAuth callback
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard
│   └── api/
│       └── ai/               # OpenAI API route
├── lib/
│   └── supabase.ts           # Supabase client
├── components/               # React components
├── .env.local                # Environment variables
└── package.json
```

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
OPENAI_API_KEY=sk-proj-xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 License

MIT
