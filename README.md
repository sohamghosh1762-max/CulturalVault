# 🌍 CulturalVault — World Heritage Explorer

A production-ready, full-stack cultural heritage web application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

![CulturalVault Preview](https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80)

---

## ✨ Features

### Core
- 📦 **Responsive Grid Layout** — Adaptive card grid with mobile-first design
- 🔍 **Debounced Search** — Real-time search with 350ms debounce for performance
- 🏷️ **Category Filtering** — Filter by 8 cultural categories with animated pill buttons
- ↕️ **Sort Controls** — Sort by newest, oldest, highest rated, or alphabetically
- 📄 **Pagination** — Smart pagination with ellipsis for large result sets
- 🗺️ **Detail Pages** — Rich item detail pages with dynamic routing (`/item/[id]`)
- 🌐 **REST API Routes** — Next.js API routes with full filter/sort/pagination support

### UI/UX
- 🌙 **Dark / Light Mode** — System-aware theme with manual toggle via `next-themes`
- 💀 **Loading Skeletons** — Shimmer skeleton states for every loading scenario
- ⚠️ **Error States** — Graceful error and empty state components
- 🎬 **Framer Motion** — Page load animations, staggered card reveals, scroll effects
- 📱 **Mobile-First** — Fully responsive across all breakpoints

### Bonus
- 🔖 **Bookmarks System** — Persistent favorites using `localStorage` via Context API
- ⭐ **Rating Display** — Visual star ratings with review count formatting
- 🎨 **Warm Amber Theme** — Distinctive editorial color palette (amber/orange)
- 🏛️ **Typography** — Playfair Display (headings) + DM Sans (body) pairing
- 🔗 **Share API** — Native Web Share API with clipboard fallback

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Theme | next-themes |
| State | React Context API + localStorage |
| Search | use-debounce |
| Icons | Lucide React |
| Fonts | Google Fonts (Playfair Display, DM Sans) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + CSS variables
│   ├── bookmarks/
│   │   └── page.tsx            # Bookmarks collection page
│   ├── item/
│   │   └── [id]/
│   │       └── page.tsx        # Dynamic item detail page
│   └── api/
│       └── items/
│           └── route.ts        # REST API endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   └── ThemeProvider.tsx
│   ├── cards/
│   │   ├── ItemCard.tsx
│   │   └── ItemGrid.tsx
│   ├── search/
│   │   └── SearchBar.tsx
│   ├── filters/
│   │   ├── CategoryFilter.tsx
│   │   └── SortSelect.tsx
│   ├── skeletons/
│   │   ├── CardSkeleton.tsx
│   │   └── DetailSkeleton.tsx
│   └── ui/
│       ├── ErrorState.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       ├── RatingStars.tsx
│       └── Toaster.tsx
├── context/
│   └── BookmarksContext.tsx    # Bookmarks state + localStorage
├── hooks/
│   └── index.ts                # useItems, useItem, useFeaturedItems, etc.
├── services/
│   └── itemsService.ts         # Centralized API service layer
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   └── index.ts                # cn(), formatNumber(), getCategoryColor(), etc.
└── lib/
    └── mockData.ts             # 12-item cultural heritage dataset
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cultural-vault.git
cd cultural-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

---

## 🌐 API Reference

### `GET /api/items`

Query parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | `""` | Full-text search across title, description, tags |
| `category` | string | `"All"` | Filter by category |
| `sortBy` | string | `"newest"` | `newest` \| `oldest` \| `rating` \| `title` |
| `page` | number | `1` | Pagination page |
| `limit` | number | `8` | Items per page |

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 8,
    "total": 12
  }
}
```

---

## ☁️ Deployment on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments on push.

**Environment Variables:** None required for the base application (uses mock data).

---

## 🎨 Design Decisions

- **Warm Amber Palette**: Chosen to evoke the warmth of cultural artifacts and heritage materials
- **Playfair Display**: Editorial serif font that conveys cultural sophistication  
- **8px Border Radius**: Balanced between modern and approachable
- **350ms Debounce**: Optimal balance between responsiveness and API call reduction
- **Shimmer Skeletons**: Preferred over spinners for perceived performance

---

## 📈 Performance

- Images optimized via Next.js `<Image>` component with proper `sizes` attributes
- Debounced search prevents excessive re-renders
- `AnimatePresence` for smooth grid transitions without layout thrashing
- CSS-based shimmer animations (no JavaScript timers)

---

## 📄 License

MIT © 2024 CulturalVault
