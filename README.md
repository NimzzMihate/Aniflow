# AniFlow

> A modern anime streaming platform with multi-language support, watchlist, and watch history tracking.

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.100-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

</div>

---

## Features

- **Multi-language** — English, Indonesian, Japanese, and Korean (custom i18n)
- **Authentication** — Login & Register via Supabase Auth
- **Watchlist** — Save anime to watch later, synced to your account
- **Watch History** — Automatically tracks episodes and progress per user
- **Video Player** — HTML5 player with full controls
- **Browse & Filter** — Filter by genre, status; sort by rating or popularity
- **Rankings** — Top rated and most popular anime pages
- **Responsive** — Mobile-first design, works on all screen sizes

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Framer Motion |
| UI | shadcn/ui, Lucide Icons |
| Backend | Supabase (Auth + PostgreSQL) |
| State | React Context, React Query |
| Routing | React Router v6 |
| i18n | Custom context with 4 language files |

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A [Supabase](https://supabase.com) project (free tier works fine)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/aniflow.git
cd aniflow
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Setup environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

> Get these values from your Supabase project → **Settings → API**.

### 4. Setup the database

Open your Supabase project → **SQL Editor**, then run the contents of [`setup.sql`](./setup.sql).

This creates the `profiles`, `watchlist`, and `watch_history` tables with proper RLS policies.

### 5. Run the dev server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── AnimeCard.tsx
│   ├── AnimeRow.tsx
│   ├── Navbar.tsx
│   └── ...
├── data/                # Anime data & helper functions
├── integrations/        # Supabase client setup
├── lib/                 # Context providers (Auth, i18n)
├── pages/               # Page-level components
│   ├── Index.tsx        # Home page
│   ├── Browse.tsx       # Browse with filters
│   ├── AnimeDetail.tsx  # Anime detail page
│   ├── Watch.tsx        # Video player
│   ├── Watchlist.tsx    # User watchlist
│   ├── History.tsx      # Watch history
│   └── Profile.tsx      # User profile
├── App.tsx              # Route definitions
├── main.tsx             # App entry point
└── index.css            # Global styles
```

---

## Database Schema

### `profiles`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users` |
| `display_name` | `text` | Display name |
| `avatar_url` | `text` | Profile picture URL |
| `preferred_language` | `text` | Default language (`en` / `id` / `ja` / `ko`) |

### `watchlist`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users` |
| `anime_id` | `text` | Anime identifier |
| `added_at` | `timestamptz` | When it was added |

### `watch_history`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users` |
| `anime_id` | `text` | Anime identifier |
| `episode_number` | `integer` | Episode number |
| `progress_seconds` | `integer` | Playback progress |
| `watched_at` | `timestamptz` | Last watched timestamp |

---

## Supported Languages

| Code | Language |
|---|---|
| `en` | English |
| `id` | Indonesian |
| `ja` | Japanese |
| `ko` | Korean |

To add a new language, create a translation file in `src/lib/i18n/` and register it in the i18n context.

---

## Anime List

| ID | Title | Episodes | Status |
|---|---|---|---|
| `one-punch-man-s3` | One Punch Man Season 3 | 12 | Airing |
| `pokemon-2024` | Pokémon (2024) | 52 | Airing |
| `jujutsu-kaisen` | Jujutsu Kaisen | 48 | Airing |
| `majo-no-tabitabi` | Wandering Witch | 12 | Completed |
| `kimi-no-nawa` | Your Name | 1 (Movie) | Completed |

---

## Build for Production

```bash
npm run build
# or
bun run build
```

Output goes to the `dist/` folder. You can preview the production build with:

```bash
npm run preview
```

---

## Roadmap

- [ ] Comments & rating system
- [ ] Continue watching section on home page
- [ ] Push notifications for new episodes
- [ ] Dark / light theme toggle
- [ ] Download episodes for offline viewing
- [ ] Admin dashboard for managing anime data

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## Credits

- Video samples — [Google GVT Videos](https://www.w3schools.com/html/mov_bbb.mp4)
- Anime metadata — [MyAnimeList](https://myanimelist.net)
- Icons — [Lucide](https://lucide.dev)
- UI components — [shadcn/ui](https://ui.shadcn.com)

---

## License

[MIT](./LICENSE) — free to use for learning and portfolio projects.
