<div align="center">

# CHRO'MAG

### *Where Moroccan Culture Meets Contemporary Expression*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.2-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ✦ About

**Chro'Mag** is a bold, editorial-style digital cultural magazine dedicated to amplifying the voices of young Moroccan creators shaping the contemporary cultural landscape. From street art murals in Casablanca to underground beats in Marrakech — Chro'Mag is the intersection of **heritage and innovation**.

> *"We are the voice of a new generation — where tradition meets rebellion, and culture evolves."*

---

## 🎨 Design Philosophy

The UI is crafted around a **dark editorial aesthetic** inspired by premium print magazines and modern cultural platforms:

- 🖤 **Dark-first palette** — deep blacks and zinc tones as the canvas
- 🔥 **Amber accent** (`#F59E0B`) — warm fire-tone used for interactive highlights
- ✍️ **Bebas Neue** — bold, condensed display font for headlines
- 📐 **Space Grotesk** — clean, contemporary font for body text
- 🎬 **Cinematic animations** — scroll-triggered reveals via Framer Motion
- 📰 **Magazine-style grid** — editorial 12-column layout for stories

---

## 🧱 Project Structure

```
src/
├── app/
│   ├── App.tsx                        # Root layout — orchestrates all sections
│   └── components/
│       ├── Header.tsx                 # Sticky transparent → opaque nav on scroll
│       ├── Hero.tsx                   # Full-screen animated hero with headline
│       ├── About.tsx                  # Editorial identity section
│       ├── Pillars.tsx                # Art / Passion / Culture cards with hover FX
│       ├── FeaturedStories.tsx        # Editorial story grid (12-col magazine layout)
│       ├── FeaturedCreators.tsx       # 4-column creator showcase with overlay links
│       ├── VisualGallery.tsx          # 9-image masonry-style interactive gallery
│       ├── CommunityCTA.tsx           # Join movement CTA + community stats
│       ├── Footer.tsx                 # Branding, nav links, social icons
│       └── ImageWithFallback.tsx      # Image component with graceful error state
├── styles/
│   ├── index.css                      # Entry stylesheet
│   ├── tailwind.css                   # Tailwind base import
│   ├── fonts.css                      # Google Fonts declarations
│   └── theme.css                      # Design token system (CSS custom properties)
└── main.tsx                           # React app entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamedredachakir/ChroMaj-version-public.git
cd ChroMaj-version-public

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.3 | UI component framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Vite](https://vitejs.dev/) | 6.3 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Utility-first styling |
| [Motion (Framer)](https://motion.dev/) | 12.2 | Animations & scroll transitions |
| [Lucide React](https://lucide.dev/) | 0.487 | Icon system |
| [Radix UI](https://www.radix-ui.com/) | Various | Accessible UI primitives |

---

## 🗓️ Sections Overview

| Section | Description |
|---|---|
| **Header** | Fixed navigation, transparent → glass-blur on scroll, responsive hamburger menu |
| **Hero** | Full-viewport cinematic headline with animated gradient background |
| **About** | Two-column editorial statement — identity and mission of Chro'Mag |
| **Pillars** | Art · Passion · Culture — Interactive cards with gradient hover effects |
| **Featured Stories** | Editorial magazine grid — large hero story + medium story tiles |
| **Featured Creators** | Spotlight on 4 Moroccan artists with Instagram/portfolio overlays |
| **Visual Gallery** | 9-image interactive photo grid with hover zoom & amber overlay |
| **Community CTA** | Call-to-action with stats: 500+ Creators · 1000+ Stories · 50K+ Members |
| **Footer** | Branding, explore links, connect links, and social media icons |

---

## 🌍 Topics Covered

Chro'Mag documents the raw, unfiltered creativity at the heart of Morocco's cultural new wave:

- 🎨 **Street Art & Graffiti** — Casablanca's emerging mural scene
- 🎵 **Music & Production** — North African underground sound
- 📸 **Photography** — Visual storytelling from the streets
- 💃 **Dance & Performance** — Hip-hop, breaking culture in Moroccan cities
- 🏛️ **Heritage & Architecture** — Modern reimagining of Moroccan tradition
- 👗 **Fashion** — Streetwear fused with traditional craft

---

## 📄 License

This project is personal and proprietary. All rights reserved © 2026 **Chro'Mag**.

---

<div align="center">

**Built with passion for Moroccan culture** 🇲🇦

*Art • Passion • Culture*

</div>
