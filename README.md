<div align="center">

# CHRO'MAG

### _Where Moroccan Culture Meets Contemporary Expression_

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.2-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ✦ About

**Chro'Mag** is a bold, editorial-style digital cultural magazine dedicated to amplifying the voices of young Moroccan creators shaping the contemporary cultural landscape. From street art murals in Casablanca to underground beats in Marrakech — Chro'Mag is the intersection of **heritage and innovation**.

> _"We are the voice of a new generation — where tradition meets rebellion, and culture evolves."_

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

````
frontend/
├── src/
---
## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Docker** and **Docker Compose**

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamedredachakir/ChroMaj-version-public.git
cd ChroMaj-version-public

# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../backend && npm install
````

### Development

```bash
# Frontend
cd frontend
npm run dev:local

# Backend in a second terminal
cd ../backend
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173). Backend runs on [http://localhost:4000](http://localhost:4000).

### Docker Development

```bash
docker compose up --build
```

This starts the full stack described by the project documents:

- Frontend: React + Vite on port `5173`
- Backend: Express + Prisma API on port `4000`
- Database: PostgreSQL on port `5432`

```bash
# Start in the background
docker compose up -d --build

# Stop containers
docker compose down

# Reset containers and rebuild images
docker compose down -v
docker compose build --no-cache
```

If you add or remove frontend or backend dependencies, prefer `docker compose down -v` before rebuilding so container `node_modules` volumes are recreated cleanly.

Note: Prisma commands that apply the schema outside Docker require `DATABASE_URL` to be set in the shell environment. If it is missing, `npm run prisma:push` fails with Prisma error `P1012`.

### Production Build

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

docker compose up --build

````

```bash
# Start in the background
docker compose up -d --build

# Reset containers and rebuild images
docker compose down -v
docker compose build --no-cache
````

If you add or remove frontend or backend dependencies, prefer `docker compose down -v` before rebuilding so container `node_modules` volumes are recreated cleanly.

### Production Build

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

---

## 📦 Tech Stack

| Technology                                    | Version | Purpose                         |
| --------------------------------------------- | ------- | ------------------------------- |
| [React](https://react.dev/)                   | 18.3    | UI component framework          |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type safety                     |
| [Vite](https://vitejs.dev/)                   | 6.3     | Build tool & dev server         |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.1     | Utility-first styling           |
| [Express](https://expressjs.com/)             | 4.21    | Backend REST API                |
| [Prisma](https://www.prisma.io/)              | 6.5     | Database ORM and schema         |
| [PostgreSQL](https://www.postgresql.org/)     | 16      | Relational database             |
| [JWT](https://jwt.io/)                        | 9.0     | Authentication token strategy   |
| [Motion (Framer)](https://motion.dev/)        | 12.2    | Animations & scroll transitions |
| [Lucide React](https://lucide.dev/)           | 0.487   | Icon system                     |
| [Radix UI](https://www.radix-ui.com/)         | Various | Accessible UI primitives        |

---

## 🔎 Current Project State

The repository now runs as a working full-stack implementation aligned with the PRD/SRS/ERD foundation.

- Implemented now: routed frontend pages, JWT auth flow, protected admin dashboard, PostgreSQL-backed content APIs, artist submission review pipeline, comments/likes, newsletter signup, and Docker orchestration.
- Live features: article/artist/event listing, detail pages, server-side search/filter/pagination, admin create/update/delete for articles, events, and artworks, artist submission/review, story comments/likes, and newsletter signup.
- Still to build: broader newsletter operations, additional community modules, runtime DB apply in environments missing `DATABASE_URL`, and deeper SEO/performance hardening.

The setup is production-structured for iterative feature delivery, with frontend and backend already integrated end-to-end.

---

## 🧭 Application Routes

- `/` — Editorial landing page
- `/stories` — Live article feed from the backend
- `/stories/:id` — Story detail page
- `/artists` — Live artist directory from PostgreSQL
- `/artists/:id` — Artist detail page
- `/events` — Live events calendar feed
- `/events/:id` — Event detail page
- `/auth` — Login and registration flow
- `/admin` — Protected admin dashboard for authenticated admin users

## 🛠️ Admin Capabilities (Current Step)

The admin dashboard now includes write actions backed by the API:

- Create article from `/admin`
- Create event from `/admin`
- Create artwork from `/admin`
- Update article from `/admin`
- Update event from `/admin`
- Update artwork from `/admin`
- Delete article from `/admin`
- Delete event from `/admin`
- Delete artwork from `/admin`
- Review artist artwork submissions from `/admin`
- Filter submission queue by review status
- View newsletter subscribers from `/admin`
- Auto-refresh dashboard counters after each successful create or review

Public listing pages now include server-backed search and pagination:

- Stories: full-text query + pagination
- Artists: query + role filter + pagination
- Events: query + city filter + pagination

These public pages now sync their state to the URL query string, so filters and pagination survive refreshes and can be shared directly.

Community features now live on story detail pages:

- Authenticated users can like and unlike articles
- Authenticated users can add comments
- Comment authors and admins can delete comments
- Public newsletter signup is available from the landing page CTA and footer

Current protected endpoints:

- `POST /api/admin/articles`
- `PUT /api/admin/articles/:id`
- `DELETE /api/admin/articles/:id`
- `POST /api/admin/artworks`
- `PUT /api/admin/artworks/:id`
- `DELETE /api/admin/artworks/:id`
- `POST /api/admin/events`
- `PUT /api/admin/events/:id`
- `DELETE /api/admin/events/:id`
- `GET /api/admin/submissions`
- `PATCH /api/admin/submissions/:id/review`
- `GET /api/admin/newsletter/subscribers`
- `GET /api/dashboard/summary`
- `GET /api/auth/me`

Public query endpoints:

- `GET /api/articles/query?q=&page=&limit=&categoryId=&sort=latest|oldest`
- `GET /api/artists/query?q=&page=&limit=&role=&sort=newest|oldest`
- `GET /api/events/query?q=&page=&limit=&city=&sort=soonest|latest`

Community and creator endpoints:

- `POST /api/submissions/artworks`
- `GET /api/submissions/me`
- `GET /api/articles/:id/comments`
- `POST /api/articles/:id/comments`
- `DELETE /api/comments/:id`
- `GET /api/articles/:id/likes/me`
- `POST /api/articles/:id/likes/toggle`
- `POST /api/newsletter/subscribe`

## 🔐 Seeded Access

- Admin email: `admin@chromag.local`
- Admin password: `admin1234`
- Artist email: `artist@chromag.local`
- Artist password: `artist1234`
- Seeded newsletter subscribers: `reader@chromag.local`, `community@chromag.local`

---

## 🗓️ Sections Overview

| Section               | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| **Header**            | Fixed navigation, transparent → glass-blur on scroll, responsive hamburger menu |
| **Hero**              | Full-viewport cinematic headline with animated gradient background              |
| **About**             | Two-column editorial statement — identity and mission of Chro'Mag               |
| **Pillars**           | Art · Passion · Culture — Interactive cards with gradient hover effects         |
| **Featured Stories**  | Editorial magazine grid — large hero story + medium story tiles                 |
| **Featured Creators** | Spotlight on 4 Moroccan artists with Instagram/portfolio overlays               |
| **Visual Gallery**    | 9-image interactive photo grid with hover zoom & amber overlay                  |
| **Community CTA**     | Call-to-action with stats: 500+ Creators · 1000+ Stories · 50K+ Members         |
| **Footer**            | Branding, explore links, connect links, and social media icons                  |

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

_Art • Passion • Culture_

</div>
# Chromaj-project-private-v1
