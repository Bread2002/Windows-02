# **Windows ʼ02: A Personal Website Disguised as an OS**

### _Copyright (c) 2026, Rye Stahle-Smith_

---

## 📌 Overview

A personal portfolio that boots like a Windows 98 machine. Built using **React TS + FastAPI**, and styled with the help of [98.css](https://github.com/jdan/98.css). Navigate through a BIOS screen, log in, and experience a desktop populated with icons linking to publications, a resume, LinkedIn, GitHub, and more — because why settle for a normal portfolio page?

---

## ⚙️ Features

- 💾 **BIOS Boot Sequence** — Randomized POST screen with memory counting, IDE drive detection, and a rotating set of cryptic BIOS events; Spacebar to boot, Escape to skip
- 🔐 **Login Screen** — Windows 98-style dialog backed by a FastAPI stub; ready to wire up real authentication
- 🖥️ **Desktop** — Drag icons to the Recycle Bin, right-click for a context menu, and open Display Properties to recolor the desktop background
- 📁 **File Explorer Windows** — Publications and My Documents open in Win98-style Explorer overlays with a detail pane and status bar
- 🗑️ **Recycle Bin** — Drag-and-drop icons in; restore or permanently delete them from the Recycle Bin window; supports multi-select with Ctrl and Shift
- 🎨 **Display Properties** — Appearance tab with a live desktop color preview and a palette of 16 colors
- 🔊 **Sound Effects** — Authentic key-click and mouse-click audio throughout; boot sound plays on spacebar press

---

## 📂 Repository Structure

```
Personal_Website/
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # Entry point, CORS config, login stub
│   └── requirements.txt            # Python dependencies
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

- Python 3.11+
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

### 🖥️ Run the Backend

1. Create a virtual environment and install dependencies:

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\pip install -r requirements.txt   # Windows
   # or
   .venv/bin/pip install -r requirements.txt       # macOS/Linux
   ```

2. Start the server:

   ```bash
   .venv\Scripts\python -m uvicorn main:app --reload --port 8000   # Windows
   # or
   .venv/bin/python -m uvicorn main:app --reload --port 8000       # macOS/Linux
   ```

   REST API runs on `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

> ⚠️ **Note:** The login endpoint currently accepts any non-empty username and password. It is a stub — replace the body of `login()` in `backend/main.py` with real authentication logic before deploying.

---

### 🌐 Run the Frontend

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Run:

   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`.

---

### ⚡ Quick Start (Dev Script)

Once dependencies are installed (and 98.css is built), launch both servers at once from the project root:

```powershell
# Windows
.\scripts\dev.ps1
```

```bash
# macOS/Linux
bash scripts/dev.sh
```

This opens the backend and frontend in separate terminal windows so you can see live logs from each server.

---

## 🔌 API Endpoints

| Method | Endpoint  | Description                                                                                                                |
| ------ | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/health` | Returns `{ "status": "ok" }` — confirms the backend is running                                                             |
| `POST` | `/login`  | Accepts `{ username, password }`; returns `{ success, message }` — currently a stub that accepts any non-empty credentials |
