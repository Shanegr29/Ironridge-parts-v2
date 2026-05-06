   # IronRidge Parts v2

Mobile-first used forklift parts inventory system.
Built with Next.js 14 (App Router), Supabase, Tailwind CSS.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Add environment variables — create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://iffzcnwmiaznzpecojwp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Run locally:
   ```
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js, no build settings needed

## Stack
- Next.js 14 App Router (server components by default)
- Supabase (@supabase/ssr — not the deprecated auth-helpers)
- Tailwind CSS with IronRidge design tokens
- TypeScript strict mode
- idb-keyval for offline queue (IndexedDB)

## Project Structure
```
src/
  app/
    (app)/              # Main app shell with BottomNav
      donor-lifts/      # Donor lift intake & management
      parts/            # Parts inventory
      listings/         # eBay & channel listings (V1)
      orders/           # Order management (V1)
    auth/
      login/            # Email/password login
  components/
    primitives/         # BottomNav, SlideUpSheet, FAB, etc.
  lib/
    supabase/           # client.ts (browser) + server.ts
    offline-queue.ts    # IndexedDB queue for offline support
    utils.ts            # cn() helper
  types/
    database.ts         # TypeScript types matching Supabase schema
```
