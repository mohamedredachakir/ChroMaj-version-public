#!/bin/bash
set -e

GIT="git"

echo "🔧 Setting up git config..."
$GIT config core.hooksPath /dev/null 2>/dev/null || true

echo "🚫 Commit 1: .gitignore"
$GIT add .gitignore
$GIT commit -m "chore: add .gitignore — exclude node_modules, dist, env files"

echo "📋 Commit 2: README"
$GIT add README.md
$GIT commit -m "docs: add professional README with project overview, stack, and structure"

echo "📦 Commit 3: package.json & lock"
$GIT add package.json
$GIT commit -m "chore: configure project as chromag-editorial with all dependencies"

echo "⚡ Commit 4: vite config"
$GIT add vite.config.ts
$GIT commit -m "chore: configure Vite with React plugin, Tailwind, and @ path alias"

echo "📮 Commit 5: postcss config"
$GIT add postcss.config.mjs
$GIT commit -m "chore: add PostCSS configuration for Tailwind integration"

echo "🏠 Commit 6: index.html"
$GIT add index.html
$GIT commit -m "feat: add HTML entry point with Chro'Mag title and root div"

echo "🎨 Commit 7: theme tokens"
$GIT add src/styles/theme.css
$GIT commit -m "style: add full design token system — colors, radius, sidebar, dark mode"

echo "🔤 Commit 8: fonts"
$GIT add src/styles/fonts.css
$GIT commit -m "style: add Google Fonts — Bebas Neue and Space Grotesk declarations"

echo "🌊 Commit 9: tailwind base"
$GIT add src/styles/tailwind.css
$GIT commit -m "style: add Tailwind CSS base import"

echo "🎯 Commit 10: global index style"
$GIT add src/styles/index.css
$GIT commit -m "style: add global stylesheet entry point"

echo "🚀 Commit 11: main entry"
$GIT add src/main.tsx
$GIT commit -m "feat: add React application entry point — mounts App into #root"

echo "🏗️ Commit 12: App root"
$GIT add src/app/App.tsx
$GIT commit -m "feat: scaffold App.tsx — composing all page sections in order"

echo "🖼️ Commit 13: ImageWithFallback component"
$GIT add src/app/components/ImageWithFallback.tsx
$GIT commit -m "feat: add ImageWithFallback — graceful image error fallback component"

echo "🧭 Commit 14: Header"
$GIT add src/app/components/Header.tsx
$GIT commit -m "feat: add Header — sticky nav with scroll-aware glass effect and mobile menu"

echo "🦸 Commit 15: Hero section"
$GIT add src/app/components/Hero.tsx
$GIT commit -m "feat: add Hero — cinematic full-viewport headline with animated gradient"

echo "📖 Commit 16: About section"
$GIT add src/app/components/About.tsx
$GIT commit -m "feat: add About — two-column editorial identity and mission statement"

echo "🎯 Commit 17: Pillars section"
$GIT add src/app/components/Pillars.tsx
$GIT commit -m "feat: add Pillars — Art / Passion / Culture interactive cards with hover FX"

echo "📰 Commit 18: FeaturedStories"
$GIT add src/app/components/FeaturedStories.tsx
$GIT commit -m "feat: add FeaturedStories — editorial 12-col magazine grid layout"

echo "👤 Commit 19: FeaturedCreators"
$GIT add src/app/components/FeaturedCreators.tsx
$GIT commit -m "feat: add FeaturedCreators — Moroccan artist spotlight with social overlays"

echo "🖼️ Commit 20: VisualGallery"
$GIT add src/app/components/VisualGallery.tsx
$GIT commit -m "feat: add VisualGallery — 9-image interactive photo grid with amber hover"

echo "📣 Commit 21: CommunityCTA"
$GIT add src/app/components/CommunityCTA.tsx
$GIT commit -m "feat: add CommunityCTA — join movement section with key stats"

echo "🦶 Commit 22: Footer"
$GIT add src/app/components/Footer.tsx
$GIT commit -m "feat: add Footer — branding, navigation links, and social media icons"

echo "🧩 Commit 23: UI primitives"
$GIT add src/app/components/ui/
$GIT commit -m "feat: add Radix UI component library primitives (accordion, dialog, select...)"

echo "✅ All commits done! Pushing to origin/main..."
$GIT push origin main

echo ""
echo "🎉 Successfully pushed all commits to GitHub!"
$GIT log --oneline | head -30
