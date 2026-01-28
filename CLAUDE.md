# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NFL Stats Web Application built with Next.js (App Router) that displays NFL data from SportsData.io API.

### Features
- Live Scores - Real-time game scores and status
- Schedule - Weekly game schedules
- Standings - Conference and division standings
- Teams - Team information and rosters
- Players - Player search and details

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Data Fetching**: @tanstack/react-query (client), Server Components (server)
- **API**: SportsData.io NFL API

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/players/        # API routes
│   ├── players/            # Player pages
│   ├── schedule/           # Schedule page
│   ├── standings/          # Standings page
│   └── teams/              # Team pages
├── components/
│   ├── layout/             # Header, Footer
│   ├── providers/          # React Query provider
│   ├── scores/             # Score display components
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── api/sportsdata.ts   # SportsData.io API client
└── types/
    └── nfl.ts              # TypeScript type definitions
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and set:

```
SPORTSDATA_API_KEY=your_api_key_here
```

Get your API key from [SportsData.io](https://sportsdata.io/).

## Deployment

This app is designed for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Set `SPORTSDATA_API_KEY` environment variable
4. Deploy
