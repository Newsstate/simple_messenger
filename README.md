# Simple Messenger (Next.js + Prisma + Postgres)

## Features
- Signup with username + password
- Login with credentials
- View all users
- 1:1 messaging
- Session via httpOnly cookie (JWT)

## Requirements
- Node.js 18+ (recommended 20+)
- Postgres database (Vercel Postgres / Neon / Supabase)

## Setup (Local)
1. Install deps
```bash
npm i
```

2. Create `.env` from `.env.example`
```env
DATABASE_URL="..."
JWT_SECRET="..."
```

3. Run migrations + start dev
```bash
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000

## Deploy (Vercel)
1. Push this repo to GitHub
2. Import in Vercel
3. Add env vars in Vercel Project Settings
- DATABASE_URL
- JWT_SECRET
4. Deploy
5. Run migrations for production DB
```bash
npm run migrate:deploy
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run migrate:dev`
- `npm run migrate:deploy`
- `npm run studio`
