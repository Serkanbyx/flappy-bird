# Flappy Bird

A classic Flappy Bird clone built with modern web technologies. Tap or press space to flap your wings and navigate through pipes!

![Flappy Bird](https://img.shields.io/badge/Game-Flappy%20Bird-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss)

## Features

- **Canvas-based rendering** - Smooth 60fps gameplay using HTML5 Canvas
- **Zustand state management** - Lightweight and performant game state
- **Responsive design** - Playable on desktop and mobile
- **Score persistence** - Best score saved to localStorage
- **Retro pixel art style** - Custom drawn bird, pipes, and environment
- **Touch & keyboard support** - Space, ArrowUp, tap, or click to play

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI components & overlays |
| Vite 6 | Build tool & dev server |
| TypeScript 5 | Type safety |
| Zustand 5 | Game state management |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | UI overlay styling |
| HTML5 Canvas | Game rendering engine |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/flappy-bird.git
cd flappy-bird

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## How to Play

| Control | Action |
|---|---|
| `Space` / `ArrowUp` | Flap wings |
| `Click` / `Tap` | Flap wings |
| `Enter` | Start / Restart |

Navigate through the pipes without hitting them or the ground. Each pipe passed earns 1 point!

## Project Structure

```
src/
├── components/         # React UI components
│   ├── GameCanvas.tsx  # Main canvas rendering component
│   ├── GameOverScreen.tsx
│   └── StartScreen.tsx
├── constants/          # Game configuration constants
│   └── game.ts
├── engine/             # Canvas rendering engine
│   └── renderer.ts
├── hooks/              # Custom React hooks
│   ├── useGameLoop.ts
│   └── useInputHandler.ts
├── pages/              # Route pages
│   └── GamePage.tsx
├── store/              # Zustand state management
│   └── useGameStore.ts
├── types/              # TypeScript type definitions
│   └── game.ts
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## Deployment

This project is configured for **Netlify** deployment:

1. Connect your GitHub repository to Netlify
2. Build settings are auto-configured via `netlify.toml`
3. Build command: `npm run build`
4. Publish directory: `dist`

## License

MIT
