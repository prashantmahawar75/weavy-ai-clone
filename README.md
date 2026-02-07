# Weavy AI — Workflow Builder Clone

A pixel-perfect clone of [Weavy.ai](https://weavy.ai), featuring a fully animated marketing landing page and a visual AI workflow editor. Built with Next.js 16, React Flow, Framer Motion, Clerk, Prisma, Trigger.dev, and Google Gemini.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-ff69b4?logo=framer)

---

## Features

### Marketing Landing Page (pixel-perfect recreation of weavy.ai)

- **Animated Navbar** — Scroll-aware fixed header with shrinking "Start Now" CTA, navigation links (Collective, Enterprise, Pricing, Request a Demo), and Clerk auth integration
- **Hero Section** — Gradient background with grid pattern overlay, "Weavy" / "Artistic Intelligence" typography, and a live React Flow canvas showcasing an interactive workflow
- **Mobile Hero Cards** — Responsive vertical card layout with SVG connection lines for mobile viewports
- **Sticky Model Section** — 400vh scroll-driven sticky section showcasing 15 AI models (GPT img 1, Wan, SD 3.5, Runway Gen-4, Imagen 3, Veo 3, Recraft V3, Kling, Flux Pro 1.1 Ultra, Minimax Video, Ideogram V3, Luma Ray 2, Minimax Image 01, Hunyuan, Bria) with background images and videos
- **Tool Section** — Scattered tool badges (Rotate, Crop, Blur, Liquify, Text, Color, Overlay, Background, Upscale, Resize, Relight) around a central hero image
- **Editor Section** — "Control the Outcome" with mouse-move parallax effect, compositing layers preview
- **Workflow Transition** — 200vh scroll-driven "From Workflow → to App Mode" section with animated panels and floating nodes
- **Explore Workflows** — Auto-scrolling infinite carousel with real workflow names (Wan Lora - Rotate, Multiple Models, Wan LoRa Inflate, Relight 2.0 Human, etc.)
- **Footer** — Dark sage-green design with social links (LinkedIn, Instagram, Discord), navigation columns, and large yellow "Start Now" CTA
- **Smooth Scrolling** — Lenis-powered smooth scroll across the entire page

### Workflow Builder (full-featured AI workflow editor)

- **Visual Drag-and-Drop Editor** — Node-based canvas powered by @xyflow/react
- **6 Node Types** — Text, Upload Image, Upload Video, Run Any LLM, Crop Image, Extract Frame
- **AI Integration** — Google Gemini models (Flash, Pro, 2.0) for LLM tasks
- **Media Processing** — Transloadit for image cropping and video frame extraction
- **Background Tasks** — Trigger.dev for reliable async task execution
- **Authentication** — Clerk auth with automatic redirects
- **Persistence** — PostgreSQL with Prisma ORM (4 models: User, Workflow, WorkflowRun, UserApiKey)
- **DAG Validation** — Prevents cycles, validates connection types
- **Parallel Execution** — Nodes at the same dependency level run concurrently
- **Undo/Redo** — Full undo/redo stack with zundo (Cmd+Z / Cmd+Shift+Z)
- **Rate Limiting** — Token-bucket rate limiter on all API routes
- **SSRF Protection** — Blocks private IPs, cloud metadata, and dangerous URLs
- **Input Validation** — Zod schemas on every API endpoint
- **User API Keys** — Bring your own Gemini/Transloadit/Trigger.dev keys via Settings
- **History Panel** — Track all workflow runs with detailed per-node results
- **Import/Export** — Save and load workflows as JSON
- **Sample Workflow** — Pre-built "Product Marketing Kit Generator"

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Canvas / Workflow | @xyflow/react |
| Animations | Framer Motion 12 |
| Smooth Scroll | Lenis |
| State | Zustand + zundo (undo/redo) |
| Validation | Zod v4 |
| Auth | Clerk (@clerk/nextjs) |
| Database | PostgreSQL + Prisma 5 |
| AI | Google Gemini API |
| Tasks | Trigger.dev |
| Media | Transloadit |
| Styling | Tailwind CSS v4 |
| Fonts | Geist + Geist Mono |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | v18.18+ (v20+ recommended) | [nodejs.org](https://nodejs.org) or `brew install node` |
| **npm** | v9+ (bundled with Node.js) | Included with Node.js |
| **PostgreSQL** | v14+ | `brew install postgresql@16` or [postgresql.org](https://www.postgresql.org/download) |
| **Git** | Any recent version | `brew install git` or [git-scm.com](https://git-scm.com) |

```bash
# Verify installations
node --version    # v18.18.0+
npm --version     # 9.x+
psql --version    # 14.x+
```

---

## Setup (9 Steps)

### 1. Clone the repository

```bash
git clone https://github.com/prashantmahawar75/weavy-ai-clone.git
cd weavy-ai-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

```bash
# Start PostgreSQL (macOS Homebrew)
brew services start postgresql@16

# Create database and user
psql postgres <<EOF
CREATE DATABASE weavy_db;
CREATE USER weavy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE weavy_db TO weavy_user;
EOF
```

### 4. Get API keys

| Service | Required | Where to get |
|---------|----------|-------------|
| **Clerk** | Yes | [dashboard.clerk.com](https://dashboard.clerk.com) — Create app → copy Publishable Key + Secret Key |
| **Google Gemini** | Yes | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — Create API Key |
| **Transloadit** | Optional | [transloadit.com](https://transloadit.com) — Dashboard → API Credentials |
| **Trigger.dev** | Optional | [trigger.dev](https://trigger.dev) — Create project → copy Secret Key |

### 5. Configure environment variables

Create/edit `.env.local` in the project root:

```env
# Database
DATABASE_URL="postgresql://weavy_user:your_password@localhost:5432/weavy_db"

# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
CLERK_SECRET_KEY=sk_test_XXXXX
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini (required)
GOOGLE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX

# Transloadit (optional)
NEXT_PUBLIC_TRANSLOADIT_KEY=your_transloadit_key
TRANSLOADIT_AUTH_SECRET=your_transloadit_secret

# Trigger.dev (optional)
TRIGGER_SECRET_KEY=tr_dev_XXXXX
```

### 6. Push database schema

```bash
npx prisma db push
```

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the animated landing page.

### 8. Start building

Click **"Start Now"** → sign up via Clerk → land on the Dashboard → create workflows.

### 9. (Optional) Start Trigger.dev worker

```bash
npx trigger.dev@latest dev
```

---

## Quick Start (after initial setup)

```bash
npm run dev
# → http://localhost:3000
```

---

## How to Use

1. **Browse the landing page** — scroll through the animated marketing sections
2. **Sign up / Sign in** — click "Start Now" or "Sign In" in the navbar
3. **Create a workflow** — click "+ New Workflow" on the Dashboard
4. **Drag nodes** from the left sidebar onto the canvas
5. **Connect nodes** by dragging from output handles (bottom) to input handles (top)
6. **Configure nodes** — type text, upload images/video, select an LLM model
7. **Click "Run"** to execute the entire workflow (DAG order, parallel where possible)
8. **View results** in the History panel on the right
9. **Load the sample workflow** by clicking the ✨ sparkle button

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd + Z` | Undo |
| `Cmd + Shift + Z` | Redo |
| `Cmd + Y` | Redo (alt) |

### Settings — Bring Your Own API Keys

Click ⚙️ in the Dashboard header → add personal keys for Gemini, Transloadit, or Trigger.dev.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page (composes all marketing sections)
│   ├── layout.tsx                      # Root layout (Geist fonts, ClerkProvider, light theme)
│   ├── globals.css                     # Global styles, design tokens, scrollbar utilities
│   ├── dashboard/page.tsx              # Workflow list
│   ├── settings/page.tsx               # API key management
│   ├── workflow/[id]/page.tsx          # Workflow editor
│   ├── sign-in/[[...sign-in]]/page.tsx # Clerk sign-in
│   ├── sign-up/[[...sign-up]]/page.tsx # Clerk sign-up
│   └── api/
│       ├── workflows/route.ts          # CRUD workflows (Zod validated)
│       ├── execute/route.ts            # Run full workflow (DAG, parallel)
│       ├── trigger/route.ts            # Trigger individual tasks
│       ├── upload/route.ts             # File upload
│       └── settings/api-keys/route.ts  # User API key management
│
├── components/
│   ├── SmoothScroll.tsx                # Lenis smooth scroll wrapper
│   ├── marketing/                      # 10 landing page sections
│   │   ├── Navbar.tsx                  # Fixed header, scroll-aware, Clerk auth
│   │   ├── HeroSection.tsx             # Gradient hero with grid pattern
│   │   ├── HeroWorkflow.tsx            # React Flow canvas in hero (6 card nodes)
│   │   ├── MobileHeroCards.tsx         # Mobile card layout with SVG lines
│   │   ├── StickyModelSection.tsx      # 15 AI models, scroll-driven sticky
│   │   ├── ToolSection.tsx             # 11 scattered tool badges
│   │   ├── EditorSection.tsx           # Parallax compositing preview
│   │   ├── WorkflowTransition.tsx      # Workflow → App Mode transition
│   │   ├── ExploreWorkflows.tsx        # Infinite carousel of workflows
│   │   └── Footer.tsx                  # Dark footer with social links
│   ├── nodes/                          # 6 workflow node components
│   │   ├── TextNode.tsx
│   │   ├── UploadImageNode.tsx
│   │   ├── UploadVideoNode.tsx
│   │   ├── LLMNode.tsx
│   │   ├── CropImageNode.tsx
│   │   └── ExtractFrameNode.tsx
│   └── workflow/                       # Workflow editor components
│       ├── WorkflowEditor.tsx
│       ├── WorkflowCanvas.tsx
│       ├── Sidebar.tsx
│       └── HistoryPanel.tsx
│
├── lib/
│   ├── utils.ts                        # DAG validation, topological sort, parallel levels
│   ├── prisma.ts                       # Database client singleton
│   ├── rate-limit.ts                   # Token-bucket rate limiter
│   ├── ssrf-protection.ts              # URL safety validation
│   ├── api-keys.ts                     # User API key resolver
│   ├── validations.ts                  # Zod schemas for all API routes
│   └── sampleWorkflow.ts              # Pre-built demo workflow
│
├── stores/
│   └── workflowStore.ts                # Zustand + zundo (undo/redo)
│
├── trigger/                            # Trigger.dev task definitions
│   ├── llmTask.ts
│   ├── cropImageTask.ts
│   └── extractFrameTask.ts
│
└── types/
    └── workflow.types.ts               # TypeScript interfaces
```

---

## Design System

The landing page uses a **light theme** matching weavy.ai:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FBFBFB` | Page background |
| Hero gradient | `#d6e8f1` → `#dce3e9` | Hero section |
| Yellow CTA | `#FEF3C7` | "Start Now" buttons |
| Dark sections | `#2b2d2a` / `#09090b` | Explore, Footer |
| Footer sage | `#565955` | Footer container |
| Fonts | Geist + Geist Mono | Body + code |

The workflow editor uses dark-themed React Flow overrides for the canvas.

---

## Node Types

| Node | Inputs | Outputs | Description |
|------|--------|---------|-------------|
| Text | — | output (text) | Static text value |
| Upload Image | — | output (image) | Upload images (drag or click) |
| Upload Video | — | output (video) | Upload videos |
| Run Any LLM | system_prompt, user_message, images | output (text) | Gemini inference |
| Crop Image | image_url, x%, y%, width%, height% | output (image) | Crop via Transloadit |
| Extract Frame | video_url, timestamp | output (image) | Extract frame at timestamp |

---

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma db push   # Sync schema to database
npx prisma db push --force-reset  # Reset database (deletes all data)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "publishableKey passed to Clerk is invalid" | Update Clerk keys in `.env.local` from [dashboard.clerk.com](https://dashboard.clerk.com) |
| "Can't reach database server" | Ensure PostgreSQL is running: `brew services start postgresql@16` |
| "database does not exist" | `psql postgres -c "CREATE DATABASE weavy_db;"` |
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` or `npm run dev -- -p 3001` |
| Node modules issues | `rm -rf node_modules package-lock.json && npm install` |
| Images not loading on landing page | Check `next.config.ts` has `cdn.prod.website-files.com` in remote patterns |

---

## License

MIT
