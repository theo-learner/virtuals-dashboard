# Virtuals Protocol aGDP Dashboard

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://virtuals-dashboard.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-54%20passed-success)](.)
[![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)](.)

Real-time AI agent rankings, revenue analytics & insights for the [Virtuals Protocol](https://virtuals.io) ecosystem.

🔗 **Live Demo**: [virtuals-dashboard.vercel.app](https://virtuals-dashboard.vercel.app)

---

## ✨ Features

### 📊 Core Analytics
- **Real-time Rankings**: Live leaderboard of AI agents by revenue, success rate, and ratings
- **Agent Profiles**: Detailed pages with market data, token info, holder analytics
- **Category Distribution**: Visual breakdown by DeFi, Social, Gaming, etc.
- **Revenue Charts**: Top 20 revenue performers, success rate correlation
- **Role Analysis**: Distribution of agent types (Autonomous, Manual, etc.)

### 🌐 Internationalization (i18n)
- **Bilingual Support**: Korean (default) & English
- **Live Language Switching**: Instant locale toggle in navbar
- **Fully Localized**: 80+ translation keys across all pages

### 🎨 User Experience
- **Dark/Light Theme**: Persistent theme toggle with localStorage
- **Skeleton Loading**: Smooth loading states for all pages
- **Responsive Design**: Mobile-first, optimized for all screen sizes
- **Accessibility**: ARIA labels, skip-to-content, keyboard navigation

### ⚡ Performance
- **Next.js 15**: App Router with server components
- **Image Optimization**: Automatic lazy loading via next/image
- **API Caching**: 5-minute revalidation with stale-while-revalidate
- **PWA Ready**: Manifest + icons for installable experience

### 🔍 SEO & Discovery
- **Rich Metadata**: OpenGraph, Twitter Card, structured data (JSON-LD)
- **Dynamic Meta**: Per-agent metadata generation
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Sitemap Ready**: Crawlable structure

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: TypeScript

### Testing
- **Unit Tests**: [Vitest](https://vitest.dev/) — 54 tests, 89% coverage
- **E2E Tests**: [Playwright](https://playwright.dev/) — 9 tests
- **Test Coverage**: Lines 89%, Branches 73%, Functions 81%

### DevOps
- **Deployment**: [Vercel](https://vercel.com/)
- **CI/CD**: Git-based auto-deploy
- **Analytics**: Built-in edge analytics

### APIs
- **Data Source**: Virtuals Protocol API
- **Rate Limiting**: IP-based protection
- **Caching**: Next.js fetch cache + CDN edge

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on v22.22.0)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/theo-learner/virtuals-dashboard.git
cd virtuals-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run test      # Run unit tests
npm run test:e2e  # Run E2E tests (Playwright)
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── agent/[id]/        # Dynamic agent detail pages
│   ├── analytics/         # Analytics dashboard
│   ├── insights/          # AI insights page
│   ├── api/               # API routes (ranking, gap-score, etc.)
│   ├── layout.tsx         # Root layout + providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + theme variables
├── components/            # React components
│   ├── Charts.tsx         # Recharts visualizations
│   ├── Navbar.tsx         # Navigation + theme/locale toggles
│   ├── RankingTable.tsx   # Main ranking table/grid
│   ├── LocaleSwitcher.tsx # Language toggle
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── lib/                   # Utilities & contexts
│   ├── api.ts             # API client functions
│   ├── i18n.ts            # Internationalization utilities
│   ├── LocaleContext.tsx  # Locale state management
│   ├── ThemeContext.tsx   # Theme state management
│   ├── format.ts          # Number/date formatters
│   └── rate-limit.ts      # API rate limiting
└── e2e/                   # Playwright E2E tests
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test              # Run all tests
npm run test:coverage     # With coverage report
```

**Coverage**: 54 tests across 16 files, 89.36% line coverage

### E2E Tests
```bash
npx playwright test       # Run E2E suite
npx playwright test --ui  # Interactive UI mode
```

**Suites**:
- Home page navigation & locale switching
- Agent detail page loading
- Analytics & insights pages
- 404 error handling

---

## 🌍 Internationalization

Supported languages:
- 🇰🇷 **Korean** (default)
- 🇬🇧 **English**

To add a new language:
1. Add translations to `src/lib/i18n.ts`
2. Update `Locale` type
3. Add flag/label to `LocaleSwitcher.tsx`

---

## 🎨 Theming

The dashboard supports dark and light modes with CSS custom properties.

**Customize colors** in `src/app/globals.css`:
```css
@theme {
  --color-accent-primary: #8B5CF6;
  --color-cyan-neon: #00FFD1;
  /* ... */
}
```

Theme persists via localStorage and syncs across tabs.

---

## 📊 API Endpoints

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `/api/ranking` | Fetch agent rankings | 5 min |
| `/api/gap-score` | Calculate gap analysis | - |
| `/api/analyze` | AI analysis (OpenAI) | - |
| `/api/translate` | Text translation | - |

**External API**: `https://api.virtuals.io/api/`

---

## 🔐 Security

- **Rate Limiting**: 60 requests/hour per IP
- **Input Validation**: API guard layer
- **CORS**: Configured for trusted origins
- **No Secrets in Frontend**: All sensitive keys server-side only

---

## 📈 Performance Metrics

- **Bundle Size**: ~147KB gzip (main page)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive**: < 2s on 4G
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `test:` add/update tests
- `perf:` performance improvement
- `docs:` documentation

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Virtuals Protocol** for the API and ecosystem
- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Open Source Community** for tools and libraries

---

## 📧 Contact

- **Project**: [github.com/theo-learner/virtuals-dashboard](https://github.com/theo-learner/virtuals-dashboard)
- **Live Site**: [virtuals-dashboard.vercel.app](https://virtuals-dashboard.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/theo-learner/virtuals-dashboard/issues)

---

**Built with ❤️ for the Virtuals Protocol community**
