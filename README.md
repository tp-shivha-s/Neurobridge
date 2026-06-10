# 🧠 NeuroBridge

**NeuroBridge** is an accessible health-assistance web application providing support modules tailored for neurodiverse individuals. It currently includes dedicated modules for some conditions such as ASD,Anxiety,OCD,Depression etc.. with a focus on clean, distraction-free UI built with accessibility at its core.

🔗 **Live Demo:** [neurobridge-one.vercel.app](https://neurobridge-one.vercel.app)

---

## ✨ Features

- **Accessibility-first design** — Module components use CSS Modules (no Tailwind) for precise, distraction-free styling
- **Offline-resilient** — Frontend gracefully falls back to `localStorage` if the backend is unavailable
- **Optional Python backend** — Flask + SQLite backend for persistent data via `/api/*` endpoints

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Vite, TypeScript           |
| Styling   | Tailwind CSS, shadcn/ui, CSS Modules (accessibility modules) |
| Backend   | Python, Flask, SQLite (optional)  |
| Database  | Supabase (Edge Functions)         |
| Testing   | Vitest                            |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js & npm](https://github.com/nvm-sh/nvm#installing-and-updating) (via nvm recommended)
- Python 3.x (only if running the optional backend)

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/tp-shivha-shakthiy/Neurobridge.git

# 2. Navigate into the project
cd Neurobridge

# 3. Install dependencies
npm install

# 4. Copy environment variables
cp .env.example .env

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Optional Backend Setup (Flask + SQLite)

```bash
cd backend
python -m venv .venv

# Activate on Linux/macOS
source .venv/bin/activate

# Activate on Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python app.py
```

The backend runs on `http://localhost:5000`. The Vite dev server automatically proxies `/api` requests to it.

> **Note:** The frontend works without the backend — it will fall back to `localStorage` for data persistence.

---

