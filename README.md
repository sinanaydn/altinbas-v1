# Altınbaş AI Advertising Engine

Production system for generating brand-compliant, identity-preserving jewelry advertising visuals.

## Milestone 1: Foundation (Current Status)
- [x] Project Structure (API, Services, Client)
- [x] Antigravity Configuration
- [x] Environment Variable System
- [x] Airtable Schema Setup Scripts
- [x] Express API Skeleton
- [x] React Client Skeleton (mobile-first)

## Getting Started

### Prerequisites
- Node.js v20+
- NPM
- Valid API keys (see `.env.example` or `.env` placeholders)

### Installation
1. Install dependencies (Root, Server, and Client):
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

2. Configure Environment:
   - Edit `.env` with your actual API keys.
   - Edit `.antigravity/config.yaml` if needed.

### Running the Project
Start both Server (API) and Client (React):
```bash
npm run dev
```
- API: http://localhost:3000
- Client: http://localhost:5173

### Airtable Setup
Run the setup script to verify connection and schema requirements:
```bash
npx ts-node scripts/setup-airtable.ts
```

## Architecture
- **API**: Express.js with TypeScript (`src/index.ts`)
- **Client**: React + Vite + TailwindCSS (`client/`)
- **Services**: Modular service architecture (`src/services/`)
- **Logging**: Winston logger (`src/utils/logging.ts`)
