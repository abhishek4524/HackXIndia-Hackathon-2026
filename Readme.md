# 🌾 Krishi Sakhi  
### AI-Powered Digital Companion for Indian Farmers  
**HackXIndia 2026 | Team : Silent Hacker AK | 24-Hour Hackathon Prototype**

---

## 🧩 Problem

Indian farmers face **fragmented, delayed, and inaccessible information** across the crop lifecycle:

- Crop disease identification requires expert access  
- Weather & air quality data is scattered and hard to interpret  
- Market prices are inconsistent across sources  
- Most digital tools are **not designed for regional languages or voice usage**

This gap leads to **financial loss, reduced yield, and delayed decisions**.

---

## 💡 Solution — Krishi Sakhi

**Krishi Sakhi** is a **single, unified farmer dashboard** that combines:

- 🌱 AI-based crop health analysis (from images)  
- 🗣️ Voice & text-based AI assistant  
- 🌦️ Weather + AQI insights  
- 💹 Real-time crop market prices  
- 🌐 Multi-language support (Indian languages)

> The goal is not just information — but **actionable, timely guidance** in a farmer-friendly way.

---

## 🎯 Why Krishi Sakhi Matters

| Challenge | How Krishi Sakhi Solves It |
|---------|----------------------------|
| Low digital literacy | Voice-first interaction |
| Language barrier | Regional language support |
| Late disease detection | Image-based AI analysis |
| Uncertain selling prices | Live mandi/market prices |
| Multiple apps | One unified dashboard |

---

## 🚀 Key Features

### 📊 Farmer Dashboard
- Location-aware **weather (°C)**
- **Air Quality Index (AQI)** for health awareness
- Clean, mobile-first UI

### 🗣️ Krishi Sakhi (AI Voice Assistant)
- Speech-to-Text (STT)
- AI-generated advisory responses
- Text-to-Speech (TTS)
- Works in multiple Indian languages

### 🌾 Crop Health Analysis
- Upload crop image
- AI identifies possible diseases
- Helps in **early intervention**

### 💹 Market Price Widget
- Crop-wise prices from public APIs
- State-based filtering
- Offline/demo fallback support

### 🌐 Multi-Language Support
- English  
- Hindi  
- Malayalam  
*(Easily extensible via JSON)*

---

## 🏗️ Architecture Overview (Client)

Next.js (App Router)
│
├── Dashboard (Weather, AQI, Market)
├── Krishi Sakhi Chat (Voice + AI)
├── Crop Health (Image → AI)
├── Advisory / Knowledge Pages
│
├── components/ui → Reusable UI components
├── contexts → Language & Auth context
├── lib → API helpers
└── locales → en / hi / ml


---

## 🧠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Component-driven UI architecture

### APIs & Services
- Weather & AQI: OpenWeatherMap  
- Crop health: Plant.id (or equivalent AI API)  
- Market prices: data.gov.in  
- AI Assistant: OpenAI / OpenRouter compatible endpoint  
- Auth (client): Clerk  

---

## 🔄 Data Flow (High-Level)

#### User (Voice / Text / Image)
#### ↓
#### Next.js Client UI
#### ↓
#### External APIs (Weather / Crop / Market / AI)
#### ↓
#### Processed Response
#### ↓
#### Farmer-friendly UI + Voice Output


---

## ⚙️ Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm

### Run
```bash
cd client
npm install
npm run dev
Open: http://localhost:3000

🔐 Environment Variables
Create client/.env.local

NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY=
NEXT_PUBLIC_PLANT_ID_API_KEY=
NEXT_PUBLIC_PLANT_ID_API_URL=
NEXT_PUBLIC_MARKET_PRICE_API_KEY=
NEXT_PUBLIC_MARKET_PRICE_RESOURCE_ID=
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_OPENAI_API_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
⚠️ Secrets are not committed.
Server-only keys should never use NEXT_PUBLIC_.

🛠️ Common Issues
CORS errors → Use server-side API proxy

Kelvin temperature (~296) → &units=metric added

Voice not working → Use Chrome (best STT/TTS support)

📈 Scalability & Future Scope
Server-side API routes for secure key handling

SMS / IVR alerts for non-smartphone farmers

Geo-based pest & disease outbreak alerts

AI advisory using weather + soil + history

Government scheme recommendations

🏆 HackXIndia Submission Highlights
✅ Solo project

⏱️ Built in ~24 hours

🌾 India-wide farmer focus

🗣️ Voice-first, multilingual design

🧩 Modular & scalable architecture

🎯 Strong real-world relevance

📂 Important Files
Dashboard → app/dashboard/page.tsx

Crop Health → app/crop-health/page.tsx

Krishi Sakhi Chat → app/krishi-sakhi-chat/page.tsx

Market Widget → components/ui/MarketPriceWidget.tsx

Language Context → contexts/language-context.tsx

🔗 Live Demo & Explanation
Live URL (Vercel): https://krishi-sakhi-xi.vercel.app/

Full explanation & demo video: https://drive.google.com/file/d/1sfncYRHvCDOzY995cJ-teEy-fPa10EK9/view?usp=sharing

👤 Author
Abhishek Kumar
Silent Hacker AK — HackXIndia 2026

Built with a focus on impact, usability, and feasibility, not just features.