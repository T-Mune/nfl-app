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

## AI Modification Workflow

This section defines the workflow when Claude Code makes modifications to the codebase.

### Before Making Changes

1. **Review Documentation**
   - Read relevant design documentation in `docs/` directory
   - Check related documentation files (e.g., if modifying a component, read `docs/components/`, `docs/pages/`, and `docs/architecture/`)
   - Understand the current implementation and design decisions

2. **Review Source Files**
   - Read the target source files to understand current implementation
   - Identify all files that will be affected by the change

3. **Assess Impact**
   - Consider the scope of changes across the codebase
   - Identify potential breaking changes
   - Check for dependencies and related components

### Documentation-First Approach

**IMPORTANT: Always update documentation before modifying source code.**

1. **Update Design Documents First**
   - Modify relevant documentation in `docs/` to reflect proposed changes
   - Update multiple related docs if necessary (e.g., architecture, component, and page docs)
   - Add change history to updated documentation files

2. **Get User Approval**
   - Present the documentation changes to the user
   - Wait for explicit approval before proceeding to code changes
   - If user requests modifications, update docs accordingly

3. **Implement Code Changes**
   - Only after documentation is approved, modify source files
   - Ensure implementation matches the approved documentation

4. **Change History**
   - Add change log entries to updated documentation files
   - Format: `**Updated**: YYYY年MM月 - [Description of changes]`

### Before Commit

**Automated quality checks before committing:**

1. **Lint Check**
   ```bash
   npm run lint
   ```
   - Fix any linting errors before proceeding
   - Do not commit if lint fails

2. **Build Check**
   ```bash
   npm run build
   ```
   - Ensure the build succeeds
   - Do not commit if build fails

3. **Commit and Push**
   - If both lint and build pass, proceed with commit
   - Create descriptive commit message following project conventions
   - Push to remote repository automatically
   - Include `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

### Breaking Changes

**WARNING: Always alert the user before making breaking changes.**

Breaking changes include:
- Modifying public API interfaces
- Changing component props that are used elsewhere
- Removing or renaming exported functions/components
- Changing database schema
- Modifying environment variables
- Updating dependencies with breaking changes

**Process:**
1. Identify the breaking change
2. Alert the user with clear explanation of impact
3. Suggest migration path or alternative approach
4. Wait for user approval before proceeding

### Error Handling

If errors occur during the workflow:
1. Report the error clearly to the user
2. Do not proceed with commit/push if quality checks fail
3. Provide suggestions for resolution
4. Wait for user decision on how to proceed

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
