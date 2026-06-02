# CareerPilot — Frontend Template

Dark navy design with Syne + DM Sans typography.

## Pages included

| Route       | File                              | Description                        |
|-------------|-----------------------------------|------------------------------------|
| `/`         | `src/app/page.tsx`                | Landing page (Hero + Features + How it works + Pricing) |
| `/login`    | `src/app/login/page.tsx`          | Sign in form                       |
| `/signup`   | `src/app/signup/page.tsx`         | Sign up form                       |
| `/dashboard`| From P2 files (see P2 zip)        | Dashboard with sidebar             |

## Components

| Component          | Description                                      |
|--------------------|--------------------------------------------------|
| `Navbar`           | Sticky nav, scrolled blur, mobile menu          |
| `Hero`             | Animated headline, typing effect, CTA           |
| `Features`         | 4-pillar grid with hover effects                |
| `HowItWorks`       | 4-step process with connector line              |
| `Pricing`          | Free + Pro plan cards                           |
| `Footer`           | Simple footer with links                        |

## Setup

```bash
# 1. Copy these files into your careerpilot/ project root
# 2. Install Google Fonts (already in globals.css via @import)
# 3. Run
npm run dev
```

## Connecting auth (login + signup pages)

The login and signup pages import `@/lib/supabase/client` — this is provided by P1.
Once P1 pushes their files, the forms will be fully wired.

## Design tokens (CSS variables in globals.css)

```
--navy        #0a0f1e   Page background
--navy-2      #111827   Slightly lighter surfaces
--navy-3      #1a2236   Cards, inputs
--blue        #2563eb   Primary CTA
--blue-light  #60a5fa   Accent text, icons
--cream       #f5f3ee   Primary text
--muted       #94a3b8   Secondary text
--border      rgba(255,255,255,0.08)
```
