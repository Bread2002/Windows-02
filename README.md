# **Windows ʼ02: A Personal Website Disguised as an OS**

### _Copyright (c) 2026, Rye Stahle-Smith_

---

## 📌 Overview

A personal portfolio that boots like a Windows 98 machine. Built using **React + TypeScript** with Vercel serverless functions, and styled with the help of [98.css](https://github.com/jdan/98.css). Navigate through a BIOS screen, log in, and experience a desktop populated with icons linking to publications, a resume, LinkedIn, GitHub, and more — because why settle for a normal portfolio page?

---

## ⚙️ Features

- 💾 **BIOS Boot Sequence** — Randomized POST screen with memory counting, IDE drive detection, and a rotating set of cryptic BIOS events; Spacebar to boot, Escape to skip
- 🔐 **Login Screen** — Windows 98-style dialog backed by a Vercel serverless function; ready to wire up real authentication
- 🖥️ **Desktop** — Drag icons to the Recycle Bin, right-click for a context menu, and open Display Properties to recolor the desktop background
- 📁 **File Explorer Windows** — Publications and My Documents open in Win98-style Explorer overlays with a detail pane and status bar
- 🗑️ **Recycle Bin** — Drag-and-drop icons in; restore or permanently delete them from the Recycle Bin window; supports multi-select with Ctrl and Shift
- 🎨 **Display Properties** — Appearance tab with a live desktop color preview and a palette of 16 colors
- 🔊 **Sound Effects** — Authentic key-click and mouse-click audio throughout; boot sound plays on spacebar press

---

## 📂 Repository Structure

```
Personal_Website/
├── api/                            # Vercel Python serverless functions
│   ├── health.py                   # GET /api/health
│   └── login.py                    # POST /api/login
├── frontend/                       # React + TypeScript (Vite) frontend
│   ├── public/
│   │   ├── bios/                   # Boot screen assets (sounds, font, images)
│   │   ├── resume/                 # Resume PDF
│   │   └── publications/           # Locally-hosted publication PDFs
│   ├── src/
│   │   ├── App.tsx                 # Root app + routing (boot → login → desktop)
│   │   ├── main.tsx                # React entry point
│   │   ├── index.css               # Global styles (Win98 theme overrides)
│   │   ├── data/
│   │   │   └── publications.ts     # Publication and resume metadata
│   │   ├── types/
│   │   │   └── desktop.ts          # Shared TypeScript interfaces
│   │   └── components/
│   │       ├── icons/
│   │       │   └── DesktopIcons.tsx    # SVG icon components
│   │       ├── BootScreen.tsx          # BIOS boot animation
│   │       ├── LoginScreen.tsx         # Win98 login dialog
│   │       ├── Desktop.tsx             # Desktop shell and icon grid
│   │       ├── FileExplorer.tsx        # Reusable Explorer overlay
│   │       ├── DisplayProperties.tsx   # Display Properties dialog
│   │       ├── MyComputerWindow.tsx    # My Computer window
│   │       ├── RecycleBinWindow.tsx    # Recycle Bin window
│   │       └── Taskbar.tsx             # Start button and system clock
│   ├── 98.css/                     # Local copy of jdan/98.css (must be built separately)
│   ├── index.html                  # HTML template
│   └── vite.config.ts              # Vite config (CSS minification disabled for 98.css compat)
└── scripts/
    ├── dev.ps1                     # Windows: opens backend + frontend in separate terminals
    └── dev.sh                      # macOS/Linux: same, using bash
```

---

## 🚀 Setup

### Prerequisites

- Node.js 24+

---

### 🎨 Build 98.css

The retro styling library is bundled as a local copy and must be compiled before running the frontend for the first time.

```bash
cd frontend/98.css
npm install
npm run build
```

> ⚠️ **Note:** Vite's default CSS minifier (LightningCSS) rejects `@media (not(hover))`, a valid selector used by 98.css. `cssMinify` is set to `false` in `vite.config.ts` to work around this — 98.css ships pre-minified anyway.

---

### 🌐 Run Locally

Install the [Vercel CLI](https://vercel.com/docs/cli) and run both the frontend and API functions with a single command:

```bash
npm install -g vercel
vercel dev
```

`vercel dev` builds the frontend, starts the Vite dev server, and runs the `api/` serverless functions on the same port — no separate backend process needed.

> ⚠️ **Note:** The login endpoint currently accepts any non-empty username and password. It is a stub — replace the body of `handler.do_POST()` in `api/login.py` with real authentication logic before deploying.

---

## 🔌 API Endpoints

| Method | Endpoint       | Description                                                                                                                |
| ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`  | Returns `{ "status": "ok" }` — confirms the serverless function is running                                                 |
| `POST` | `/api/login`   | Accepts `{ username, password }`; returns `{ success, message }` — currently a stub that accepts any non-empty credentials |
