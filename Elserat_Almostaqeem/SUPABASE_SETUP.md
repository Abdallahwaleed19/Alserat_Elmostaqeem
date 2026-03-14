// Steps to configure Supabase

1. Go to https://supabase.com/ and create a free account (using GitHub is easiest).
2. Click "New Project" and give it a name like "zad-elmuslim", choose a secure database password, and choose a region close to you (e.g., Frankfurt).
3. Wait a minute for the project to provision.
4. On the left menu, go to "SQL Editor".
5. Run the following SQL command to create the subscriptions table:

   create table subscriptions (
     endpoint text primary key,
     subscription jsonb not null,
     latitude double precision,
     longitude double precision,
     time_zone text,
     last_sent jsonb default '{}'::jsonb
   );

// Steps to configure Supabase

1. Go to https://supabase.com/ and create a free account (using GitHub is easiest).
2. Click "New Project" and give it a name like "zad-elmuslim", choose a secure database password, and choose a region close to you (e.g., Frankfurt).
3. Wait a minute for the project to provision.
4. On the left menu, go to "SQL Editor".
5. Run the following SQL command to create the subscriptions table:

   create table subscriptions (
     endpoint text primary key,
     subscription jsonb not null,
     latitude double precision,
     longitude double precision,
     time_zone text,
     last_sent jsonb default '{}'::jsonb
   );

6. Go to "Project Settings" -> "API" (on the left menu).
7. Copy the "Project URL" and the "anon" public key.
8. Go to your Netlify dashboard -> Site settings -> Environment variables.
9. Add the following environment variables:
   - SUPABASE_URL: https://bfjgllinvcqintthsnyv.supabase.co
   - SUPABASE_KEY: sb_publishable_zTYxn-iY3paxVQyb_bKpHw_P0xCcTuJ
   - VAPID_PUBLIC_KEY: BHGV9Ny_1auejJfxy3lMZKoXmwoCBgK4sK_jFOOQIt220B1e7qUiAXVVPqIMYOWSfhBqcHPmZuVPwRvAaZNgZNM
   - VAPID_PRIVATE_KEY: _gAWDNv_riSskuRneyKhlAhOm0BRnbCqTqCbkb-gAvU
