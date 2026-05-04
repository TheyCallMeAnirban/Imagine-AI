# 🗄️ IMAGINE_AI.exe

**ImagineAI** is a high-performance, production-ready AI studio built with a strict "Analogue Brutalist" aesthetic. It integrates lightning-fast LLM inference with on-the-fly image generation, wrapped in an extremely rigid, desktop-like user interface. 

The application utilizes autonomous tool-calling to determine when a user is requesting visual artwork versus standard text interaction. 

## ✨ Key Features

- **Real-Time Token Streaming**: Built with FastAPI `StreamingResponse` and Server-Sent Events (SSE), delivering ChatGPT-like real-time typing with absolutely zero proxy buffering.
- **Autonomous Image Synthesis**: The Groq `llama-3.3-70b` model acts as an intelligent router. If a visual request is detected, the AI buffers the stream, initiates a background image synthesis via Pollinations.ai, and injects the final masterpiece natively into the UI.
- **Analogue UI**: A strict black-and-white design system with a mathematical CSS variable Dark Mode that seamlessly flips contrast while preserving image color integrity. 
- **LRU Cache & Persistence**: 
  - **Backend**: Uses SQLAlchemy and SQLite to permanently cache image histories, utilizing an automated Least Recently Used (LRU) algorithm to prune records exceeding 10 items.
  - **Frontend**: Integrates `localStorage` to securely persist active conversation histories across browser reloads.
- **Native UX Mechanics**: Includes a custom-built image lightbox modal, auto-expanding text areas, Markdown syntax rendering (`react-markdown`), and seamless "Copy to Clipboard" functionality.

## 🛠️ Technology Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (Strict custom variables)
- Lucide React (Iconography)

**Backend**
- Python 3.11 + FastAPI
- Groq (`AsyncOpenAI` SDK wrapper)
- Pollinations.ai (Zero-config Image Generation)
- SQLAlchemy + SQLite

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v20+)
- Python (v3.11+)

### 2. Environment Setup
Create a `.env` file inside the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```
*(Get your free API key from [Groq Console](https://console.groq.com))*

### 3. Running Locally
You will need two terminal windows to run the development environment.

**Terminal 1: Start the Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2: Start the Frontend (Vite)**
```bash
cd src
npm install
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

## ☁️ Deployment (Render)

This project is configured out-of-the-box for a unified full-stack deployment on [Render](https://render.com). 
The `render.yaml` infrastructure-as-code file and `render-build.sh` script handle the orchestration:
1. Compiles the React frontend.
2. Installs Python dependencies.
3. FastAPI automatically mounts the compiled React `dist/` folder and serves the frontend and backend from a single instance.

**Deployment Steps:**
1. Push this repository to GitHub.
2. Connect the repository to your Render dashboard.
3. Render will automatically detect `render.yaml` and deploy the application.
4. Add your `GROQ_API_KEY` to the Environment Variables tab on the Render dashboard.

## 📄 License
This project is for demonstration and portfolio purposes.
